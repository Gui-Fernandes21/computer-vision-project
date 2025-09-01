const resetFaceMode = () =>
	Object.keys(faceMode).forEach((key) => (faceMode[key] = false));

const getBoundingBoxCoord = () => {
	if (!detectedFaces || detectedFaces.length === 0) return null;

	let { width, height, xMin, yMin } = detectedFaces[0].box;

	// Ensure coordinates are within image bounds
	xMin = Math.max(0, Math.floor(xMin));
	yMin = Math.max(0, Math.floor(yMin));
	width = Math.max(0, Math.floor(width));
	height = Math.max(0, Math.floor(height));

	return { x: xMin, y: yMin, width, height };
};



