var faceDetectionCam;

// ML5 face mesh options and variables
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

let detectedFaces;

let faceMode = {
	grayscale: false,
	blurred: false,
	colorConverted: false,
	pixelated: false,
};

function preloadMesh() {
	faceMesh = ml5.faceMesh(options);
}

function drawFaceDetection() {
	faceDetectionCam = setupDisplayImage(faceDetectionCam);
	faceMesh.detect(faceDetectionCam, (res) => (detectedFaces = res));
	
	applyFilters();
	
	drawImageInGrid(faceDetectionCam, 5, 1);

	if (detectedFaces && detectedFaces.length > 0) {
		const { xPos, yPos } = calculateImageCoordinates(5, 1);
		push();
		translate(xPos, yPos);
		noFill();
		stroke(255);
		strokeWeight(0.5);
		rect(
			detectedFaces[0].box.xMin,
			detectedFaces[0].box.yMin,
			detectedFaces[0].box.width,
			detectedFaces[0].box.height
		);
		pop();
	}
}

function applyFilters() {
	if (faceMode.grayscale) {
		applyGrayscaleToFace();
	} else if (faceMode.blurred) {
		applyFaceBlur();
	} else if (faceMode.colorConverted) {
		applyFaceColorConverted();
	} else if (faceMode.pixelated) {
		applyFacePixelate();
	}
	faceDetectionCam.updatePixels();
}

