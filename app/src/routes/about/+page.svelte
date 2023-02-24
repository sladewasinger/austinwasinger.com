<script lang="ts">
	import * as Matter from 'matter-js';
	import { onMount } from 'svelte';

	onMount(() => {
		const body = document.body;
		// Create a Matter.js engine and renderer
		const engine = Matter.Engine.create();
		const render = Matter.Render.create({
			element: body,
			canvas: document.getElementById('canvas') as HTMLCanvasElement,
			engine: engine,
			options: {
				width: window.innerWidth,
				height: window.innerHeight,
				wireframes: false,
				background: 'transparent'
			}
		});

		// Create an array to hold the chain bodies and constraints
		const chain = <any>[];
		const chainConstraints = [];

		// Define the width, height, and spacing of the chain links
		const linkWidth = 10;
		const linkHeight = 25;
		const linkSpacing = 5;

		// Calculate the position of the first link
		const x = 200;
		const y = 100 - (linkHeight + linkSpacing) * 2;

		// Create the chain links
		for (let i = 0; i < 10; i++) {
			// Create a new rectangular body for the link
			const link = Matter.Bodies.rectangle(
				x,
				y + (linkHeight + linkSpacing) * i,
				linkWidth,
				linkHeight
			);
			// Add the link to the chain array
			chain.push(link);
			// Add the link to the Matter.js world
			//Matter.World.add(engine.world, link);

			// Create a revolute constraint to connect the link to the previous link
			if (i > 0) {
				const prevLink = chain[i - 1];
				const constraint = Matter.Constraint.create({
					bodyA: prevLink,
					bodyB: link,
					pointA: {
						x: 0,
						y: linkHeight / 2
					},
					pointB: {
						x: 0,
						y: -linkHeight / 2
					},
					length: linkSpacing
				});
				// Add the constraint to the chainConstraints array
				chainConstraints.push(constraint);
				// Add the constraint to the Matter.js world
				//Matter.World.add(engine.world, constraint);
			}
		}

		// Add the chain and constraints to a composite body
		const chainComposite = Matter.Composite.create({
			bodies: chain,
			constraints: chainConstraints
		});

		// Add the composite body to the Matter.js world
		Matter.World.add(engine.world, chainComposite);

		// create floor
		const floor = Matter.Bodies.rectangle(0, 600, 1500, 100, {
			isStatic: true
		});
		Matter.World.add(engine.world, floor);

		// Start the Matter.js engine and renderer

		// run engine on space bar press
		document.addEventListener('keydown', function (event) {
			if (event.keyCode === 32) {
				Matter.Engine.update(engine, 1000 / 60);
			}
		});

		// spawn in a ball on mouse click
		document.addEventListener('click', function (event) {
			// get correct mouse pos on canvas:
			// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
			const rect = render.canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			const ball = Matter.Bodies.circle(x, y, 20);
			// send the ball to the left of the screen
			Matter.Body.setVelocity(ball, {
				x: -10,
				y: 0
			});
			Matter.World.add(engine.world, ball);
		});

		// const mouseBall = Matter.Bodies.circle(0, 0, 20, {
		// 	isStatic: true
		// });
		// Matter.World.add(engine.world, mouseBall);

		const mousePos = {
			x: 0,
			y: 0
		};

		// move first link of chain to mouse pos
		document.addEventListener('mousemove', function (event) {
			// get correct mouse pos on canvas:
			// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
			const rect = render.canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			mousePos.x = x;
			mousePos.y = y;
		});

		setInterval(() => {
			const x = mousePos.x;
			const y = mousePos.y;

			// if distance to mouse pos is less than 10, stop moving
			const d1 = Math.sqrt(
				Math.pow(x - chain[0].position.x, 2) + Math.pow(y - chain[0].position.y, 2)
			);
			if (d1 < 50) {
				return;
			}

			// set mouseBall to mouse pos
			// Matter.Body.setPosition(mouseBall, {
			// 	x,
			// 	y
			// });

			// get target velocity to mouse pos
			// https://stackoverflow.com/questions/5306680/move-an-object-towards-a-certain-point
			const target = {
				x,
				y
			};
			const dx = target.x - chain[0].position.x;
			const dy = target.y - chain[0].position.y;
			const angle = Math.atan2(dy, dx);
			// set speed inverse of distance
			const distance = Math.sqrt(dx * dx + dy * dy);

			// set speed inverse of distance
			const speed = Math.min(500 / distance, 20);

			const velX = Math.cos(angle) * speed;
			const velY = Math.sin(angle) * speed;

			// move first link of chain to mouse pos
			Matter.Body.setVelocity(chain[0], {
				x: velX,
				y: velY
			});
		}, 1000 / 60);

		Matter.Render.run(render);
		Matter.Runner.run(engine);
	});
</script>

<canvas id="canvas" />
<h1>ABOUT PAGE</h1>

<style>
	h1 {
		color: red;
	}

	canvas {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
