const FRAME_RATE = 30;

let FULL_SCREEN = false;
let canvas;

function setup() {
    frameRate(FRAME_RATE);

    canvas = createCanvas(windowWidth, windowHeight);
    fullscreen(FULL_SCREEN);

    colorMode(RGB, 100, 100, 100, 100);
}

function draw() {
    background(0);
    for (let x = 0; x < width; x += 20)
        for (let y = 0; y < height; y += 20) {
            let n = noise((x + frameCount * 3) / 100, y / 100);
            noStroke();
            fill(80 * n, 80 * n, 80);
            rect(x + n * 15, y + n * 15, 3 + n * 10, 3 + n * 10, n * 4, n * 4, n * 4, n * 4);
        }
}

function mousePressed() {
    FULL_SCREEN = !FULL_SCREEN;
    fullscreen(FULL_SCREEN);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
