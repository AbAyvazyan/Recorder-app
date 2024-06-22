import {
    canvas,
    canvasContext,
    imageInput,
    micVolumeSlider,
    startRecordingButton,
    stopRecordingButton,
    videoElement,
    playbackVideos
} from './ui.mjs'

let audioContext;
let mediaRecorder;
let recordedChunks = [];
let videoStream, audioStream;
let imageOverlay = null;
let animationFrameId;


const FRAME_RATE = 30;
const IMAGE_OVERLAY_DIMENSIONS = {width: 100, height: 100};
const IMAGE_OVERLAY_POSITION = {x: 5, y: 5};
startRecordingButton.onclick = async () => {
    try {
        await startRecording();
    } catch (error) {
        alert('Error starting recording:'+error);
    }
};

stopRecordingButton.onclick = stopRecording;

imageInput.onchange = handleImageInput;

async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API or getUserMedia not supported');
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

    setupMediaStreams(mediaStream);
    setupAudioContext(mediaStream);
    setupMediaRecorder();

    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;

    requestAnimationFrame(drawVideoFrame);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (videoStream) videoStream.stop();
    if (audioStream) audioStream.stop();
    if (audioContext) audioContext.close();
    stopDrawingFrames();

    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
}

function handleImageInput(event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            imageOverlay = img;
        };
        img.src = URL.createObjectURL(file);
    }
}

function setupMediaStreams(mediaStream) {
    videoStream = mediaStream.getVideoTracks()[0];
    audioStream = mediaStream.getAudioTracks()[0];
    videoElement.srcObject = mediaStream;

    videoElement.addEventListener('loadedmetadata', () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.style.display = 'block';
    });
}

function setupAudioContext(mediaStream) {
    audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = micVolumeSlider.value;

    const destination = audioContext.createMediaStreamDestination();
    mediaStreamSource.connect(gainNode);
    gainNode.connect(destination);

    micVolumeSlider.oninput = (e) => {
        if (gainNode) {
            gainNode.gain.value = e.target.value;
        }
    };

    return destination;
}

function setupMediaRecorder() {
    const videoStream = canvas.captureStream(FRAME_RATE);
    const audioDestination = setupAudioContext(videoElement.srcObject);
    const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = drawPlaybackFrames;
    mediaRecorder.start();
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function drawVideoFrame() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        canvasContext.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        if (imageOverlay) {
            canvasContext.drawImage(imageOverlay, IMAGE_OVERLAY_POSITION.x, IMAGE_OVERLAY_POSITION.y, IMAGE_OVERLAY_DIMENSIONS.width, IMAGE_OVERLAY_DIMENSIONS.height);
        }
    }
    animationFrameId = requestAnimationFrame(drawVideoFrame);
}

function stopDrawingFrames() {
    cancelAnimationFrame(animationFrameId);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    imageOverlay = null;
}

function drawPlaybackFrames() {
    playbackVideos.innerHTML = '';
    recordedChunks.forEach((item) => {
        const blob = new Blob([item], {type: 'video/webm'});
        const url = URL.createObjectURL(blob);
        const playbackVideo = document.createElement('video');
        playbackVideo.setAttribute('controls', true);
        playbackVideo.src = url;
        playbackVideos.appendChild(playbackVideo);
    });
}
