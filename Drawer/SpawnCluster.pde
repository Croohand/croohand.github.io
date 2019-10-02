class SpawnCluster {
  float centerx;
  float centery;
  float hue;
  ArrayList<Spawn> spawns;
  ArrayList<Particle> particles;
  float delay;
  int mode;
  boolean started = false;

  SpawnCluster(int mode) {
    this.centerx = pmouseX;
    this.centery = pmouseY;
    if (centerMode == 1) {
      this.centerx = width / 2.0;
      this.centery = height / 2.0;
    }
    this.hue = int(random(256));
    spawns = new ArrayList<Spawn>();
    particles = new ArrayList<Particle>();
    this.mode = mode;
    this.delay = 10000000;
  }

  void addSpawn() {
    float px = pmouseX;
    float py = pmouseY;
    spawns.add(new Spawn(new PVector(px, py)));
    if (mode == 0 || mode == 3) {
      spawns.add(new Spawn(new PVector(2 * centerx - px, py)));
    }
    if (mode == 1 || mode == 3) {
      spawns.add(new Spawn(new PVector(px, 2 * centery - py)));
    }
    if (mode == 2 || mode == 3) {
      spawns.add(new Spawn(new PVector(2 * centerx - px, 2 * centery - py)));
    }
  }

  void update() {
    this.hue += timeDelta * 32;
    if (this.hue >= 256) {
      this.hue -= 256;
    }
    for (Particle particle : this.particles) {
      particle.update();
    }
    this.delay -= timeDelta;
    if (this.delay < 0 && this.particles.size() == 0) {
      float curDelay = 0;
      for (Spawn spawn : this.spawns) {
        float angle = atan2(spawn.pos.y - centery, spawn.pos.x - centerx) + (random(2) - 1) / (2 * PI);
        angle += PI * moveMode;
        PVector vel = new PVector(cos(angle), sin(angle));
        vel.setMag(this.calcSpeed());
        particles.add(new Particle(spawn.pos, vel, this.calcTtl(), curDelay));
        if (moveMode == 2) {
          angle += PI;
          vel = new PVector(cos(angle), sin(angle));
          vel.setMag(this.calcSpeed());
          particles.add(new Particle(spawn.pos, vel, this.calcTtl(), curDelay));
        }
        curDelay += particleDelay;
      }
      spawns.clear();
    }
  }

  void show() {
    for (Spawn spawn : this.spawns) {
      if (!this.started) {
        spawn.show(this.hue);
      }
    }
    for (Particle particle : this.particles) {
      particle.show(this.hue);
    }
  }

  float calcSpeed() {
    return 1 / pow(this.spawns.size(), 0.25);
  }

  float calcTtl() {
    float neededTtl = 1 / this.calcSpeed() / 8;
    float res = 4;
    while (res > neededTtl) {
        res /= 2f;
    }
    return res;
  }

  PVector getLastPos() {
    if (spawns.size() < 4) {
      return new PVector(-100, -100);
    }
    return spawns.get(spawns.size() - 4).pos;
  }

  void start() {
    float miny = 1000000;
    float maxy = 0;
    float minx = 1000000;
    float maxx = 0;
    for (Spawn spawn : this.spawns) {
      maxy = max(maxy, spawn.pos.y);
      miny = min(miny, spawn.pos.y);
      maxx = max(maxx, spawn.pos.x);
      minx = min(minx, spawn.pos.x);
    }
    this.centery = (miny + maxy) / 2.0;
    this.centerx = (minx + maxx) / 2.0;

    this.delay = 0;
    started = true;
  }
}
