// Get references to the car, front light, and back light elements
const carElement = document.querySelector('.car');
const frontLight = document.querySelector('.front-light');
const backLight = document.querySelector('.back-light');

// Get a reference to the stop button
const stopButton = document.getElementById('stopButton');

// Create a variable to track if the car is moving and if hazard lights are on
let carMoving = true;
let hazardLightsOn = false;
let hazardLightInterval;

// Function to toggle the hazard lights
function toggleHazardLights() {
  if (!hazardLightsOn) {
    frontLight.classList.add('hazard-light-on');
    backLight.classList.add('hazard-light-on');
    hazardLightInterval = setInterval(() => {
      frontLight.classList.toggle('hazard-light-on');
      backLight.classList.toggle('hazard-light-on');
    }, 500); // Adjust the interval for your desired blinking speed
  } else {
    frontLight.classList.remove('hazard-light-on');
    backLight.classList.remove('hazard-light-on');
    clearInterval(hazardLightInterval);
  }
  hazardLightsOn = !hazardLightsOn;
}

// Function to stop the car
function stopCar() {
  if (carMoving) {
    carElement.style.animationPlayState = 'paused';
  } else {
    carElement.style.animationPlayState = 'running';
  }
  toggleHazardLights(); // Turn on hazard lights when the car stops
  carMoving = !carMoving;
}

// Add a click event listener to the stop button
stopButton.addEventListener('click', stopCar);

const camera = document.getElementById('camera');
const modelOutputDiv = document.getElementById('modelOutput');

// Access the camera feed
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        camera.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });

// Load the pre-trained model
async function loadModelAndPredict() {
    try {
        const model = await tf.loadGraphModel('model.json'); // Load your model here

        // Periodically check for drowsiness
        setInterval(async () => {
            // Capture a frame from the video feed
            const video = document.getElementById('camera');
            const frame = tf.browser.fromPixels(video);

            // Preprocess the frame if necessary (resize, normalize, etc.)
            // For example, you can resize the frame to match the input size expected by the model
            const resizedFrame = tf.image.resizeBilinear(frame, [224, 224]); // Adjust dimensions as per your model's requirements

            // Make predictions
            const predictions = model.predict(resizedFrame);

            // Get the predicted class probabilities
            const probabilities = predictions.dataSync();
            console.log('Predictions:', probabilities);

            // Display the predictions
            modelOutputDiv.innerHTML = `Class 0 Probability: ${probabilities[0]}<br>Class 1 Probability: ${probabilities[1]}`;
            
            // Dispose of the tensors to free up memory
            resizedFrame.dispose();
            predictions.dispose();
        }, 1000); // Adjust the interval as needed

    } catch (error) {
        console.error('Error loading the model:', error);
    }
}

// Call the function when the page is loaded
window.addEventListener('load', loadModelAndPredict);
