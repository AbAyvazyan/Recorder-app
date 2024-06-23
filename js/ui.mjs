const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const canvas = document.getElementById('canvasElement');
const canvasContext = canvas.getContext('2d');
const videoElement = document.getElementById('videoElement');
const micVolumeSlider = document.getElementById('micVolume');
const imageInput = document.getElementById('imageInput');
const playbackVideos = document.getElementById('playbackVideos');

export {
  stopRecordingButton,
  startRecordingButton,
  canvas,
  canvasContext,
  micVolumeSlider,
  imageInput,
  videoElement,
  playbackVideos,
};
