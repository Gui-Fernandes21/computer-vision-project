var YCbCrCam;
var hsvCam;

var thrFromHSV, thrFromYCbCr, vSlider, ySlider;

function setupConvertedSliders() {
	vSlider = createSlider(0, 255, 128, 1); // for HSV Value
	ySlider = createSlider(0, 255, 128, 1); // for YCbCr Y (luma value)

	const YCbCoord = calculateImageCoordinates(5, 2);
	const HSVCoord = calculateImageCoordinates(5, 3);

	vSlider.position(HSVCoord.xPos + 15, HSVCoord.yPos + IMAGE_HEIGHT);
	ySlider.position(YCbCoord.xPos + 15, YCbCoord.yPos + IMAGE_HEIGHT);
}

function drawColourSpaces() {
	YCbCrCam = setupDisplayImage(YCbCrCam);
	hsvCam = setupDisplayImage(hsvCam);

	thrFromHSV = setupDisplayImage(thrFromHSV);
	thrFromYCbCr = setupDisplayImage(thrFromYCbCr);
	const tV = vSlider.value(); // Threshold value for HSV
	const tY = ySlider.value(); // Threshold value for YCbCr

	for (var x = 0; x < IMAGE_WIDTH; x++) {
		for (var y = 0; y < IMAGE_HEIGHT; y++) {
			const index = (x + y * IMAGE_WIDTH) * 4;

			// Get original RGB values
			const red = webcam.pixels[index + 0];
			const green = webcam.pixels[index + 1];
			const blue = webcam.pixels[index + 2];

			// YCbCr conversion
			const Y = 0.299 * red + 0.587 * green + 0.114 * blue;
			const Cb = 128 + (-0.169 * red - 0.331 * green + 0.5 * blue);
			const Cr = 128 + (0.5 * red - 0.419 * green - 0.081 * blue);

			YCbCrCam.pixels[index + 0] = Math.max(0, Math.min(255, Y));
			YCbCrCam.pixels[index + 1] = Math.max(0, Math.min(255, Cb));
			YCbCrCam.pixels[index + 2] = Math.max(0, Math.min(255, Cr));

			// HSV conversion
			const redNormalized = red / 255;
			const greenNormalized = green / 255;
			const blueNormalized = blue / 255;

			const max = Math.max(redNormalized, greenNormalized, blueNormalized);
			const min = Math.min(redNormalized, greenNormalized, blueNormalized);
			const delta = max - min;

			// Hue calculation
			var hueDeg = 0;
			if (delta !== 0) {
				if (max === redNormalized)
					hueDeg =
						60 *
						((greenNormalized - blueNormalized) / delta +
							(greenNormalized < blueNormalized ? 6 : 0));
				else if (max === greenNormalized)
					hueDeg = 60 * ((blueNormalized - redNormalized) / delta + 2);
				else hueDeg = 60 * ((redNormalized - greenNormalized) / delta + 4);
			}

			// Saturation calculation
			const saturation = max === 0 ? 0 : delta / max;

			// Value calculation
			const value = max;

			// Function to clamp the values to fit the 255 range
			const clamp255 = (v) => Math.max(0, Math.min(255, v));

			// Convert HSV to displayable RGB-like format
			hsvCam.pixels[index + 0] = clamp255((hueDeg / 360) * 255); // Hue as red channel
			hsvCam.pixels[index + 1] = clamp255(saturation * 255); // Saturation as green channel
			hsvCam.pixels[index + 2] = clamp255(value * 255); // Value as blue channel
			hsvCam.pixels[index + 3] = 255; // Alpha value

			// Thresholded HSV value
			const V255 = (value * 255) | 0;
			const outHSV = V255 > tV ? 255 : 0;
			thrFromHSV.pixels[index + 0] = outHSV;
			thrFromHSV.pixels[index + 1] = outHSV;
			thrFromHSV.pixels[index + 2] = outHSV;
			thrFromHSV.pixels[index + 3] = 255;

			// Threshold YCbCr: use Y channel
			const outY = Y > tY ? 255 : 0;
			thrFromYCbCr.pixels[index + 0] = outY;
			thrFromYCbCr.pixels[index + 1] = outY;
			thrFromYCbCr.pixels[index + 2] = outY;
			thrFromYCbCr.pixels[index + 3] = 255;
		}
	}

	YCbCrCam.updatePixels();
	hsvCam.updatePixels();
	thrFromYCbCr.updatePixels();
	thrFromHSV.updatePixels();

	drawImageInGrid(webcam, 4, 1);
	drawImageInGrid(YCbCrCam, 4, 2);
	drawImageInGrid(hsvCam, 4, 3);
	
	drawImageInGrid(thrFromYCbCr, 5, 2);
	drawImageInGrid(thrFromHSV, 5, 3);
}
