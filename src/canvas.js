/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import {
    audioCtx, duration, time, element
} from './audio.js';
import * as utils from './utils.js';
import * as main from './main.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;



class Ball {
    constructor(x, y, color, size, directionY, directionX) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.directionY = directionY;
        this.directionX = directionX;
    }
    draw() {
        ctx.save()
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    update(){
        if(this.x > canvasWidth || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvasHeight || this.y < 0){
            this.directionY = -this.directionY;
        }
        let dx = main.mouse.x - this.x;
        let dy = main.mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < main.mouse.radius + this.size){
            if(main.mouse.x < this.x && this.x < canvasWidth - this.size * 10){
                this.x += 10;
            }
            if(main.mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }
            if(main.mouse.y < this.y && this.y < canvasHeight - this.size * 10){
                this.y += 10;
            }
            if(main.mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

class Particle {
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() { //draw the particle
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
    }
    update() { //check if the mouse is hitting the particle
        if(this.x > canvasWidth || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvasHeight || this.y < 0){
            this.directionY = -this.directionY;
        }
        let dx = main.mouse.x - this.x;
        let dy = main.mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < main.mouse.radius + this.size){
            if(main.mouse.x < this.x && this.x < canvasWidth - this.size * 10){
                this.x += 10;
            }
            if(main.mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }
            if(main.mouse.y < this.y && this.y < canvasHeight - this.size * 10){
                this.y += 10;
            }
            if(main.mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }

        }
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

let particles = [];

let madeParticle = true;


//customizeable variables
let ballCount = 30;
let numofparticles = 100;


//declaring variables for my moving stuff
let balls = [];
let spawnBallsYet = false;


//variables for the bar circle
let degrees = 0;
let increase = .5;


function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
        percent: 0,
        color: "plum"
    }, {
        percent: .25,
        color: "orchid"
    }, {
        percent: .5,
        color: "magenta"
    }, {
        percent: .75,
        color: "orchid"
    }, {
        percent: 1,
        color: "plum"
    }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}, mouse = {}) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // console.log(element.duration);
    // console.log(element.currentTime);

    //drawing the duration bar
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,canvasHeight - 10, canvasWidth, 20);
    ctx.fillStyle = "black";
    ctx.fillRect(0,canvasHeight - 10, element.currentTime * canvasWidth / element.duration, 20);
    ctx.restore();

    


    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.restore();
        
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / 20;
        let barHeight = 350;
        let topSpacing = 75;
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
            ctx.rotate(Math.PI/30);
            ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

            //console.log(audioData[i]);


            // ctx.fillRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
            // ctx.strokeRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
        }
        ctx.restore();
    }


    if (params.showPulse) {

        

    }

    // // 5 - draw circles
    if (params.showCircles) {
        
        if(madeParticle){
            for(let i = 0; i < numofparticles; i++){
            
                let size = utils.getRandom(1,5);
                let x = utils.getRandom(0,canvasWidth -10);
                let y = utils.getRandom(0, canvasHeight -10);
                let directionX = utils.getRandom(0,2.5);
                let directionY = utils.getRandom(0,2.5);
                let color = "#00ff9d";
                

                particles.push(new Particle(x,y,directionX,directionY,size,color));
            }
            madeParticle = false;
        }
    
        

        for(let i = 0; i < particles.length; i++){
            particles[i].update();
        }

        for(let a = 0; a <particles.length; a++){
            for(let b = 0; b < particles.length; b++){
                let dist = (Math.pow((particles[a].x - particles[b].x),2)) + (Math.pow((particles[a].y - particles[b].y),2));
                if(dist < (canvasWidth / 7 * canvasHeight/7)) {
                    ctx.save();
                    ctx.strokeStyle = "#00ff9d"
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }


    }


    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red

        if (params.showNoise && Math.random() < 0.05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel
            // zero out the red and green and blue channels
            data[i] = data[i + 1] = data[i + 2] = 0;
            // make the red channel 100% red
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 0;
        } // end if

        if (params.showInvert) {

            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];

            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        }
    } // end for

    ctx.putImageData(imageData, 0, 0);

    // D) copy image data back to canvas

    // showballs
    if (params.showBalls) {

        if (!spawnBallsYet) {
            for (let i = 0; i < ballCount; i++) {
                let ball = new Ball(utils.getRandom(0, canvasWidth), utils.getRandom(0, canvasHeight), utils.getRandomNeon(), utils.getRandom(5, 20), utils.getRandom(-1, 1), utils.getRandom(-1, 1));
                balls.push(ball);
            }
            spawnBallsYet = true;
        }

        for (let i = 0; i < balls.length; i++) {

            balls[i].update();

        }
    }
}



export {
    setupCanvas,
    draw
};