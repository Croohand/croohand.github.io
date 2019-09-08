const LINES_SHRINK = 1;
const WALKERS_SHRINK = 1;

const FFT_SMOOTHING = 0.8;
const FFT_BINS = 128;

const FRAME_RATE = 60;

let canvas;
let mic, fft, oldSpectrum, peakDetect;

let actions = {};
let wolfGifs = [];
let walkers = [];
let volume = 0;
let sizeCoeff = 100;
let walkersHue = 0;

let fs = false;

function setup() {
  fullscreen(fs);
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  window.onresize();

  background(0);
  colorMode(HSB, 100, 100, 100, 100);

  frameRate(FRAME_RATE);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(FFT_SMOOTHING, FFT_BINS);
  fft.setInput(mic);

  peakDetect = new p5.PeakDetect(200, 250, 0.95, 30);

  createWalkers();
}

function createWalkers() {
  walkersHue = random(100);
  let walkersCount = FFT_BINS / WALKERS_SHRINK;
  for (let i = 0; i < walkersCount; ++i) {
    walkers[i] = {
      angle: 2 * PI / walkersCount * i
    }
  }
}

function draw() {
  volume = mic.getLevel();

  fill(0, 0, 0, 7);
  noStroke();
  rect(0, 0, width, height);

  let gotSpectrum = fft.analyze();
  let spectrum = shrink(gotSpectrum, LINES_SHRINK);

  if (!oldSpectrum) {
    oldSpectrum = spectrum;
  }

  for (let i = 0; i < spectrum.length; i++) {
    let now = spectrum[i];
    let old = oldSpectrum[i];
    let diff = abs(now - old) / (max(now, old) + 1);

    if (diff < 0.4) {
      continue;
    }
    if (now < 15 || volume < 0.01 || i < 30) {
      continue;
    }

    if (!(i in actions)) {
      actions[i] = createAction();
    }
    actions[i] = updateAction(actions[i], now, i);
  }

  oldSpectrum = spectrum;

  let gotWaveform = fft.waveform();
  let waveform = shrink(gotWaveform, WALKERS_SHRINK);

  walkersHue += random(-1, 1);
  if (walkersHue < 0) {
    walkersHue += 100;
  }
  if (walkersHue > 100) {
    walkersHue -= 100;
  }

  noStroke();
  let walkersOpac = 30 + sqrt(volume) * 30;
  fill(walkersHue, 100, 100, walkersOpac);

  for (let i = 0; i < waveform.length; ++i) {
    let speed = sizeCoeff * sqrt(volume) / 80;
    let size = 1 + sizeCoeff * sqrt(volume) * 15;
    let angle = walkers[i].angle + speed;
    let offset = sizeCoeff * waveform[i] * 60;
    let dist = sizeCoeff * pow(waveform.length, 0.33) * 37 + offset;
    dist = dist * pow(volume, 0.05);

    let x = cos(angle) * dist;
    let y = sin(angle) * dist;

    ellipse(width / 2 + x, height / 2 + y, size, size);

    walkers[i].angle = angle;
  }

  peakDetect.update(fft);
  if (peakDetect.isDetected) {
    blink(random(100), random(80, 120));
  }
}

function shrink(arr, coeff) {
  if (coeff === 1) {
    return arr;
  }
  let res = [];
  for (let i = 0; i < arr.length; i += coeff) {
    let s = 0;
    let cnt = 0;
    for (let j = i; j < min(arr.length, i + coeff); ++j) {
      cnt += 1;
      s += arr[j];
    }
    res[i / coeff] = s / cnt;
  }
  return res;
}

function createAction() {
  return {
    type: 'line',
    x: random(width),
    y: random(height)
  }
}

function blink(hue, strength) {
  fill(hue, 100, 100, min(30, map(strength, 80, 130, 15, 30)));
  noStroke();
  rect(0, 0, width, height);
}

function updateAction(action, strength, freq) {
  switch (action.type) {
    case 'line':
      let hue = walkersHue + 50;
      hue += random(-25, 25);
      if (hue > 100) {
        hue -= 100;
      }
      if (hue < 0) {
        hue += 100;
      }

      let newCoords = (x, y, maxdist) => [random(max(0, x-maxdist), min(width, x+maxdist)), random(max(0, y-maxdist), min(height, y+maxdist))];

      let maxdist = 2 * map(strength, 0, 255, 0, max(width, height)) + 1;
      let new_x, new_y;

      let good = false;
      while (!good) {
        for (let i = 0; i < 3; ++i) {
          [new_x, new_y] = newCoords(action.x, action.y, maxdist);
          if (dist(action.x, action.y, new_x, new_y) < maxdist) {
            good = true;
            break;
          }
        }
        maxdist *= 2;
      }

      stroke(hue, min(100, map(strength, 0, 50, 50, 100)), min(100, map(strength, 0, 50, 60, 100)));
      strokeWeight(map(strength, 0, 50, 1, 4));
      line(action.x, action.y, new_x, new_y);

      action.x = new_x;
      action.y = new_y;
      break;
    default:
      throw "Not implemented";
  }
  return action;
}

function keyPressed() {
  if (key == ' ') {
    blink(random(100), random(80, 120));
    return;
  }
  if (!(key in actions)) {
    actions[key] = createAction();
  }
  actions[key] = updateAction(actions[key], random(30, 120));
}

function mousePressed() {
  fs = !fs;
  fullscreen(fs);
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
  width = w;
  height = h;

  for (let key in actions) {
    actions[key] = createAction();
  }

  sizeCoeff = min(w, h) / 500;
}
