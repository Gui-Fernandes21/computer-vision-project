const convolution = (x, y, matrix, matrixSize, img) => {
	var totalRed = 0;
	var totalGreen = 0;
	var totalBlue = 0;

	const offset = floor(matrixSize / 2);

	for (var i = 0; i < matrixSize; i++) {
		for (var j = 0; j < matrixSize; j++) {
			var xLoc = x + i - offset;
			var yLoc = y + j - offset;

			var index = (img.width * yLoc + xLoc) * 4;

			index = constrain(index, 0, img.pixels.length - 1);

			totalRed += img.pixels[index] * matrix[i][j];
			totalGreen += img.pixels[index + 1] * matrix[i][j];
			totalBlue += img.pixels[index + 2] * matrix[i][j];
		}
	}

	return [totalRed, totalGreen, totalBlue];
};

function applyFaceBlur() {
	if (!detectedFaces || detectedFaces.length === 0) return;

	// 5x5 Matrix - Increase blur intensity
	var matrix = [
		[1 / 25, 1 / 25, 1 / 25, 1 / 25, 1 / 25],
		[1 / 25, 1 / 25, 1 / 25, 1 / 25, 1 / 25],
		[1 / 25, 1 / 25, 1 / 25, 1 / 25, 1 / 25],
		[1 / 25, 1 / 25, 1 / 25, 1 / 25, 1 / 25],
		[1 / 25, 1 / 25, 1 / 25, 1 / 25, 1 / 25],
	];

	const faceBoundingBox = getBoundingBoxCoord();

	// 2 convolution passes to intensify Blur effect
	for (var passes = 0; passes < 2; passes++) {
		for (var relativeY = 0; relativeY < faceBoundingBox.height; relativeY++) {
			for (var relativeX = 0; relativeX < faceBoundingBox.width; relativeX++) {
				const absoluteY = faceBoundingBox.y + relativeY;
				const absoluteX = faceBoundingBox.x + relativeX;
				const pixelIndex = (absoluteX + absoluteY * IMAGE_WIDTH) * 4;

				var c = convolution(
					absoluteX,
					absoluteY,
					matrix,
					matrix.length,
					faceDetectionCam
				);

				faceDetectionCam.pixels[pixelIndex + 0] = c[0];
				faceDetectionCam.pixels[pixelIndex + 1] = c[1];
				faceDetectionCam.pixels[pixelIndex + 2] = c[2];
			}
		}
	}
}
