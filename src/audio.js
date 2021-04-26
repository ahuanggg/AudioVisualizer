let audioCtx;
let element, sourceNode, analyserNode, gainNode, filter, duration, time;

// DEFAULTS enum
const DEFAULTS = Object.freeze({
	gain: 0.5,
	numSamples: 256,
	lowpass: 800,
});

// array to hold audio freq data (0-255)
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// function to set up web audio by setting default values and connecting audio nodes
// takes in a filepath of a .mp3 file to read
function setupWebaudio(filePath) {
	const AudioContext = window.AudioContext || window.webkitAudioContext;

	audioCtx = new AudioContext();
	element = new Audio();

	duration = element.duration;
	time = element.currentTime;

	loadSoundFile(filePath);

	sourceNode = audioCtx.createMediaElementSource(element);
	analyserNode = audioCtx.createAnalyser();

	// fft stands for Fast Fourier Transform
	analyserNode.fftSize = DEFAULTS.numSamples;

	filter = audioCtx.createBiquadFilter();
	filter.type = 'lowpass';
	filter.frequency.value = DEFAULTS.lowpass;

	// create a gain (volume) node
	gainNode = audioCtx.createGain();
	gainNode.gain.value = DEFAULTS.gain;

	// connect the nodes to make an audio graph
	sourceNode.connect(filter);
	filter.connect(analyserNode);
	analyserNode.connect(gainNode);
	gainNode.connect(audioCtx.destination);
}

// function to load sound file from the param filePath
function loadSoundFile(filePath) {
	element.src = filePath;
}

// function to play the current sound when the play button is pressed
function playCurrentSound() {
	element.play();
}

// function to pause the current sound when the pause button is pressed
function pauseCurrentSound() {
	element.pause();
}

// function to set the volume of the sound when the silder is being changed
function setVolume(value) {
	value = Number(value); // make sure that it's a Number rather than a String
	gainNode.gain.value = value;
}

// function to set the lowpass of the sound when the slider is being changed
function setlowpass(value) {
	value = Number(value);
	filter.frequency.value = value;
}

// exporting fucntions to use
export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, setlowpass, analyserNode, duration, time, element };
