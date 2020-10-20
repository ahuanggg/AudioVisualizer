/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

//declaring variables for my moving stuff
let ballX = 100;
let ballY = 100;
let balls = [];
balls.push({startX: 10,  startY: 10,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 100, startY: 100, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 50,  startY: 50,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 200, startY: 200, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 400, startY: 400, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 10,  startY: 10,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 100, startY: 100, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 50,  startY: 50,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 200, startY: 200, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 400, startY: 400, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 100, startY: 100, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 50,  startY: 50,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 200, startY: 200, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 400, startY: 400, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 10,  startY: 10,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 100, startY: 100, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 50,  startY: 50,  color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 200, startY: 200, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})
balls.push({startX: 400, startY: 400, color: utils.getRandomColor(), radius: utils.getRandom(1,20), dy: utils.getRandom(1,30), dx: utils.getRandom(1,30)})

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

function draw(params = {}) {
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
        console.log("inside;");
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 350;
        let topSpacing = 100;

        ctx.save();

        //loop through the data and draw

        for (let i = 0; i < audioData.length ; i++) {
            
            if(i % 2 === 0){
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.strokeStyle = `rgba(255,100,255,0.5)`;
            }
            else{
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.strokeStyle = `rgba(0, 126, 255, 0.5)`;
            }

            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 250 - audioData[i], barWidth, barHeight);
        }
        ctx.restore;
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 3;
        ctx.save();
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 255, 0, .34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 255, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(120, 120, 255, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .75, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
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

    

    if (params.showEmboss) {
        console.log("inside showemboss");
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; 
            else{data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4]};
        }
    }

    // if (params.showCrazy) {

    //     }
    // }

    ctx.putImageData(imageData, 0, 0);

    // D) copy image data back to canvas
    
    if (params.showCrazy) { 
        for (let i = 0; i < balls.length; i++){
           
            ctx.save();
            ctx.beginPath();

            let ball = balls[i];

            ball.startX = ball.startX + ball.dx;
            ball.startY = ball.startY + ball.dy;

            ctx.fillStyle = ball.color;
            ctx.arc(ball.startX, ball.startY, ball.radius, 0, Math.PI * 2, true);

            if( ball.startX < 0 || ball.startX > canvasWidth) ball.dx=-ball.dx; 
            if( ball.startY < 0 || ball.startY > canvasHeight) ball.dy=-ball.dy; 
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();

        }
        // making a wall in the canvas
        // if( ballX<0 || ballX>canvasWidth) dX=-dX; 
        // if( ballY<0 || ballY>canvasHeight) dY=-dY; 
        // ballX += dX;
        // ballY += dY;
    }

    

    
}



export {
    setupCanvas,
    draw
};