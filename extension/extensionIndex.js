let handpose,
	extensionCam,
	predictions = [];

let drawLayer;

let handExtension;

let brushSlider, clearBtn, colorPicker, toggleDrawBtn;
let uiContainer;

const IMAGE_ROW = 3;
const IMAGE_COLUMN = 5;

function preloadHandDetection() {
	handpose = ml5.handPose({ maxHands: 1 });
}

function positionUIContainer(ui) {
	const { xPos: gx, yPos: gy } = calculateImageCoordinates(
		IMAGE_ROW,
		IMAGE_COLUMN
	);
	ui.position(gx + 5, gy + IMAGE_HEIGHT + 10);
}

function setupControls() {
	uiContainer = createDiv();
	// apply styles with CSS
	uiContainer.id("hand-ext-ui");
	positionUIContainer(uiContainer);

	// Brush size label + slider
	const brushLabel = createSpan("Brush Size");
	brushLabel.parent(uiContainer);
	brushLabel.style("margin-right", "8px");
	brushSlider = createSlider(1, 30, 3, 1);
	brushSlider.parent(uiContainer);

	// Color picker
	const colorLabel = createSpan("Color");
	colorLabel.parent(uiContainer);
	colorPicker = createColorPicker("#ff0000");
	colorPicker.parent(uiContainer);

	// Toggle drawing enable (disables stroke capture, but keeps camera)
	toggleDrawBtn = createButton("Disable Drawing");
	toggleDrawBtn.parent(uiContainer);

	// Clear button
	clearBtn = createButton("Clear");
	clearBtn.parent(uiContainer);

	// Event handlers (event-driven, no polling in draw loop)
	brushSlider.input(() => {
		const v = brushSlider.value();
		handExtension.setBrushSize(v);
		drawLayer.strokeWeight(v);
	});

	colorPicker.input(() => {
		const c = colorPicker.color();
		drawLayer.stroke(c);
		drawLayer.fill(c);
	});

	toggleDrawBtn.mousePressed(() => {
		const enabled = handExtension.toggleEnabled();
		toggleDrawBtn.html(enabled ? "Disable Drawing" : "Enable Drawing");
	});

	clearBtn.mousePressed(() => handExtension.clear(drawLayer));
}

function setupExtension() {
	setupControls();
	setupDrawLayer();
	setupPose();
	handExtension = new HandPoseExtension({
		pinchOn: 9,
		pinchOff: 20,
		lerpAmt: 0.35,
		minConfidence: 0.3,
	});
}

function setupDrawLayer() {
	drawLayer = createGraphics(IMAGE_WIDTH, IMAGE_HEIGHT);
	drawLayer.pixelDensity(1);
	drawLayer.fill(255, 0, 0);
	drawLayer.stroke(255, 0, 0);
	drawLayer.strokeWeight(3);
	drawLayer.clear();
}

function setupPose() {
	extensionCam = createCapture(VIDEO);
	extensionCam.size(IMAGE_WIDTH, IMAGE_HEIGHT);
	extensionCam.hide();

	handpose.detectStart(extensionCam, (results) => (predictions = results));
}

function drawExtension() {
	// Draw mirroed camera
	drawMirroredInGrid(extensionCam, IMAGE_ROW, IMAGE_COLUMN);

	// Only draw and update if extension is enabled (PERFORMANCE)
	if (handExtension && handExtension.enabled) {
		handExtension.update(predictions);
		handExtension.drawStroke(drawLayer, brushSlider.value());
	}

	// Draw mirroed drawing layer on top of the camera
	drawMirroredInGrid(drawLayer, IMAGE_ROW, IMAGE_COLUMN);

	drawControlText();
}

function drawControlText() {
	const { xPos, yPos } = calculateImageCoordinates(IMAGE_ROW, IMAGE_COLUMN);
	push();
	noStroke();
	fill(0);
	textSize(11);
	text(
		"Pinch to draw (index ↔ thumb). Clear / Color / Size controls below.",
		xPos - 70,
		yPos - 6
	);
	pop();
}
