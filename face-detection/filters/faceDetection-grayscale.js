function applyGrayscaleToFace() {
	if (!detectedFaces || detectedFaces.length === 0) return;

	const faceBoundingBox = getBoundingBoxCoord();

	for (var relativeY = 0; relativeY < faceBoundingBox.height; relativeY++) {
		for (var relativeX = 0; relativeX < faceBoundingBox.width; relativeX++) {
			const absoluteY = faceBoundingBox.y + relativeY;
			const absoluteX = faceBoundingBox.x + relativeX;
			const pixelIndex = (absoluteX + absoluteY * IMAGE_WIDTH) * 4;

			grayscale(faceDetectionCam, pixelIndex);
		}
	}
}
