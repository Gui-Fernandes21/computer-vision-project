/**
 *
 * @description
 *
 * 	1. Needs to divide the width and height of the bounding box into a 5x5 grid
 *  2. Store it into an array or a matrix
 * 	3. calculate the average pixel intensity within the each block
 * 	4. set the color of the entire block to the avrg pixel intensity
 *
 */

function applyFacePixelate() {
	if (!detectedFaces || detectedFaces.length === 0) return;

	const faceBox = getBoundingBoxCoord();
	if (!faceBox) return;

	const PIXEL_BLOCK_SIZE = 3; // side length of each mosaic block in pixels
	const pixelBuffer = faceDetectionCam.pixels;

	// Iterate block by block over the face region
	for (let blockTop = faceBox.y; blockTop < faceBox.y + faceBox.height; blockTop += PIXEL_BLOCK_SIZE) {
		const currentBlockHeight = Math.min(PIXEL_BLOCK_SIZE, faceBox.y + faceBox.height - blockTop);
		for (let blockLeft = faceBox.x; blockLeft < faceBox.x + faceBox.width; blockLeft += PIXEL_BLOCK_SIZE) {
			const currentBlockWidth = Math.min(PIXEL_BLOCK_SIZE, faceBox.x + faceBox.width - blockLeft);

			let luminanceSum = 0;
			// Aggregate luminance for this block (brightness multiplied by 1.2)
			for (let localY = 0; localY < currentBlockHeight; localY++) {
				const rowStartIndex = ((blockTop + localY) * IMAGE_WIDTH + blockLeft) * 4;
				for (let localX = 0; localX < currentBlockWidth; localX++) {
					const pixelIndex = rowStartIndex + localX * 4;
					const r = pixelBuffer[pixelIndex];
					const g = pixelBuffer[pixelIndex + 1];
					const b = pixelBuffer[pixelIndex + 2];

					luminanceSum += (0.299 * r + 0.587 * g + 0.114 * b) * 1.2;
				}
			}

			const averageLuminance = luminanceSum / (currentBlockWidth * currentBlockHeight);
			const blockGray = averageLuminance > 255 ? 255 : averageLuminance;

			// Fill block with computed grayscale value
			for (let localY = 0; localY < currentBlockHeight; localY++) {
				const rowStartIndex = ((blockTop + localY) * IMAGE_WIDTH + blockLeft) * 4;
				for (let localX = 0; localX < currentBlockWidth; localX++) {
					const pixelIndex = rowStartIndex + localX * 4;
					pixelBuffer[pixelIndex] = blockGray;
					pixelBuffer[pixelIndex + 1] = blockGray;
					pixelBuffer[pixelIndex + 2] = blockGray;
				}
			}
		}
	}
	faceDetectionCam.updatePixels();
}
