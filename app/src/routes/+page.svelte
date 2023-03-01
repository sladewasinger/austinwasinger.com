<script lang="ts">
	import * as PIXI from 'pixi.js';
	import * as Matter from 'matter-js';
	import { onMount } from 'svelte';
	import { Particle, Vector } from './Particle';

	let app: PIXI.Application;
	console.log('here');
	onMount(() => {
		console.log('setup');
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		// Create a new Pixi.js application
		app = new PIXI.Application({
			width: 800,
			height: 600,
			view: canvas,
			backgroundAlpha: 0
		});

		// Create a new Pixi.js graphics object
		const graphics = new PIXI.Graphics();
		// Add the graphics object to the stage
		app.stage.addChild(graphics);

		// on mouse move create particles
		const particles: Particle[] = [];
		const mousePos: Vector = new Vector(0, 0);
		const lastMousePos = new Vector(0, 0);
		function mouseMove(event: MouseEvent) {
			// get mouse pos on canvas
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			lastMousePos.x = mousePos.x;
			lastMousePos.y = mousePos.y;

			mousePos.x = x;
			mousePos.y = y;
		}
		window.addEventListener('mousemove', mouseMove);

		function createParticlesAlongMouseLine() {
			const distance = Vector.distance(mousePos, lastMousePos);
			const numParticles = Math.floor(distance / 10);
			for (let i = 0; i < numParticles; i++) {
				const t = i / numParticles;
				const x = lastMousePos.x + (mousePos.x - lastMousePos.x) * t;
				const y = lastMousePos.y + (mousePos.y - lastMousePos.y) * t;
				createParticle(x, y);
			}
		}

		function createParticle(x: number, y: number) {
			// create a particle
			const randomNum = (min: number, max: number) => Math.random() * (max - min) + min;
			const particle = new Particle(x, y, randomNum(1, 5), 0x00ffb8);
			particle.applyForce(new Vector(randomNum(-2, 2), randomNum(-2, 2)));
			//particle.airFriction = 0.95 + 0.05 * (5 / particle.radius) * 0.25;
			particle.airFriction = randomNum(0.96, 0.98);
			particles.push(particle);

			// fade particle out after some time
			setTimeout(() => {
				const invterval = setInterval(() => {
					particle.alpha -= 0.1;
					if (particle.alpha <= 0) {
						clearInterval(invterval);
						particles.splice(particles.indexOf(particle), 1);
					}
				}, 50);
			}, 500);
		}

		let lastTime = Date.now();
		function loop() {
			const now = Date.now();
			const deltaTime = now - lastTime;
			lastTime = now;

			if (deltaTime > 1000 / (60 * 4)) {
				createParticle(mousePos.x, mousePos.y);
			}

			if (Vector.distance(mousePos, lastMousePos) > 10) {
				createParticlesAlongMouseLine();
			}

			graphics.clear();
			for (const particle of particles) {
				particle.update();
				particle.draw(graphics);
			}
		}

		setInterval(loop, 1000 / 60);

		// resize function to fill the browser window
		function resize() {
			// lookup the size the canvas is being displayed
			const width = window.innerWidth;
			const height = window.innerHeight;

			// check if the canvas is not the same size
			if (app.view.width !== width || app.view.height !== height) {
				// make the canvas the same size
				app.renderer.resize(width, height);
			}
		}
		window.addEventListener('resize', resize);
		resize();
	});
</script>

<canvas id="canvas" />
<h1>AUSTIN <br />WASINGER</h1>

<style>
	h1 {
		color: #00ffb8;
		font-size: 200px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}

	canvas {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		pointer-events: none;
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
	}
</style>
