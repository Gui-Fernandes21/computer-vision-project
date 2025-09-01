function drawMirrored(img, x, y, width, height) {
	push();
	translate(x + width, y); // move to right edge
	scale(-1, 1); // flip horizontally
	image(img, 0, 0, width, height);
	pop();
}

function drawMirroredInGrid(img, col, row) {
	const { xPos, yPos } = calculateImageCoordinates(col, row);
	drawMirrored(img, xPos, yPos, IMAGE_WIDTH, IMAGE_HEIGHT);
}
