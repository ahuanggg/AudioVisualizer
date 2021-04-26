import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1: 'media/Shelter.mp3',
});

// setting drawing params
let drawParams = {
	showGradient: true,
	showBars: true,
	showCircles: true,
	showNoise: false,
	showInvert: false,
	showBalls: true,
};

// setting mouse location
let mouse = {
	x: null,
	y: null,
	radius: 50,
};

// function that calls everything and gets things started
function init() {
	console.log('init called');
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector('canvas'); // hookup <canvas> element
	canvas.setupCanvas(canvasElement, audio.analyserNode);
	setupUI(canvasElement);
	loop();
}

function setupUI(canvasElement) {
	// hookup fullscreen button
	const fsButton = document.querySelector('#fsButton');

	// add .onclick event to button
	fsButton.onclick = (e) => {
		console.log('init called');
		utils.goFullscreen(canvasElement);
	};

	// add.onlick event to play button
	playButton.onclick = (e) => {
		console.log(`audioCtx.sate before = ${audio.audioCtx.state}`);

		// check if context is in suspended state (autoplay policy)
		if (audio.audioCtx.state == 'suspended') {
			audio.audioCtx.resume();
		}
		console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

		if (e.target.dataset.playing == 'no') {
			// if the audio is paused, play it
			audio.playCurrentSound();
			e.target.dataset.playing = 'yes';
		} else {
			audio.pauseCurrentSound();
			e.target.dataset.playing = 'no';
		}
	};

	// hookup volume slider & label
	let volumeSlider = document.querySelector('#volumeSlider');
	let volumeLabel = document.querySelector('#volumeLabel');

	// add .oninput event to slider
	volumeSlider.oninput = (e) => {
		// set the gain
		audio.setVolume(e.target.value);
		// update value of label to math vallue of slider
		volumeLabel.innerHTML = Math.round((e.target.value / 2) * 100);
	};

	// set value of label to math initial value of slider
	volumeSlider.dispatchEvent(new Event('input'));

	let lowpassSlider = document.querySelector('#lowpassSlider');
	let lowpassLabel = document.querySelector('#lowpassLabel');

	lowpassSlider.oninput = (e) => {
		// set the lowpass
		audio.setlowpass(Math.round((e.target.value / 2) * 100));

		// update value of label to math value of slider
		lowpassLabel.innerHTML = Math.round((e.target.value / 2) * 100);
	};

	lowpassSlider.dispatchEvent(new Event('input'));

	// hook up the track change
	let trackSelect = document.querySelector('#trackSelect');
	// add .onchange event to <select>
	trackSelect.onchange = (e) => {
		audio.loadSoundFile(e.target.value);
		// pause the current tack if it is playing
		if ((playButton.dataset.playing = 'yes')) {
			playButton.dispatchEvent(new MouseEvent('click'));
		}
	};

	let numBalls = document.querySelector('#numBalls');
	let numBallsLabel = document.querySelector('#numBallsLabel');

	// add .oninput event to slider
	numBalls.oninput = (e) => {
		canvas.changeBallCount(Math.round(e.target.value));
		// update value of label to math value of slider
		numBallsLabel.innerHTML = Math.round(e.target.value);
	};
	// set value of label to math initial value of slider
	numBalls.dispatchEvent(new Event('input'));

	let numParticles = document.querySelector('#numParticles');
	let numParticlesLabel = document.querySelector('#numParticlesLabel');

	// add .oninput event to slider
	numParticles.oninput = (e) => {
		canvas.changeParticleCount(Math.round(e.target.value));
		//update value of label to math value of slider
		numParticlesLabel.innerHTML = Math.round(e.target.value);
	};
	// set value of label to math initial value of slider
	numParticles.dispatchEvent(new Event('input'));

	document.querySelector('#gradientCB').checked = drawParams.showGradient;
	document.querySelector('#barsCB').checked = drawParams.showBars;
	document.querySelector('#circlesCB').checked = drawParams.showCircles;
	document.querySelector('#ballsCB').checked = drawParams.showBalls;

	document.querySelector('#noiseCB').checked = drawParams.showNoise;
	document.querySelector('#invertCB').checked = drawParams.showInvert;

	document.querySelector('#gradientCB').onchange = (e) => {
		drawParams.showGradient = e.target.checked;
	};

	document.querySelector('#barsCB').onchange = (e) => {
		drawParams.showBars = e.target.checked;
	};

	document.querySelector('#circlesCB').onchange = (e) => {
		drawParams.showCircles = e.target.checked;
	};

	document.querySelector('#noiseCB').onchange = (e) => {
		drawParams.showNoise = e.target.checked;
	};

	document.querySelector('#invertCB').onchange = (e) => {
		drawParams.showInvert = e.target.checked;
	};

	document.querySelector('#ballsCB').onchange = (e) => {
		drawParams.showBalls = e.target.checked;
	};

	window.addEventListener('mousemove', function (event) {
		mouse.x = event.x;
		mouse.y = event.y;
	});
}

function loop() {
	requestAnimationFrame(loop);
	canvas.draw(drawParams, mouse);
}

export { init, mouse };
