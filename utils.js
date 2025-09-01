function copyWebcamImage(video) {
	video = createImage(IMAGE_WIDTH, IMAGE_HEIGHT);
	video.copy(
		webcam,
		0,
		0,
		webcam.width,
		webcam.height,
		0,
		0,
		webcam.width,
		webcam.height
	);

	return video;
}

function setupDisplayImage(video) {
	if (!webcam) return;
	video = copyWebcamImage(video);
	video.loadPixels();
	return video;
}

function drawImageInGrid(cam, row, column) {
	if (!row || !column) return;
	if (typeof row !== "number" || typeof column !== "number") return;
	if (row <= 0 || column <= 0) return;

	const { xPos, yPos } = calculateImageCoordinates(row, column);

	image(cam, xPos, yPos);
}

function calculateImageCoordinates(row, column) {
	return {
		xPos: GAP_IN_PIXELS * column + IMAGE_WIDTH * (column - 1),
		yPos: GAP_IN_PIXELS * row + IMAGE_HEIGHT * (row - 1),
	};
}

