const FRAME_RATE = 60;
let FULL_SCREEN = false;

let APPLYING_OPACITY = 15;

let canvas;
let deltaTime, prevTime;

let ents = [];
let freeEnts = 0;

function setup() {
  frameRate(FRAME_RATE);

  canvas = createCanvas(window.innerWidth, window.innerHeight);
  fullscreen(FULL_SCREEN);

  setHSB();
  background(0);
}

function draw() {
  setTime();
  if (frameCount === 1) {
    return;
  }

  noStroke();
  fill(0, 0, 0, APPLYING_OPACITY);
  rect(0, 0, width, height);

  if (ents.length < 250 && random(ents.length + 1) < 10) {
    let ent = new Ent(new p5.Vector(width / 2, height / 2));
    ent.init();
    ents.push(ent);
  }

  freeEnts = 0;
  for (let i = 0; i < ents.length; ++i) {
    ents[i].update();
    if (!ents[i].isBusy()) {
      freeEnts++;
    }
    ents[i].show();
  }
}

function mousePressed() {
  FULL_SCREEN = !FULL_SCREEN;
  fullscreen(FULL_SCREEN);
}

function setTime() {
  deltaTime = (millis() - prevTime) / 1000.0;
  prevTime = millis();
}

function setHSB() {
  colorMode(HSB, 100, 100, 100, 100);
}

function setRGB() {
  colorMode(RGB, 100, 100, 100, 100);
}

function fit(value, lower, upper) {
  let diff = upper - lower;
  while (value < lower) {
    value += diff;
  }
  while (value > upper) {
    value -= diff;
  }
  return value;
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
  width = w;
  height = h;
}
