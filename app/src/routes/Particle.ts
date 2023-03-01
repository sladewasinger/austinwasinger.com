import type * as PIXI from 'pixi.js';

export class Particle {
    public alpha: number = 1;
    public gravity: number = 0;
    public acceleration: Vector = new Vector(0, 0);
    public velocity: Vector = new Vector(0, 0);
    public rotationalVelocity: number = 0;
    public rotationalAcceleration: number = 0;
    public rotationalSpeed: number = 0;
    public airFriction: number = 0.99;

    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: number
    ) { }

    applyForce(force: Vector) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    update() {
        this.acceleration.y += this.gravity;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        this.velocity.x *= this.airFriction;
        this.velocity.y *= this.airFriction;
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