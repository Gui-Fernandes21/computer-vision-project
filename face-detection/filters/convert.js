function applyFaceColorConverted() {
	if (!detectedFaces || detectedFaces.length === 0) return;

	const faceBoundingBox = getBoundingBoxCoord();

	for (var relativeY = 0; relativeY < faceBoundingBox.height; relativeY++) {
		for (var relativeX = 0; relativeX < faceBoundingBox.width; relativeX++) {
			const absoluteY = faceBoundingBox.y + relativeY;
			const absoluteX = faceBoundingBox.x + relativeX;
			const pixelIndex = (absoluteX + absoluteY * IMAGE_WIDTH) * 4;

			// Get original RGB values
			const red = faceDetectionCam.pixels[pixelIndex + 0];
			const green = faceDetectionCam.pixels[pixelIndex + 1];
			const blue = faceDetectionCam.pixels[pixelIndex + 2];

			// YCbCr conversion
			const Y = 0.299 * red + 0.587 * green + 0.114 * blue;
			const Cb = 128 + (-0.169 * red - 0.331 * green + 0.5 * blue);
			const Cr = 128 + (0.5 * red - 0.419 * green - 0.081 * blue);

			faceDetectionCam.pixels[pixelIndex + 0] = Math.max(0, Math.min(255, Y));
			faceDetectionCam.pixels[pixelIndex + 1] = Math.max(0, Math.min(255, Cb));
			faceDetectionCam.pixels[pixelIndex + 2] = Math.max(0, Math.min(255, Cr));
		}
	}
}
