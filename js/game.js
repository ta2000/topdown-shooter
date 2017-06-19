"use strict";

class Game {
	constructor() {
		this.canvas;
		this.ctx;
        this.camera = {x:0, y:0};
        this.viewDist = 1;
        this.loadDist = 1;
        this.chunks = [];
        this.chunkSize = 1000;
        this.sprites = {};
		this.then;
		this.keysPressed = {};
		this.mouse = {x:0,y:0,xTarget:0,yTarget:0,click:false,sprite:null};
		this.player = null;
	}

	start() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		window.onkeydown = this.keyDown.bind(this);
		window.onkeyup = this.keyUp.bind(this);
		this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));

		this.sprites["spr_tree"] = new Sprite("sprites/tree.png", 128, 128);

        for (var x=0; x<3; x++) {
            for (var y=0; y<3; y++) {
                this.chunks.push(new Chunk(y,x,this.chunkSize));
            }
        }

		this.sprites["spr_crosshair"] = new Sprite("sprites/crosshair.png", 32, 32);
        this.mouse.sprite = this.sprites["spr_crosshair"];

		this.sprites["spr_soldier"] = new Sprite("sprites/soldier.gif", 128, 128);
		this.player = new Person(this.sprites["spr_soldier"], 100, 100)
		this.player.playerControlled = true;
		this.chunks[4].spawnPerson("supertom", this.player);

		this.then = Date.now();
		this.main();
	}

	main() {
		var now = Date.now();
		var delta = now - this.then;
		var modifier = delta/1000;

		this.processInput();
		this.update(modifier);
		this.draw();

		this.then = now;
		window.requestAnimationFrame(this.main.bind(this));
	}

	processInput() {
		if (this.player != null) {
			this.player.keys = this.keysPressed;
		}
		this.player.targetAngle = Math.atan2(
            this.mouse.y - (this.player.y + this.chunkSize + this.player.sprite.height/2),
            this.mouse.x - (this.player.x + this.chunkSize + this.player.sprite.width/2)
        );
	}

	update(modifier) {
        this.mouse.x += (this.mouse.xTarget - this.mouse.x)/2;
        this.mouse.y += (this.mouse.yTarget - this.mouse.y)/2;

        var playerStart = {x:this.player.x, y:this.player.y};
        var playerStartChunk = {x:this.player.chunk.x, y:this.player.chunk.y};

        for (var i=0; i<this.chunks.length; i++) {
            this.chunks[i].update(modifier, this.chunks);
        }

        // If I was smart I could do this in a better way
        // (that goes for the whole project)
        if (this.player.chunk.x > playerStartChunk.x) {
            this.chunks[0] = this.chunks[1];
            this.chunks[3] = this.chunks[4];
            this.chunks[6] = this.chunks[7];
            this.chunks[1] = this.chunks[2];
            this.chunks[4] = this.chunks[5];
            this.chunks[7] = this.chunks[8];
            this.chunks[2] = new Chunk(this.player.chunk.x+1, this.player.chunk.y-1, this.chunkSize);
            this.chunks[5] = new Chunk(this.player.chunk.x+1, this.player.chunk.y, this.chunkSize);
            this.chunks[8] = new Chunk(this.player.chunk.x+1, this.player.chunk.y+1, this.chunkSize);
        } else if (this.player.chunk.x < playerStartChunk.x) {
            this.chunks[2] = this.chunks[1];
            this.chunks[5] = this.chunks[4];
            this.chunks[8] = this.chunks[7];
            this.chunks[1] = this.chunks[0];
            this.chunks[4] = this.chunks[3];
            this.chunks[7] = this.chunks[6];
            this.chunks[0] = new Chunk(this.player.chunk.x-1, this.player.chunk.y-1, this.chunkSize);
            this.chunks[3] = new Chunk(this.player.chunk.x-1, this.player.chunk.y, this.chunkSize);
            this.chunks[6] = new Chunk(this.player.chunk.x-1, this.player.chunk.y+1, this.chunkSize);
        }
        if (this.player.chunk.y > playerStartChunk.y) {
            this.chunks[0] = this.chunks[3];
            this.chunks[1] = this.chunks[4];
            this.chunks[2] = this.chunks[5];
            this.chunks[3] = this.chunks[6];
            this.chunks[4] = this.chunks[7];
            this.chunks[5] = this.chunks[8];
            this.chunks[6] = new Chunk(this.player.chunk.x-1, this.player.chunk.y + 1, this.chunkSize);
            this.chunks[7] = new Chunk(this.player.chunk.x, this.player.chunk.y + 1, this.chunkSize);
            this.chunks[8] = new Chunk(this.player.chunk.x+1, this.player.chunk.y + 1, this.chunkSize);
        } else if (this.player.chunk.y < playerStartChunk.y) {
            this.chunks[6] = this.chunks[3];
            this.chunks[7] = this.chunks[4];
            this.chunks[8] = this.chunks[5];
            this.chunks[3] = this.chunks[0];
            this.chunks[4] = this.chunks[1];
            this.chunks[5] = this.chunks[2];
            this.chunks[0] = new Chunk(this.player.chunk.x-1, this.player.chunk.y - 1, this.chunkSize);
            this.chunks[1] = new Chunk(this.player.chunk.x, this.player.chunk.y - 1, this.chunkSize);
            this.chunks[2] = new Chunk(this.player.chunk.x+1, this.player.chunk.y - 1, this.chunkSize);
        }

        this.mouse.x -= playerStart.x - this.player.x;
        this.mouse.y -= playerStart.y - this.player.y;
        this.mouse.xTarget -= playerStart.x - this.player.x;
        this.mouse.yTarget -= playerStart.y - this.player.y;
	}

	draw() {
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera.x = -(this.player.x + this.chunkSize) - this.player.sprite.width/2 + this.canvas.width/2;
        this.camera.y = -(this.player.y + this.chunkSize) - this.player.sprite.height/2 + this.canvas.height/2;
        this.ctx.translate(this.camera.x, this.camera.y);

        for (var i=0; i<this.chunks.length; i++) {
            this.chunks[i].drawBackground(this.ctx, i%3, Math.floor(i/3));
        }
        for (var i=0; i<this.chunks.length; i++) {
            this.chunks[i].drawForeground(this.ctx, i%3, Math.floor(i/3));
        }

		this.mouse.sprite.draw(this.ctx, 0, this.mouse.x, this.mouse.y);
	}

	keyDown(e) {
		this.keysPressed[e.keyCode] = true;
	}

	keyUp(e) {
		delete this.keysPressed[e.keyCode];
	}

	mouseMove(e) {
		this.mouse.xTarget = e.clientX - this.camera.x;
		this.mouse.yTarget = e.clientY - this.camera.y;
	}
}
