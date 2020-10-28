/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import {
    audioCtx
} from './audio.js';
import * as utils from './utils.js';
import * as main from './main.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

class Ball {
    constructor(startX, startY, color, radius, dy, dx) {
        this.startX = startX;
        this.startY = startY;
        this.color = color;
        this.radius = radius;
        this.dy = dy;
        this.dx = dx;
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.fillStyle = "#59F9B5";
        ctx.fill();
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
let pulseTime = 2500;
let numofparticles = 100;


//declaring variables for my moving stuff
let balls = [];
let spawnBallsYet = false;
let pulseCount = 0;
let pulseFirstTime = true;

//variables for the bar circle
let degrees = 0;
let increase = 1;


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

    // 2 - draw background
    ctx.save();
    ctx.fillstyle = "white";
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

    // if(params.showBars) {
    //     let barSpacing = 4,
    //         barWidth = canvasWidth / 20,
    //         barHeight = 350,
    //         degrees = 0;

    //     for(let i = 0; i < audioData.length; i ++){

    //     }

    // }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / 20;
        let barHeight = 350;
        let topSpacing = 75;
        let radius = 100;


        ctx.save();

        //loop through the data and draw
        for (let i = 0; i < audioData.length; i++) {

            if (i % 2 === 0) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.strokeStyle = `rgba(255,100,255,0.5)`;
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.strokeStyle = `rgba(0, 126, 255, 0.5)`;
            }


            let radians = utils.degreesToRadians(degrees);
            degrees += increase;
            if (degrees === 360) {
                degrees = 0;
            }

            let circleX = canvasWidth / 2 + radius * Math.cos(radians);
            let circleY = canvasHeight / 2 + radius * Math.sin(radians);
            // ctx.beginPath();
            // ctx.arc(circleX, circleY, 2,0,Math.PI*2,true);
            // ctx.fill();
            // ctx.closePath();



            ctx.fillRect(circleX, circleY, barWidth, audioData[i]);
            ctx.strokeRect(circleX, circleY, barWidth, audioData[i]);
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.rotate(Math.PI / 4);
            ctx.translate(-canvasWidth / 2, -canvasHeight / 2);


            // ctx.fillRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
            // ctx.strokeRect(margin + i * (barWidth + barSpacing), 0, barWidth, audioData[i]);
        }
        ctx.restore();
    }


    if (params.showPulse) {

        // let i;
        // ctx.save();
        // for (i = 0; i < audioData.length; i++) {
            
        // }


        // ctx.restore();
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
                let color = "#59F9B5"

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
                    ctx.strokeStyle = "rgba(55,186,130,1)";
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
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

        if (params.showNoise && Math.random() < 0.2) {
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

    // if (params.showEmboss) {
    //     console.log("inside showemboss");
    //     for (let i = 0; i < length; i++) {
    //         if (i % 4 == 3) continue; 
    //         else{data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4]};
    //     }
    // }

    // ctx.putImageData(imageData, 0, 0);

    // D) copy image data back to canvas

    // showballs
    if (params.showBalls) {

        if (!spawnBallsYet) {
            for (let i = 0; i < ballCount; i++) {
                let ball = new Ball(utils.getRandom(0, canvasWidth), utils.getRandom(0, canvasHeight), utils.getRandomColor(), utils.getRandom(5, 20), utils.getRandom(-30, 30), utils.getRandom(-30, 30));
                balls.push(ball);
            }
            spawnBallsYet = true;
        }


        for (let i = 0; i < balls.length; i++) {

            ctx.save();
            ctx.beginPath();

            let ball = balls[i];

            ball.startX = ball.startX + ball.dx;
            ball.startY = ball.startY + ball.dy;

            ctx.fillStyle = ball.color;
            ctx.arc(ball.startX, ball.startY, ball.radius, 0, Math.PI * 2, true);

            if (ball.startX < 0 || ball.startX > canvasWidth) ball.dx = -ball.dx;
            if (ball.startY < 0 || ball.startY > canvasHeight) ball.dy = -ball.dy;

            ctx.closePath();
            ctx.fill();
            ctx.restore();

        }
    }
}



export {
    setupCanvas,
    draw
};