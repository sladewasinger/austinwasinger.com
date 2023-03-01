import type * as PIXI from 'pixi.js';

export class Particle {
    public alpha: number = 1;

    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: number,
        public velocity: Vector
    ) { }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(graphics: PIXI.Graphics) {
        graphics.beginFill(this.color, this.alpha);
        graphics.drawCircle(this.x, this.y, this.radius);
        graphics.endFill();
    }
}

export class Vector {
    constructor(public x: number, public y: number) { }
    
    static distance(v1: Vector, v2: Vector) {
        return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
    }
}