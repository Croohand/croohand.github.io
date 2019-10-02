class Particle {
  PVector pos;
  PVector vel;
  float radius;
  float speed;
  float ttl;
  float maxttl;
  float delay;
  
  Particle(PVector pos, PVector vel, float ttl, float delay) {
    this.pos = new PVector(pos.x, pos.y);
    this.vel = new PVector(vel.x, vel.y);
    this.radius = 2;
    this.speed = this.vel.mag();
    this.ttl = ttl;
    this.maxttl = ttl;
    this.delay = delay;
  }
  
  void show(float hue) {
    fill(hue, 255, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
  }
  
  void update() {
    if (this.delay > 0) {
      this.delay -= timeDelta;
      return;
    }
    this.pos.add(PVector.mult(this.vel, timeDelta * this.speed * 1000));
    //this.radius += timeDelta * 5 * this.speed;
    this.ttl -= timeDelta;
    if (this.ttl < 1e-6) {
        this.ttl += maxttl;
        this.speed *= -1;
    }
  }
}
