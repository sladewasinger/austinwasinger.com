<script lang="ts">
	import * as PIXI from 'pixi.js';
	import * as Matter from 'matter-js';
	import { onMount } from 'svelte';

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
			backgroundColor: 0x000000
		});

		// Add the canvas element to the DOM
		console.log('aded');

		// Create a new Pixi.js graphics object
		const graphics = new PIXI.Graphics();
		// Set the line style for the chain
		graphics.lineStyle(5, 0xff0000);

		// Move the graphics object to the starting position of the chain
		graphics.moveTo(100, 100);

		// Draw the chain links
		graphics.lineTo(150, 150);
		graphics.lineTo(200, 100);
		graphics.lineTo(250, 150);
		graphics.lineTo(300, 100);
		graphics.lineTo(350, 150);

		// Add the graphics object to the stage
		app.stage.addChild(graphics);

		// resize the canvas to fill browser window dynamically

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
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
	}
</style>
