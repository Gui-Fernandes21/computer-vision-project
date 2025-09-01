var grayscaleCam;

function drawGrayscale() {
	grayscaleCam = setupDisplayImage(grayscaleCam);

	if (!grayscaleCam) return;

	for (var x = 0; x < IMAGE_WIDTH; x++) {
		for (var y = 0; y < IMAGE_HEIGHT; y++) {
			const index = (x + y * IMAGE_WIDTH) * 4;

			grayscale(grayscaleCam, index);
		}
	}

	grayscaleCam.updatePixels();

	drawImageInGrid(grayscaleCam, 1, 2);
}

function grayscale(video, pixelIndex) {
	const red = video.pixels[pixelIndex + 0];
	const green = video.pixels[pixelIndex + 1];
	const blue = video.pixels[pixelIndex + 2];

	// Use luminance formula for accurate grayscale conversion
	const grayIntensity = 0.299 * red + 0.587 * green + 0.114 * blue;

	// Increase brightness by 20% and clamp to valid range
	const brightenedGray = Math.min(255, grayIntensity * 1.2);

	video.pixels[pixelIndex + 0] = brightenedGray;
	video.pixels[pixelIndex + 1] = brightenedGray;
	video.pixels[pixelIndex + 2] = brightenedGray;
}
