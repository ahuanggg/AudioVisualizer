// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
  const floor = 0; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor, 255);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getRandomNeon = () => {
  let colors = ["#FFFF00", "#FFFF33", "#F2EA02", "#E6FB04","#FF0000", "#FD1C03", "#FF3300", "#FF6600", "#00FF00","#00FF33","#00FF66","#33FF00","#00FFFF","#099FFF","#0062FF","#0033FF","#FF00FF","#FF00CC","#FF0099","#CC00FF","#9D00FF","#CC00FF","#6E0DD0","#9900FF"];
  let index = Math.floor(getRandom(0, colors.length - 1));
  return colors[index];
}

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
  let lg = ctx.createLinearGradient(startX, startY, endX, endY);
  for (let stop of colorStops) {
    lg.addColorStop(stop.percent, stop.color);
  }
  return lg;
};

const degreesToRadians = (degrees) => {
  let pi = Math.PI;
  return degrees * (pi / 180);
}



const goFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  // .. and do nothing if the method is not supported
};

export {
  makeColor,
  getRandomColor,
  getLinearGradient,
  goFullscreen,
  getRandom,
  degreesToRadians,
  getRandomNeon

};