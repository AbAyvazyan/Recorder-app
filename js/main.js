// script.js
let audioContext;
let mediaRecorder;
let recordedChunks = [];
let videoStream, audioStream;
let canvas, canvasContext;
let imageOverlay = null;
let videoElement, playbackElement;
let animationFrameId;
let playbackVideos

document.getElementById('startRecording').onclick = async () => {
    // Get user media
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoStream = mediaStream.getVideoTracks()[0];
    audioStream = mediaStream.getAudioTracks()[0];

    // Set up video element
    videoElement = document.getElementById('videoElement');
    videoElement.srcObject = mediaStream;

    // Set up canvas for video manipulation
    canvas = document.getElementById('canvasElement');
    canvasContext = canvas.getContext('2d');

    videoElement.addEventListener('loadedmetadata', () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.style.display = 'block'

    });

    // Set up audio context for audio manipulation
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    const gainNode = audioContext.createGain();
    source.connect(gainNode).connect(audioContext.destination);

    document.getElementById('micVolume').oninput = (e) => {
        gainNode.gain.value = e.target.value;
    };

    // Create media recorder
    const stream = canvas.captureStream(30);
    const combinedStream = new MediaStream([...stream.getVideoTracks(), ...mediaStream.getAudioTracks()]);

    mediaRecorder = new MediaRecorder(combinedStream);
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = drawPlaybackFrames

    mediaRecorder.start();
    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;


    // Draw video frames to canvas
    requestAnimationFrame(drawVideoFrame);
};

document.getElementById('stopRecording').onclick = () => {
    mediaRecorder.stop();
    videoStream.stop();
    audioStream.stop();
    audioContext.close();
    stopDrawingFrames()

    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;

};

document.getElementById('imageInput').onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            imageOverlay = img;
        };
        img.src = URL.createObjectURL(file);
    }
};

function drawVideoFrame() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        canvasContext.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        if (imageOverlay) {
            canvasContext.drawImage(imageOverlay, 0, 0, 100, 100); // Drawing image overlay
        }
    }
    animationFrameId = requestAnimationFrame(drawVideoFrame);
}

function stopDrawingFrames() {
    cancelAnimationFrame(animationFrameId); // Stop requesting new frames
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    imageOverlay=null
}

function drawPlaybackFrames() {
    playbackVideos = document.getElementById('playbackVideos')
    const playbackVideo = document.createElement('video')
    playbackVideo.setAttribute('controls',true)

    recordedChunks.forEach(item=>{
        const blob = new Blob([item], { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        playbackVideo.src = url
        playbackVideos.appendChild(playbackVideo)
    })
}