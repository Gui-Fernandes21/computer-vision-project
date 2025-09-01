var redCam;
var greenCam;
var blueCam;


function drawColorChannels() {
	redCam = setupDisplayImage(redCam);
	greenCam = setupDisplayImage(greenCam);
	blueCam = setupDisplayImage(blueCam);

	if (!redCam) return;

	drawColourChannel();

	drawImageInGrid(redCam, 2, 1);
	drawImageInGrid(greenCam, 2, 2);
	drawImageInGrid(blueCam, 2, 3);
}

function drawColourChannel() {
	for (var x = 0; x < IMAGE_WIDTH; x++) {
		for (var y = 0; y < IMAGE_HEIGHT; y++) {
			const index = (x + y * IMAGE_WIDTH) * 4;

			const redSource = webcam.pixels[index + 0];
			const greenSource = webcam.pixels[index + 1];
			const blueSource = webcam.pixels[index + 2];

			redCam.pixels[index + 0] = redSource;
			redCam.pixels[index + 1] = 0;
			redCam.pixels[index + 2] = 0;

			greenCam.pixels[index + 0] = 0;
			greenCam.pixels[index + 1] = greenSource;
			greenCam.pixels[index + 2] = 0;

			blueCam.pixels[index + 0] = 0;
			blueCam.pixels[index + 1] = 0;
			blueCam.pixels[index + 2] = blueSource;
		}
	}

	redCam.updatePixels();
	greenCam.updatePixels();
	blueCam.updatePixels();
}
