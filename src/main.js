/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

let drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: false,
    showNoise: false,
    showInvert: false,
    showEmboss: false,
    showBalls: false
};

function init() {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    setupUI(canvasElement);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    //add.onlick event to play button
    playButton.onclick = e => {
        console.log(`audioCtx.sate before = ${audio.audioCtx.state}`);

        //check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

        if (e.target.dataset.playing == "no") {
            //if the audio is paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }

    };

    //c - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    //add .oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update value of label to math vallue of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    }

    //set value of label to math initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    //d - hook up the track change
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause the current tack if it is playing
        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };


    document.querySelector('#gradientCB').checked = drawParams.showGradient;
    document.querySelector('#barsCB').checked = drawParams.showBars;
    document.querySelector('#circlesCB').checked = drawParams.showCircles;
    document.querySelector('#noiseCB').checked = drawParams.showNoise;
    document.querySelector('#invertCB').checked = drawParams.showInvert;
    document.querySelector('#embossCB').checked = drawParams.showEmboss;
    document.querySelector('#ballsCB').checked = drawParams.showCrazy;

    document.querySelector('#gradientCB').onchange = e => {
        drawParams.showGradient = e.target.checked;
    }

    document.querySelector('#barsCB').onchange = e => {
        drawParams.showBars = e.target.checked;
    }
    
    document.querySelector('#circlesCB').onchange = e => {
        drawParams.showCircles = e.target.checked;
    }

    document.querySelector('#noiseCB').onchange = e => {
        drawParams.showNoise = e.target.checked;
    }
    
    document.querySelector('#invertCB').onchange = e => {
        drawParams.showInvert = e.target.checked;
    }

    document.querySelector('#embossCB').onchange = e => {
        drawParams.showEmboss = e.target.checked;
    }

    document.querySelector('#ballsCB').onchange = e => {
        drawParams.showBalls = e.target.checked;
    }


} // end setupUI

function loop() {
    requestAnimationFrame(loop);
    
    canvas.draw(drawParams);



}

export {
    init
};