/*
==========================
Commentary Section
==========================

Thresholding in RGB Channels
----------------------------
Thresholding each RGB channel separately produced very different results. 
The red channel emphasized objects with strong red tones, the green channel highlighted green surfaces, 
and the blue channel isolated blue regions. This showed how thresholding in raw RGB is super color dependent and often noisy,
since objects with mixed lighting can appear noisy across different channels.

Thresholding in Converted Colour Spaces
---------------------------------------
Converting the webcam feed to HSV and YCbCr provided clearer segmentation. 
In HSV, thresholding the Value (V) channel isolated brightness information regardless of hue, 
producing more consistent outputs. 
In YCbCr, thresholding the Y (luma) channel produced smooth results because Y is 
calculated as a weighted brightness (0.299R + 0.587G + 0.114B), closer to human visual perception. 
Compared to RGB, these converted thresholds were less noisy and more robust under varying light conditions.

Challenges and Solutions
------------------------
Key implementation challenges were managing pixel indexing and ensuring values stayed in range (capping brightness at 255). 
Threshold sliders required careful mapping to 0–255 for user control.

Conclusion
----------
Overall, converted colour spaces produced cleaner threshold results compared to RGB. The HSV-V and YCbCr-Y channels
were especially effective for segmentation. These observations underline why colour space conversion is an important step in image processing pipelines.


Extension: Hand Gesture Drawing
-------------------------------

For my extension, I implemented a real-time hand-gesture drawing system using
ml5’s handPose model. The webcam feed is processed by the handPose model to obtain
landmarks of the hand, focusing on the index fingertip and thumb tip. 

When the distance between these landmarks falls below a “pinchOn” threshold, the
program enters a drawing mode. When the distance is larger then the “pinchOff”
threshold, the drawing stops. This allows for a smoother experience. 

Drawing is performed on a persistent p5 graphics layer, so previous lines persist on the screen. 
The user interface allows for control over the brush size, stroke color,
enabling/disabling drawing, and clearing the canvas. These features make the
extension both functional and engaging for users.

This extension goes beyond the assignment tasks by integrating machine
learning for interactive input. Instead of thresholding or face filters,
the webcam becomes a hands-free drawing tool. The technical challenges
included managing asynchronous handpose predictions, mapping pinch gestures
to binary states, and ensuring smooth, low-latency rendering. The result is
a unique creative tool that demonstrates how ml5 models can be combined
with pixel manipulation and UI controls to creatively create webcam-based
interactions.

*/

var webcam;

const IMAGE_WIDTH = 160;
const IMAGE_HEIGHT = 120;
const GAP_IN_PIXELS = 5;

function preload() {
	preloadMesh();
	preloadHandDetection();
}

function setup() {
	createCanvas(950, 760);
	pixelDensity(1);

	setupThresholdSliders();
	setupConvertedSliders();

	setupExtension();

	webcam = createCapture(VIDEO);
	webcam.size(IMAGE_WIDTH, IMAGE_HEIGHT);
	webcam.hide();
}

function draw() {
	background(255);
	drawImageInGrid(webcam, 1, 1);

	drawGrayscale();
	drawColorChannels();
	drawThresholdChannels();
	drawColourSpaces();

	drawFaceDetection();

	// EXTENSION
	drawExtension();

	webcam.loadPixels();

	drawControlInstructions();

	fill(255);
	strokeWeight(4);
	stroke(0);
}
