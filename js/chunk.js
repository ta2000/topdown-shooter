"use strict";

class Chunk {
    constructor(x, y, size) {
        this.people = {};
        this.props = [];
        this.x = x;
        this.y = y;
        this.size = size;
        this.unloaded = []; // People who have gone into unloaded chunks
        this.color = "#1c722c";
        this.generate();
    }

    generate() {
        var seed = ((this.x + this.y)*(this.x + this.y + 1)/2) + this.y;
        var rand = this.random(seed);

        var x = rand*this.size;
        var y = this.random(rand)*this.size;
        this.props.push(new Prop(game.sprites["spr_tree"], x, y));
    }

    random(seed) {
        var rand = Math.sin(seed+1) * 10000;
        return rand - Math.floor(rand);
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
    }

    drawBackground(ctx, drawX, drawY) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            drawX*this.size-1,
            drawY*this.size-1,
            this.size+2,
            this.size+2
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "48px Arial";
        ctx.fillText(
            this.x + ", " + this.y,
            drawX*this.size + this.size/2,
            drawY*this.size + this.size/2
        );
    }

    drawForeground(ctx, drawX, drawY) {
        for (var i=0; i<this.props.length; i++) {
            this.props[i].sprite.draw(
                ctx,
                0,
                drawX*this.size + this.props[i].x,
                drawY*this.size + this.props[i].y
            );
        }

        for (var i in this.people) {
            this.people[i].sprite.draw(
                ctx,
                this.people[i].angle,
                drawX*this.size + this.people[i].x,
                drawY*this.size + this.people[i].y
            );
        }
    }
}
