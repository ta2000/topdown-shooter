"use strict";

class Person {
	constructor(sprite, x, y, chunkX, chunkY) {
		this.sprite = sprite;
		this.x = x;
		this.y = y;
        this.chunk = {x:0,y:0};
		this.keys = {};
		this.angle = 0;
		this.targetAngle = 0;
		this.speed = 500;
		this.turnDelay = 8;
		this.playerControlled = false;
	}

	update(modifier) {
		var xVel = 0;
		var yVel = 0;

		if (65 in this.keys) {
			xVel -= 1;
		}
		if (68 in this.keys) {
			xVel += 1;
		}
		if (87 in this.keys) {
			yVel -= 1;
		}
		if (83 in this.keys) {
			yVel += 1;
		}

		var length = Math.sqrt((xVel*xVel) + (yVel*yVel));
		if (length > 0) {
			xVel = xVel/length;
			yVel = yVel/length;
		}

		this.x += xVel * this.speed * modifier;
		this.y += yVel * this.speed * modifier;

		var angleDelta = this.targetAngle - this.angle;
		if (angleDelta >= 0) {
			angleDelta %= (Math.PI*2);
		} else {
			angleDelta = ((Math.PI*2) - (-1 * angleDelta) % (Math.PI*2))
		}

		if (angleDelta <= Math.PI) {
			this.angle += angleDelta/this.turnDelay;
		} else {
			this.angle -= (Math.PI*2 - angleDelta)/this.turnDelay;
		}
	}
}
