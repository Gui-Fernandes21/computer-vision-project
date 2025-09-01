class HandPoseExtension {
	/**
	 * @param {Object} [options]
	 * @param {number} [options.pinchOn=9]  Distance which drawing starts
	 * @param {number} [options.pinchOff=20] Distance which drawing stops
	 * @param {number} [options.minConfidence=0.3] Minimum model confidence to trust it is a hand
	 * @param {number} [options.lerpAmt=0.35] Smoothing factor (0..1) for fingertip position
	 */
	constructor(options = {}) {
		this.config = Object.assign(
			{
				pinchOn: 9,
				pinchOff: 20,
				minConfidence: 0.3,
				lerpAmt: 0.35,
			},
			options
		);
		this.enabled = true;
		this.isDrawing = false;
		this.brushSize = 3;
		this.prevX = this.prevY = null;
		this.currX = this.currY = null;
	}

	setBrushSize(v) {
		this.brushSize = v;
	}

	toggleEnabled(v) {
		if (!v) this._stopStroke();
		this.enabled = !this.enabled;
    return this.enabled;
	}
	
  clear(layer) {
		if (layer) layer.clear();
		this._stopStroke();
	}

	// Per-frame update with latest predictions
	update(predictions) {
		if (!this.enabled) {
			this._stopStroke();
			return;
		}
		if (!predictions || predictions.length === 0) {
			this._stopStroke();
			return;
		}
		const hand = predictions[0];
		if (!hand || hand.confidence < this.config.minConfidence) return;
		const indexX = hand.index_finger_tip.x;
		const indexY = hand.index_finger_tip.y;
		const thumbX = hand.thumb_tip.x;
		const thumbY = hand.thumb_tip.y;
		if ([indexX, indexY, thumbX, thumbY].some((v) => typeof v !== "number" || Number.isNaN(v)))
			return;
		const d = dist(indexX, indexY, thumbX, thumbY);
		if (!this.isDrawing && d <= this.config.pinchOn) this.isDrawing = true;
		else if (this.isDrawing && d >= this.config.pinchOff) {
			this._stopStroke();
			return;
		}
		this.currX =
			this.prevX == null ? indexX : lerp(this.prevX, indexX, this.config.lerpAmt);
		this.currY =
			this.prevY == null ? indexY : lerp(this.prevY, indexY, this.config.lerpAmt);
	}

	// Draw stroke segment on layer
	drawStroke(layer, brushSize) {
		if (!this.isDrawing || this.currX == null || !layer) return;
		layer.strokeWeight(brushSize);
		if (this.prevX != null)
			layer.line(this.prevX, this.prevY, this.currX, this.currY);
		this.prevX = this.currX;
		this.prevY = this.currY;
	}

	_stopStroke() {
		this.isDrawing = false;
		this.prevX = this.prevY = this.currX = this.currY = null;
	}
}