const ENT_SIZE = 8;
const ENT_DISTANCE_STEP = ENT_SIZE * 1.5;

const ENT_HUE_CHANGE_RATE = 10;

const ENT_FORMATION_ROTATION_SPEED = 3;

const ENT_NEEDED_TIME_LOW = 2;
const ENT_NEEDED_TIME_UP = 10;

const ENT_EVENT_HUNGER = 15;

const ENT_MAX_EVENTS_SIM = 3;


function Ent(pos) {
  this.pos = pos.copy();
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);

  this.parent = null;
  this.neededHue = null;
  this.childs = [];
  this.futureChilds = [];
  this.merging = false;
  this.currentFormation = null;

  this.events = [];
  this.currentTime = 0;
  this.currentEvent = 0;

  this.hue = random(100);

  this.update = function() {
    this.updateHue();

    if (this.parent) {
      return;
    }

    let t = deltaTime;
    this.currentTime += t;

    while (this.currentEvent < this.events.length &&
           this.events[this.currentEvent].time <= this.currentTime) {
      let delta = deltaTime - (this.currentTime - this.events[this.currentEvent].time);
      this.vel.add(p5.Vector.mult(this.events[this.currentEvent].change, -delta));
      this.pos.add(p5.Vector.mult(this.events[this.currentEvent].change, -delta * delta / 2));

      this.acc.add(this.events[this.currentEvent].change);
      this.currentEvent++;
    }

    this.pos.add(p5.Vector.mult(this.vel, t));
    this.pos.add(p5.Vector.mult(this.acc, t * t / 2));
    this.vel.add(p5.Vector.mult(this.acc, t));
    this.fit();

    for (let i = 0; i < this.childs.length; ++i) {
      this.childs[i].pos = p5.Vector.add(this.pos, this.currentFormation.getPos(i));
      this.childs[i].fit();
      if (this.currentFormation.getHue) {
        let needed = this.hue + this.currentFormation.getHue(i);
        needed = fit(needed, 0, 100);
        this.childs[i].neededHue = needed;
      }
    }

    if (this.childs.length && this.currentFormation) {
      this.currentFormation.update(this.hunger);
    }

    if (!this.merging) {
      if (this.currentEvent === this.events.length) {
        this.setEndpoint(
          this.genEndpoint(),
          random(ENT_NEEDED_TIME_LOW, ENT_NEEDED_TIME_UP));
      }
      this.hunger -= t;
    }

    if (this.futureChilds.length) {
      let ready = true;
      for (let i = 0; i < this.futureChilds.length; ++i) {
        if (this.futureChilds[i].currentEvent !== this.futureChilds[i].events.length) {
          ready = false;
          break;
        }
      }

      if (ready) {
        this.childs = this.futureChilds;
        this.futureChilds = [];
        this.merging = false;
        for (let i = 0; i < this.childs.length; ++i) {
          this.childs[i].parent = this;
          this.childs[i].merging = false;
        }
      }
    }

    if (this.hunger <= 0) {
      this.resetHunger(random(1.5, 3));
      if (this.childs.length) {
        this.freeChildren();
      } else if (!this.tryFindChildren()) {
        this.resetHunger();
      }
    }
  }

  this.updateHue = function() {
    if (this.neededHue) {
      let d = min(abs(this.hue - this.neededHue), 100 - abs(this.hue - this.neededHue));
      if (d < deltaTime * ENT_HUE_CHANGE_RATE * 3) {
        this.hue = this.neededHue;
        return;
      }
      this.hue -= deltaTime * ENT_HUE_CHANGE_RATE;
    } else {
      this.hue += random(0, 1) * deltaTime * ENT_HUE_CHANGE_RATE;
    }
    this.hue = fit(this.hue, 0, 100);
  }

  this.freeChildren = function() {
    for (let i = 0; i < this.childs.length; ++i) {
      this.childs[i].parent = null;
      this.childs[i].neededHue = null;
      this.childs[i].resetHunger(random(1.5, 3));
    }
    this.childs = [];
  }

  this.tryFindChildren = function() {
    this.currentFormation = createRandomFormation();
    if (freeEnts <= this.currentFormation.getLimit()) {
      this.currentFormation = null;
      return false;
    }

    this.merging = true;

    let neededTime = random(ENT_NEEDED_TIME_LOW, ENT_NEEDED_TIME_UP);
    let end = this.genEndpoint();
    this.setEndpoint(end, neededTime);
    for (let i = 0; i < ents.length; ++i) {
      if (ents[i].isBusy()) {
        continue;
      }

      ents[i].merging = true;
      ents[i].setEndpoint(
        p5.Vector.add(
          end,
          this.currentFormation.getPos(this.futureChilds.length)
        ),
        neededTime
      );

      this.futureChilds.push(ents[i]);

      if (this.futureChilds.length === this.currentFormation.getLimit()) {
        break;
      }
    }
    return true;
  }

  this.init = function() {
    this.resetHunger();
  }

  this.resetHunger = function(coeff = 1) {
    this.hunger = coeff * random(ENT_EVENT_HUNGER / 2, ENT_EVENT_HUNGER);
  }

  this.show = function() {
    if (this.currentFormation && this.currentFormation.hideHost) {
      return;
    }

    stroke(this.hue, 90, 90);
    strokeWeight(ENT_SIZE);
    point(this.pos.x, this.pos.y);
  }

  this.fit = function() {
    this.pos.x = fit(this.pos.x, 0, width);
    this.pos.y = fit(this.pos.y, 0, height);
  }

  this.stopMoving = function() {
    this.events = [];
    this.currentTime = 0;
    this.currentEvent = 0;
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, 0);
  }

  this.setEndpoint = function(to, neededTime) {
    this.stopMoving();

    let eventCount = int(random(20));
    for (let i = 0; i < eventCount; ++i) {
      let l = neededTime / eventCount * i;
      let r = min(
        neededTime,
        l + neededTime / eventCount * ENT_MAX_EVENTS_SIM
      );
      if (l > r) {
        l = [r, r = l][0];
      }
      let l1 = l + (r - l) / 4;
      let r1 = r - (r - l) / 4;
      let speed = random(100, 600);
      let dir = to.copy().sub(this.pos).heading();
      let angle = random(dir - 4/7 * PI, dir - 3/7 * PI);
      if (random(1) < 0.5) {
        angle += PI;
      }
      let change = new p5.Vector(cos(angle), sin(angle)).mult(speed);
      this.events.push({
        time: l,
        change: change
      });
      this.events.push({
        time: l1,
        change: p5.Vector.mult(change, -2)
      });
      this.events.push({
        time: r1,
        change: p5.Vector.mult(change, 2)
      });
      this.events.push({
        time: r,
        change: p5.Vector.mult(change, -1)
      });
    }

    let change = to.copy().sub(this.pos);
    change.setMag(change.mag() * 4 / pow(neededTime, 2));
    this.events.push({
      time: 0,
      change: change.copy()
    });
    this.events.push({
      time: neededTime / 2,
      change: p5.Vector.mult(change, -2)
    });
    this.events.push({
      time: neededTime,
      change: change.copy()
    });

    this.events.sort((a, b) => a.time - b.time);
  }

  this.genEndpoint = function() {
    while (true) {
      let to = new p5.Vector(random(width), random(height));
      if (this.pos.dist(to) < min(height, width) / 2) {
        continue;
      }
      return to;
    }
  }

  this.isBusy = function() {
    return this.parent || this.childs.length || this.merging;
  }
}

function createRandomFormation() {
  let types = [0, 1, 3, 4];
  let type = types[int(frameCount / 180) % types.length];

  function createFormation(type) {
    switch (type) {
      case 0:
        return {
          type: 'circle',
          multiplier: int(random(3, 5)),
          layersLimit: int(random(3, 5)),

          getPos(index) {
            let curNumber = this.multiplier;
            let curDist = ENT_DISTANCE_STEP;
            while (index >= curNumber) {
              index -= curNumber;
              curNumber *= this.multiplier;
              curDist += ENT_DISTANCE_STEP;
            }

            let angle = this.startAngle + 2 * PI * index / curNumber;
            return new p5.Vector(cos(angle), sin(angle)).mult(curDist);
          },

          getLimit() {
            let cur = 0;
            let add = 1;
            for (let i = 0; i < this.layersLimit; ++i) {
              add *= this.multiplier;
              cur += add;
            }
            return cur;
          }
        };

      case 1:
        return {
          type: 'star',
          tails: int(random(3, 10)),
          layersLimit: int(random(6, 12)),

          getPos(index) {
            let curDist = ENT_DISTANCE_STEP * (1 + int(index / this.tails));
            index %= this.tails;

            let angle = this.startAngle + 2 * PI * index / this.tails;
            return new p5.Vector(cos(angle), sin(angle)).mult(curDist);
          },

          getLimit() {
            return this.tails * this.layersLimit;
          }
        };

      case 2:
        return {
          type: 'circle2',
          distInEnts: int(random(5, 15)),

          getPos(index) {
            let curDist = this.distInEnts * ENT_SIZE;

            let angle = this.startAngle + 2 * PI * index / this.getLimit();
            return new p5.Vector(cos(angle), sin(angle)).mult(curDist);
          },

          getHue(index) {
            return (index + 1) + 50 * (index % 2);
          },

          getLimit() {
            let l = 2 * PI * this.distInEnts * ENT_SIZE;
            return int(l / ENT_DISTANCE_STEP / 4);
          }
        };

      case 3:
        return {
          type: 'perpstar',
          tails: int(random(3, 10)),
          layersLimit: int(random(6, 12)),
          coeff: random(10, 30),

          getPos(index) {
            let curDist = ENT_DISTANCE_STEP * (1 + int(index / this.tails));
            index %= this.tails;

            let angle = this.startAngle + 2 * PI * index / this.tails;

            let offsetLen = this.coeff * sqrt(this.tails);
            let offset = new p5.Vector(
              cos(angle + PI/2),
              sin(angle + PI/2)
            ).mult(offsetLen);

            return new p5.Vector(cos(angle), sin(angle)).mult(curDist).add(offset);
          },

          getLimit() {
            return this.tails * this.layersLimit;
          }
        };

      case 4:
        return {
          type: 'sinstar',
          tails: int(random(3, 10)),
          layersLimit: int(random(6, 12)),
          coeff: random(20, 40),
          distortionCoeff: random(0.6, 1.1),

          getPos(index) {
            let layer = (1 + int(index / this.tails));
            let curDist = ENT_DISTANCE_STEP * layer;
            index %= this.tails;

            let angle = this.startAngle + 2 * PI * index / this.tails;

            let offsetLen = this.coeff / sqrt(this.tails);
            let offset = new p5.Vector(
              0,
              sin(layer) * this.distortionCoeff
            ).rotate(angle).mult(offsetLen);

            return new p5.Vector(cos(angle), sin(angle)).mult(curDist).add(offset);
          },

          getLimit() {
            return this.tails * this.layersLimit;
          }
        };
    }
  }

  let formation = createFormation(type);
  formation.startAngle = random(2 * PI);
  formation.rotationSpeedLimit = random(
    -ENT_FORMATION_ROTATION_SPEED,
    ENT_FORMATION_ROTATION_SPEED
  );

  formation.rotationSpeed = 0;
  formation.timeToFullRotationSpeed = random(4, 7);
  formation.update = function(hunger) {
    this.startAngle += deltaTime * this.rotationSpeed;
    let dir = (hunger <= this.timeToFullRotationSpeed ? -1 : 1);
    this.rotationSpeed += dir * deltaTime * this.rotationSpeedLimit / this.timeToFullRotationSpeed;
    this.rotationSpeed = min(this.rotationSpeed, this.rotationSpeedLimit);
  }

  if (!formation.getHue) {
    formation.getHue = index => (index + 1) * 1.4;
  }

  while (type === 4 && formation.tails === 4) {
    formation.tails = int(random(3, 10));
  }

  return formation;
}

