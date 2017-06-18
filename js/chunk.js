"use strict";

class Chunk {
    constructor(x, y, size) {
        this.people = {};
        this.x = x;
        this.y = y;
        this.size = size;
        this.unloaded = []; // People who have gone into unloaded chunks
        this.color = "#1c722c";
    }

    generate(seed) {

    }

    spawnPerson(id, person) {
        this.people[id] = person;
        this.people[id].chunk.x = this.x;
        this.people[id].chunk.y = this.y;
    }

    update(modifier, chunks) {
        for (var i in this.people) {
            this.people[i].update(modifier);
            if (this.outsideChunk(this.people[i].x, this.people[i].y)) {
                console.log(i + " has left chunk " + this.x + ", " + this.y);
                /*if (this.people[i].y > this.size * (this.y+1)) {
                    this.people[i].chunk.y++;
                } else if (this.people[i].y < this.y*this.size) {
                    this.people[i].chunk.y--;
                }
                if (this.people[i].x > this.size * (this.x+1)) {
                    this.people[i].chunk.x++;
                } else if (this.people[i].x < this.x*this.size) {
                    this.people[i].chunk.x--;
                }*/

                if (this.people[i].x > this.size) {
                    chunks[5].people[i] = this.people[i];
                    this.people[i].chunk.x++;
                } else if (this.people[i].x < 0) {
                    chunks[3].people[i] = this.people[i];
                    this.people[i].chunk.x--;
                }
                if (this.people[i].y > this.size) {
                    chunks[7].people[i] = this.people[i];
                    this.people[i].chunk.y++;
                } else if (this.people[i].y < 0) {
                    chunks[1].people[i] = this.people[i];
                    this.people[i].chunk.y--;
                }

                this.people[i].x %= this.size;
                this.people[i].y %= this.size;
                if (this.people[i].x < 0)
                    this.people[i].x += this.size;
                if (this.people[i].y < 0)
                    this.people[i].y += this.size;

                /*console.log(this.people[i].chunk.x, this.people[i].chunk.y);
                console.log(this.people[i].chunk.x + 3*this.people[i].chunk.y);
                chunks[this.people[i].chunk.x + 3*this.people[i].chunk.y].people[i] = this.people[i];*/
                delete this.people[i];
            }
        }
    }

    outsideChunk(x, y) {
        return (
            x > this.size ||
            x < 0 ||
            y > this.size ||
            y < 0
        );
        /*return (
            x > this.size * (this.x+1) ||
            x < this.x * this.size ||
            y > this.size * (this.y+1) ||
            y < this.y * this.size
        );*/
    }

    drawBackground(ctx, drawX, drawY) {
        /*ctx.fillStyle = "#000000";
        ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x*this.size+4, this.y*this.size+4, this.size-8, this.size-8);*/
        ctx.fillStyle = "#000000";
        ctx.fillRect(drawX*this.size, drawY*this.size, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fillRect(drawX*this.size+4, drawY*this.size+4, this.size-8, this.size-8);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "48px Arial";
        ctx.fillText(
            this.x + ", " + this.y,
            drawX*this.size + this.size/2,
            drawY*this.size + this.size/2
        );
    }

    drawForeground(ctx) {
        for (var i in this.people) {
            this.people[i].sprite.draw(
                ctx,
                this.people[i].angle,
                this.people[i].x + this.size,
                this.people[i].y + this.size
            );
        }
    }
}
