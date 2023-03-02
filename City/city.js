const BUILDINGS = 45;
var buildings = [];
var back = null;

var generationX = -100;

function setup() {
    createCanvas(800, 512);
    pixelDensity(1);

    back = new Background();

    for (let i = 0; i < BUILDINGS; ++i) {
        buildings.push(new Building(random()));
    }

    let cnt = 0;
    generationX = -width;
    for (let building of buildings) {
        if (building.z < 0.5) {
            cnt += 1;
        }
    }
    let newbuilds = [];
    for (let building of buildings) {
        if (building.z < 0.5) {
            if (building.resetX(cnt)) {
                newbuilds.push(building);
            }
        }
    }
    cnt = 0;
    generationX = -width;
    for (let building of buildings) {
        if (building.z < 0.8 && building.z >= 0.5) {
            cnt += 1;
        }
    }
    for (let building of buildings) {
        if (building.z < 0.8 && building.z >= 0.5) {
            if (building.resetX(cnt)) {
                newbuilds.push(building);
            }
        }
    }
    cnt = 0;
    generationX = -width;
    for (let building of buildings) {
        if (building.z >= 0.8) {
            cnt += 1;
        }
    }
    for (let building of buildings) {
        if (building.z >= 0.8) {
            if (building.resetX(cnt)) {
                newbuilds.push(building);
            }
        }
    }
    buildings = newbuilds.sort((a, b) => (a.z < b.z) ? 1 : -1);
}

const W = [45, 65, 90, 115];
const H = [150, 220, 285, 360]

function negNoise(x, y = 0) {
    let SCALE = 2;
    return 2 * noise(x * SCALE, y * SCALE) - 1
}

function periodic(t) {
    return map(sin(2 * PI * t - PI / 2), -1, 1, 0, 1);
}

function Background() {
    this.border = height;

    this.draw = function(p) {
        this.coeff = 8;
        this.dots = [];
        for (let i = 0; i < this.border + this.border / this.coeff; i += this.border / this.coeff) {
            let dy = this.border / this.coeff / 2;
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
        let startColor = color(15, 8, 82);
        let endColor = color(220, 80, 68);
        for (let i = 0; i < this.border; i += this.border / this.coeff) {
            noStroke();
            fill(lerpColor(startColor, endColor, i / this.border));
            rectr(0, i, width, this.border / this.coeff);
        }
        for (let i = 0, cnt = 0; i < this.border + this.border / this.coeff; i += this.border / this.coeff, cnt++) {
            strokeWeight(intr(this.border / this.coeff));
            stroke(lerpColor(startColor, endColor, i / this.border));
            noFill();
            beginShape();
            for (let j = 0; j < this.dots[cnt].length; ++j) {
                curveVertex(intr(this.dots[cnt][j][0]), intr(this.dots[cnt][j][1]));
            }
            endShape();
        }
    }
}

function intr(x) {
    return int(round(x) + 0.1);
}

function quadr(x1, y1, x2, y2, x3, y3, x4, y4) {
    quad(intr(x1), intr(y1), intr(x2), intr(y2), intr(x3), intr(y3), intr(x4), intr(y4));
}

function rectr(x1, y1, x2, y2) {
    rect(intr(x1), intr(y1), intr(x2), intr(y2));
}

function ellipser(x1, y1, x2, y2) {
    ellipse(intr(x1), intr(y1), intr(x2), intr(y2));
}

function upRightQuad(x, y, w, h, angle) {
    let x1 = x + cos(angle) * h;
    let y1 = y - sin(angle) * h / 3.33333333;
    quadr(x, y, x1, y1, x1 + w, y1, x + w, y);
}

function downRightQuad(x, y, w, h, angle) {
    let x1 = x + cos(angle) * w;
    let y1 = y - sin(angle) * w / 3.33333333;
    quadr(x, y, x1, y1, x1, y1 + h, x, y1 + h);
}

function drawLights(x, y, w, h, angle) {
    let x1 = x + cos(angle) * h;
    let y1 = y - sin(angle) * h / 3.33333333;
    fill(230, 50, 50);
    ellipseMode(CENTER);
    ellipser(x + 1, y, 4, 4);
    ellipser(x + w - 1, y, 4, 4);
    ellipser(x1 + 1, y1, 4, 4);
    ellipser(x1 + w - 1, y1, 4, 4);
}

function Building(z) {
    this.z = z;
    this.t = int(random(3));
    this.w = W[this.t] * (1 - pow(this.z * 0.75, 2)) * 1.5;
    this.h = H[this.t] * (1 - pow(this.z * 0.4, 2)) * 2;
    this.x = generationX;
    generationX += (3 * width) / BUILDINGS * random(1, 3);
    if (generationX >= 2 * width) {
        generationX -= 3 * width;
    }
    if (this.x >= 2 * width) {
        this.x -= 3 * width;
    }
    this.x0 = this.x;
    this.y = height - this.h / 2 - this.z * height / 5;

    this.draw = function(t) {
        let spd = t * 3;
        if (this.z > 0.5) {
            spd = t * 2;
        }
        if (this.z > 0.8) {
            spd = t;
        }
        this.x = this.x0 - spd * width * 3;
        while (this.x < -width) {
            this.x += 3 * width;
        }
        rectMode(CORNER);
        noStroke();
        fill(lerpColor(color(0), color(30), this.z));
        rectr(this.x, this.y, this.w, this.h);
        upRightQuad(this.x, this.y + 1, this.w, this.w / 1.5, PI / 2.5);
        downRightQuad(this.x + this.w - 1, this.y, this.w / 1.5, this.h, PI / 2.5);
        drawLights(this.x, this.y, this.w, this.w / 1.5, PI / 2.5);
        let szx = 5;
        let szy = 10;
        if (this.z > 0.5) {
            szx = 4;
            szy = 8;
        }
        if (this.z > 0.8) {
            szx = 3;
            szy = 5;
        }
        for (let dx = szx * 2; dx < this.w - szx * 2; dx += szx * 2) {
            for (let dy = szy * 2; dy < this.h - szy * 2; dy += szy * 2) {
                if (noise((this.x0 + dx) * 0.1, (this.y + dy) * 0.1) < 0.5) {
                    continue;
                }
                fill(242 - this.z * 30, 224 - this.z * 30, 106 - this.z * 30);
                noStroke();
                rectr(this.x + dx, this.y + dy, szx, szy);
            }
        }
        let nszx = szx / 1.5 * cos(PI / 2.5);
        for (let dx = nszx * 5, cnt = 0; dx < this.w * cos(PI / 2.5) / 1.5 - nszx * 5; dx += nszx * 5, cnt++) {
            for (let dy = szy; dy < this.h - szy; dy += szy * 2) {
                if (noise(1000 + (this.x0 + dx * 2) * 0.1, (this.y + dy * 2) * 0.1) < 0.5) {
                    continue;
                }
                fill(242 - this.z * 30, 224 - this.z * 30, 106 - this.z * 30);
                noStroke();
                // downRightQuad(this.x + this.w + dx, this.y + dy - cnt * 5 * sin(PI / 2.5), szx, szy, PI / 2.5);
            }
        }
    }

    this.resetX = function(count) {
        generationX += (3 * width) / count * random(1, 1.8);
        if (generationX >= 2 * width) {
            return false;
        }
        this.x = generationX;
        this.x0 = this.x;
        return true;
    }
}

function draw() {
    capture();
    let t = frameCount % FRAMES / FRAMES;
    back.draw(periodic(t));
    for (let i = 0; i < buildings.length; ++i) {
        buildings[i].draw(t);
    }
}