// Add activate functions for different face effects
const activateFaceGrayscale = () => (faceMode.grayscale = !faceMode.grayscale);
const activateFaceBlur = () => (faceMode.blurred = !faceMode.blurred);
const activateFaceColorConvert = () =>
	(faceMode.colorConverted = !faceMode.colorConverted);
const activateFacePixelate = () => (faceMode.pixelated = !faceMode.pixelated);

function keyPressed() {
	switch (key.toLowerCase()) {
		case "g":
			resetFaceMode();
			activateFaceGrayscale();
			break;
		case "b":
			resetFaceMode();
			activateFaceBlur();
			break;
		case "c":
			resetFaceMode();
			activateFaceColorConvert();
			break;
		case "p":
			resetFaceMode();
			activateFacePixelate();
			break;
	}
}

function drawControlInstructions() {
	const { xPos, yPos } = calculateImageCoordinates(5, 1);
	noFill();
	strokeWeight(1)
	text("press g to apply grayscale filter", xPos, yPos + IMAGE_HEIGHT + 15);
	text("press b to apply blur filter", xPos, yPos + IMAGE_HEIGHT + 30);
	text("press c to apply converted filter", xPos, yPos + IMAGE_HEIGHT + 45);
	text("press p to apply pixelated filter", xPos, yPos + IMAGE_HEIGHT + 60);
}
