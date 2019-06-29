class Particle {
  float hu, r, lifetime;
  PVector position, velocity;
  boolean active;
  Particle(PVector position, float hu) {
    this.position = new PVector(position.x, position.y);
    this.hu = hu;
    lifetime = int(random(35, 80));
    active = true;
    r = 2;
    velocity = PVector.random2D();
    velocity.setMag(random(0.4, 1.5));
  }
  void update() {
    lifetime -= 1;
    if (lifetime == 0)
      active = false;
    velocity.add(new PVector(0, 0.1 * gravity));
    position.add(velocity);
  }
  void show() {
    fill(hu, 255, 255);
    noStroke();
    ellipse(position.x, position.y, r, r);
  }
};
