"use strict";

class Sprite {
	constructor(src, width, height) {
		this.img = new Image();
		this.img.src = src;
		this.loaded = false;
		this.img.onload = function() {
			this.loaded = true;
		}.bind(this);
		this.width = width;
		this.height = height;
	}

	draw(ctx, angle, x, y) {
		if (!this.loaded) {
			return;
		}

		ctx.save();
		ctx.translate(x + this.width/2, y + this.height/2);
		ctx.rotate(angle);
		ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
		ctx.restore();
	}
}
