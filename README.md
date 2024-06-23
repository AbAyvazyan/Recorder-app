# Audio and Video Recorder with Real-Time Filters

This project is a Core Javascript application.

## Getting Started

### 1.Clone the repository:

```bash
git clone https://github.com/AbAyvazyan/Recorder-app.git
cd Recorder-app
```

### 2.Install Dependencies:

```bash
npm install
```

### 3.Set Up CSS from SCSS Build

```bash
npm run build-css
```

### 4.Start the Application:

```bash
npm run start
```

### 5.Access the Application:Open your browser and navigate to http://127.0.0.1:3000 or you can check the deployed version at https://recorder-app.albertayvazyan.website/.

# Usage

## Recording Audio with Adjustable Microphone Volume

### Start Recording:

#### ● Click the "Play" button to begin recording your audio.

### Adjust Microphone Volume:

#### ● During the recording, you can adjust the microphone volume using the volume slider or input control.

#### ● The changes in volume will be dynamically captured and will affect the playback accordingly. If you increase the volume, the playback will be louder at that point, and if you decrease it, the playback will be quieter.

### Stop Recording:

#### ● Click the "Stop" button to end the recording session.

## Adding Images to the Video

### Start Video Recording:

#### ● Click the "Record Video" button to begin recording your video.

### Add Images:

#### ● During the recording, you can add images by clicking the "Click to choose image" button.

#### ● Select the image file you want to insert.

#### ● The image will appear at the top left point in the recording timeline.

### View Added Images:

#### ● During playback, the added images will be visible at the top left point where they were added during the recording.

## Playback

### Play the Recording:

#### ● Click the "Play" button to start playback of your recorded audio or video.

#### Volume Changes Reflect in Playback:

### ● Any adjustments made to the microphone volume during the recording will be reflected in the playback. For instance, if you increased the volume at a specific point during recording, the playback will have louder audio at that point.

### View Images in Video Playback:

#### ● Any images added during the video recording will be visible at the points where they were inserted. The playback will show these images at the corresponding times.

## Notes

### ● Ensure your microphone and camera permissions are enabled for the recording to function correctly.

### ● The application should handle dynamic volume changes and image insertions without requiring manual syncing.

### By following these steps, you can record audio with adjustable volume levels and add images to your video, ensuring that these changes are accurately reflected during playback.
