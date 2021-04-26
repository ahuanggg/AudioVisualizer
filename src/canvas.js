/*
    Take in the analyser node and the canvas element: 
    in draw() it will loop through the data in the node
    then draw something with that data on the canvas
*/

// importing functions from other js files
import { audioCtx, duration, time, element } from './audio.js';
import * as utils from './utils.js';
import * as main from './main.js';

// global variables
let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

/*
    ball class to keep track of all the balls in the screen 
    - x,y
    - color
    - size
    - direction going to
*/
class Ball {
	constructor(x, y, color, size, directionY, directionX) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.size = size;
		this.directionY = directionY;
		this.directionX = directionX;
	}

	// drawing the balls on to the canvas
	draw() {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	update() {
		// check if the ball is near a wall if true then reverse its direction to make it seem like it bounced
		if (this.x > canvasWidth || this.x < 0) {
			this.directionX = -this.directionX;
			//console.log(this.directionalX);
		}
		if (this.y > canvasHeight || this.y < 0) {
			this.directionY = -this.directionY;
			//console.log(this.directionalY);
		}

		// keep track of where the mouse is and moves the ball in according to the mouse direction and location
		let dx = main.mouse.x - this.x;
		let dy = main.mouse.y - this.y;

		let dist = Math.sqrt(dx * dx + dy * dy);

		// if distance is less than mouse radius + ball size (overlapping) then move the ball
		if (dist < main.mouse.radius + this.size) {
			if (main.mouse.x < this.x && this.x < canvasWidth - this.size * 10) {
				this.x += 10;
			}
			if (main.mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10;
			}
			if (main.mouse.y < this.y && this.y < canvasHeight - this.size * 10) {
				this.y += 10;
			}
			if (main.mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10;
			}
		}

		this.x += this.directionX;
		this.y += this.directionY;

		this.draw();
	}
}

// particle class to keep track of the stringy things on screen
class Particle {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
	}

	// draw the particle on to the canvas
	draw() {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.restore();
	}

	update() {
		// check if the particle is near a wall if true then reverse its direction to make it seem like it bounced
		if (this.x > canvasWidth || this.x < 0) {
			this.directionX = -this.directionX;
		}
		if (this.y > canvasHeight || this.y < 0) {
			this.directionY = -this.directionY;
		}

		// keeping track of the mouse
		let dx = main.mouse.x - this.x;
		let dy = main.mouse.y - this.y;

		// calculate distance between mouse and the particle
		let dist = Math.sqrt(dx * dx + dy * dy);

		// if distance is less than mouse radius + particle size (overlapping) then move the particle
		if (dist < main.mouse.radius + this.size) {
			if (main.mouse.x < this.x && this.x < canvasWidth - this.size * 10) {
				this.x += 10;
			}
			if (main.mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10;
			}
			if (main.mouse.y < this.y && this.y < canvasHeight - this.size * 10) {
				this.y += 10;
			}
			if (main.mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10;
			}
		}

		this.x += this.directionX;
		this.y += this.directionY;

		this.draw();
	}
}

// declaring variables for my moving stuff
let balls = [];
let spawnBallsYet = false;
let particles = [];
let madeParticle = true;

let ballCount = 10;
let numofparticles = 10;

// variables for the bar circle
let degrees = 0;
let increase = 0.5;

function setupCanvas(canvasElement, analyserNodeRef) {
	// create drawing context
	ctx = canvasElement.getContext('2d');
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [
		{
			percent: 0,
			color: 'plum',
		},
		{
			percent: 0.25,
			color: 'orchid',
		},
		{
			percent: 0.5,
			color: 'magenta',
		},
		{
			percent: 0.75,
			color: 'orchid',
		},
		{
			percent: 1,
			color: 'plum',
		},
	]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}) {
	// populate the audioData array with the frequency data from the analyserNode
	analyserNode.getByteFrequencyData(audioData);
	// console.log(element.duration);
	// console.log(element.currentTime);

	// draw duration bar
	ctx.save();
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, canvasHeight - 10, canvasWidth, 20);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, canvasHeight - 10, (element.currentTime * canvasWidth) / element.duration, 20);
	ctx.restore();

	// draw background
	ctx.save();
	ctx.fillStyle = '#FFFFFF';
	ctx.globalAlpha = 0.1;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.restore();

	// draw gradient
	if (params.showGradient) {
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = 0.3;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		ctx.restore();
	}

	// draw bars
	if (params.showBars) {
		let barSpacing = 4;
		let margin = 5;
		let screenWidthForBars = canvasWidth - audioData.length * barSpacing - margin * 2;
		let barWidth = screenWidthForBars / 20;
		// let barHeight = 350;
		// let topSpacing = 75;
		let radius = 100;

		let radians = utils.degreesToRadians(degrees);
		degrees += increase;
		if (degrees === 360) {
			degrees = 0;
		}

		let circleX = canvasWidth / 2 + radius * Math.cos(radians);
		let circleY = canvasHeight / 2 + radius * Math.sin(radians);

		ctx.save();

		//loop through the data and draw
		for (let i = 0; i < audioData.length; i++) {
			if (i % 2 === 0) {
				ctx.fillStyle = 'rgba(255,255,255,0.3)';
				ctx.strokeStyle = `rgba(255,100,255,0.3)`;
			} else {
				ctx.fillStyle = 'rgba(255,255,255,0.3)';
				ctx.strokeStyle = `rgba(0, 126, 255, 0.3)`;
			}

			// ctx.beginPath();
			// ctx.arc(circleX, circleY, 2,0,Math.PI*2,true);
			// ctx.fill();
			// ctx.closePath();

			ctx.fillRect(circleX, circleY, barWidth + 10, audioData[i]);
			ctx.strokeRect(circleX, circleY, barWidth + 10, audioData[i]);

			ctx.translate(canvasWidth / 2, canvasHeight / 2);
			ctx.rotate(Math.PI / 30);
			ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

			//console.log(audioData[i]);

			// ctx.fillRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
			// ctx.strokeRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
		}
		ctx.restore();
	}

	// draw circles
	if (params.showCircles) {
		if (madeParticle) {
			particles = []; // reset particles list when changed
			for (let i = 0; i < numofparticles; i++) {
				let size = utils.getRandom(1, 5);
				let x = utils.getRandom(0, canvasWidth - 10);
				let y = utils.getRandom(0, canvasHeight - 10);
				let directionX = utils.getRandom(0, 2.5);
				let directionY = utils.getRandom(0, 2.5);
				let color = '#00ff9d';

				particles.push(new Particle(x, y, directionX, directionY, size, color));
			}
			// make sure it is not changed everytime it is looped
			madeParticle = false;
		}

		// call the particle update function
		for (let i = 0; i < particles.length; i++) {
			particles[i].update();
		}

		// make the particles connect to each other when it is at a certain distance within each other
		for (let a = 0; a < particles.length; a++) {
			for (let b = 0; b < particles.length; b++) {
				let dist = Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2);
				if (dist < ((canvasWidth / 7) * canvasHeight) / 7) {
					ctx.save();
					ctx.strokeStyle = '#00ff9d';
					ctx.beginPath();
					ctx.moveTo(particles[a].x, particles[a].y);
					ctx.lineTo(particles[b].x, particles[b].y);
					ctx.stroke();
					ctx.restore();
				}
			}
		}
	}

	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	// let width = imageData.width;

	// iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i += 4) {
		if (params.showNoise && Math.random() < 0.05) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i + 1] = data[i + 2] = 0;

			data[i] = 255;
			data[i + 1] = 255;
			data[i + 2] = 0;
		}

		if (params.showInvert) {
			let red = data[i],
				green = data[i + 1],
				blue = data[i + 2];

			data[i] = 255 - red;
			data[i + 1] = 255 - green;
			data[i + 2] = 255 - blue;
		}
	}

	ctx.putImageData(imageData, 0, 0);

	// showballs
	if (params.showBalls) {
		if (!spawnBallsYet) {
			balls = []; // reset the balls list everytime its changed
			for (let i = 0; i < ballCount; i++) {
				let ball = new Ball(utils.getRandom(0, canvasWidth), utils.getRandom(0, canvasHeight), utils.getRandomNeon(), utils.getRandom(5, 20), utils.getRandom(-1, 1), utils.getRandom(-1, 1));
				balls.push(ball);
			}
			// make sure its not called everytime it is looped
			spawnBallsYet = true;
		}

		//update the balls location everytime it is looped
		for (let i = 0; i < balls.length; i++) {
			balls[i].update();
		}
	}
}

// function to change the ball count when the slider is changed
function changeBallCount(num) {
	ballCount = num;
	spawnBallsYet = false;
	console.log(ballCount);
	draw();
}

// function to change the particle count when the slider is change
function changeParticleCount(num) {
	numofparticles = num;
	madeParticle = true;
	console.log(numofparticles);
	draw();
}

export { setupCanvas, draw, changeBallCount, changeParticleCount };
