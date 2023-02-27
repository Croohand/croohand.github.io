let BUILDINGS = 50;
let buildings = [];
let back = null;

function setup() {
    createCanvas(512, 512);
    pixelDensity(1);

    back = new Background();

    let depths = [];
    for (let i = 0; i < BUILDINGS; ++i) {
        depths.push(random());
    }
    depths = depths.sort().reverse();
    for (let i = 0; i < BUILDINGS; ++i) {
        buildings.push(new Building(depths[i]));
    }
}

let W = [45, 65, 90, 115];
let H = [150, 220, 285, 360]

function negNoise(x, y = 0) {
    let SCALE = 3;
    return 2 * noise(x * SCALE, y * SCALE) - 1
}

function periodic(t) {
    return map(sin(2 * PI * t - PI / 2), -1, 1, 0, 1);
}

function Background() {
    this.border = height;

    this.draw = function(p) {
        let coeff = 50;
        this.dots = [];
        for (let i = 0; i < this.border + this.border / coeff; i += this.border / coeff) {
            let dy = this.border / coeff / 2;
            let dx = width / 10;
            let x1 = width / 3 + dx * negNoise(i * 100 + p);
            let x2 = width / 3 * 2 + dx * negNoise(i * 100 + p);
            let shape = [];
            shape.push([0, i + dy * negNoise(i * 100 + p)]);
            shape.push(shape[0]);
            shape.push([x1, i + dy * negNoise(i * 100 + x1 / width + p)]);
            shape.push([x2, i + dy * negNoise(i * 100 + x2 / width + p)]);
            shape.push([width, i + dy * negNoise(i * 100 + 1 + p)]);
            shape.push(shape[shape.length - 1]);
            this.dots.push(shape);
        }

        rectMode(CORNER);
        fill(0);
        noStroke();
        rect(0, 0, width, height);
        let startColor = color(4, 4, 84);
        let endColor = color(231, 84, 66);
        for (let i = 0; i < this.border; i += this.border / coeff) {
            noStroke();
            fill(lerpColor(startColor, endColor, i / this.border));
            rect(0, i, width, this.border / coeff);
        }
        for (let i = 0, cnt = 0; i < this.border + this.border / coeff; i += this.border / coeff, cnt++) {
            strokeWeight(this.border / coeff);
            stroke(lerpColor(startColor, endColor, i / this.border));
            noFill();
            beginShape();
            for (let j = 0; j < this.dots[cnt].length; ++j) {
                curveVertex(this.dots[cnt][j][0], this.dots[cnt][j][1]);
            }
            endShape();
        }
    }
}

function upRightQuad(x, y, w, h, angle) {
    let x1 = x + cos(angle) * h;
    let y1 = y - sin(angle) * h / 3.33333333;
    quad(x, y, x1, y1, x1 + w, y1, x + w, y);
}

function downRightQuad(x, y, w, h, angle) {
    let x1 = x + cos(angle) * w;
    let y1 = y - sin(angle) * w / 3.33333333;
    quad(x, y, x1, y1, x1, y1 + h, x, y1 + h);
}

function drawLights(x, y, w, h, angle) {
    let x1 = x + cos(angle) * h;
    let y1 = y - sin(angle) * h / 3.33333333;
    fill(230, 50, 50);
    ellipseMode(CENTER);
    ellipse(x + 1, y, 4, 4);
    ellipse(x + w - 1, y, 4, 4);
    ellipse(x1 + 1, y1, 4, 4);
    ellipse(x1 + w - 1, y1, 4, 4);
}

function Building(z) {
    this.z = z;
    this.t = int(random(3));
    this.w = W[this.t] * (1 - pow(this.z * 0.4, 2)) * 1.5;
    this.h = H[this.t] * (1 - pow(this.z * 0.4, 2)) * 2;
    this.x = random(-width - 150, width * 2 + 150);
    this.x0 = this.x;
    this.y = height - this.h / 2 - this.z * height / 5;

    this.draw = function(t) {
        this.x = this.x0 - t * width * 3;
        if (this.x < -width) {
            this.x += 3 * width;
        }
        rectMode(CORNER);
        noStroke();
        fill(lerpColor(color(0), color(30), this.z));
        rect(this.x, this.y, this.w, this.h);
        upRightQuad(this.x, this.y + 1, this.w, this.w / 1.5, PI / 2.5);
        downRightQuad(this.x + this.w - 1, this.y, this.w / 1.5, this.h, PI / 2.5);
        drawLights(this.x, this.y, this.w, this.w / 1.5, PI / 2.5);
        let szx = 5;
        let szy = 10;
        for (let dx = szx * 2; dx < this.w - szx * 2; dx += szx * 2) {
            for (let dy = szy * 2; dy < this.h - szy * 2; dy += szy * 2) {
                if (noise((this.x0 + dx) * 0.1, (this.y + dy) * 0.1) < 0.5) {
                    continue;
                }
                fill(242 - z * 30, 224 - z * 30, 106 - z * 30);
                noStroke();
                rect(this.x + dx, this.y + dy, szx, szy);
            }
        }
        szx = szx / 1.5 * cos(PI / 2.5);
        for (let dx = szx * 5, cnt = 0; dx < this.w * cos(PI / 2.5) / 1.5 - szx * 5; dx += szx * 5, cnt++) {
            for (let dy = szy; dy < this.h - szy; dy += szy * 2) {
                if (noise(1000 + (this.x0 + dx * 2) * 0.1, (this.y + dy * 2) * 0.1) < 0.5) {
                    continue;
                }
                fill(242 - z * 30, 224 - z * 30, 106 - z * 30);
                noStroke();
                downRightQuad(this.x + this.w + dx, this.y + dy - cnt * 5 * sin(PI / 2.5), 5, 10, PI / 2.5);
            }
        }
    }
}

function draw() {
    capture();
    let t = frameCount % FRAMES / FRAMES;
    back.draw(periodic(t));
    for (let i = 0; i < BUILDINGS; ++i) {
        buildings[i].draw(t);
    }
}