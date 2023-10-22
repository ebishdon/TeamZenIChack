const camera = document.getElementById('camera');
const canvas = document.getElementById('frame');
const status = document.getElementById('status');
let model;

async function loadModel() {
    model = await tf.loadLayersModel('model.h5'); // Load your TensorFlow.js model here
    status.textContent = 'Status: Model loaded';
    detectDrowsiness(); // Start detecting drowsiness after the model is loaded
}

async function detectDrowsiness() {
    if (!model) {
        status.textContent = 'Status: Model not loaded';
        return;
    }

    const video = camera;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 640, 480);

    const image = tf.browser.fromPixels(canvas).toFloat().expandDims();
    const prediction = model.predict(image);

    // Implement your drowsiness detection logic here based on the prediction
  /*  const isDrowsy = /* Your drowsiness detection logic */;

    if (isDrowsy) {
        status.textContent = 'Status: Drowsiness detected';
        // Take appropriate action, e.g., sound an alarm or display a warning
    } else {
        status.textContent = 'Status: No drowsiness detected';
    }
    // Continuously detect drowsiness
    requestAnimationFrame(detectDrowsiness);
}

// Start video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        camera.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });

// Load the model when the page loads
window.addEventListener('load', loadModel);
