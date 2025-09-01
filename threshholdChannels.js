var redThresCam;
var greenThresCam;
var blueThresCam;

var redCamSlider;
var greenCamSlider;
var blueCamSlider;

function setupThresholdSliders() {
	redCamSlider = createSlider(0, 255, 125);
	greenCamSlider = createSlider(0, 255, 125);
	blueCamSlider = createSlider(0, 255, 125);

	redCamSlider.position(
		GAP_IN_PIXELS * 1 + IMAGE_WIDTH * (1 - 1) + 15,
		GAP_IN_PIXELS * 3 + IMAGE_HEIGHT * 3 - 25
	);
	greenCamSlider.position(
		GAP_IN_PIXELS * 2 + IMAGE_WIDTH * (2 - 1) + 15,
		GAP_IN_PIXELS * 3 + IMAGE_HEIGHT * 3 - 25
	);
	blueCamSlider.position(
		GAP_IN_PIXELS * 3 + IMAGE_WIDTH * (3 - 1) + 15,
		GAP_IN_PIXELS * 3 + IMAGE_HEIGHT * 3 - 25
	);
}

function drawThresholdChannels() {
	redThresCam = setupDisplayImage(redThresCam);
	greenThresCam = setupDisplayImage(redThresCam);
	blueThresCam = setupDisplayImage(blueThresCam);

	var redThreshold = redCamSlider.value();
	var greenThreshold = greenCamSlider.value();
	var blueThreshold = blueCamSlider.value();

	for (var x = 0; x < IMAGE_WIDTH; x++) {
		for (var y = 0; y < IMAGE_HEIGHT; y++) {
			const index = (x + y * IMAGE_WIDTH) * 4;

			if (redThresCam.pixels[index + 0] >= redThreshold) {
				redThresCam.pixels[index + 0] = 255;
				redThresCam.pixels[index + 1] = 255;
				redThresCam.pixels[index + 2] = 255;
			} else {
				redThresCam.pixels[index + 0] = 0;
				redThresCam.pixels[index + 1] = 0;
				redThresCam.pixels[index + 2] = 0;
			}

			if (greenThresCam.pixels[index + 1] >= greenThreshold) {
				greenThresCam.pixels[index + 0] = 255;
				greenThresCam.pixels[index + 1] = 255;
				greenThresCam.pixels[index + 2] = 255;
			} else {
				greenThresCam.pixels[index + 0] = 0;
				greenThresCam.pixels[index + 1] = 0;
				greenThresCam.pixels[index + 2] = 0;
			}

			if (blueThresCam.pixels[index + 2] >= blueThreshold) {
				blueThresCam.pixels[index + 0] = 255;
				blueThresCam.pixels[index + 1] = 255;
				blueThresCam.pixels[index + 2] = 255;
			} else {
				blueThresCam.pixels[index + 0] = 0;
				blueThresCam.pixels[index + 1] = 0;
				blueThresCam.pixels[index + 2] = 0;
			}
		}
	}

	redThresCam.updatePixels();
	greenThresCam.updatePixels();
	blueThresCam.updatePixels();

	drawImageInGrid(redThresCam, 3, 1);
	drawImageInGrid(greenThresCam, 3, 2);
	drawImageInGrid(blueThresCam, 3, 3);
}
