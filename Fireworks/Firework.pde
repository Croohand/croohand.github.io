class Firework {
  PVector velocity, position, prev;
  ArrayList<Particle> particles;
  float hu, r, centerx, centery;
  boolean exploded;
  boolean active;
  Firework(float centerx, float centery) {
    particles = new ArrayList<Particle>();
    hu = random(0, 255);
    exploded = false;
    r = 9;
    active = true;
    position = new PVector(centerx, height);
    prev = new PVector(position.x, position.y);
    float t = sqrt(2 * (height - centery) / gravity);
    float v0 = -gravity * t;
    velocity = new PVector(0, v0);
  }
  void update() {
    if (exploded == false) {
      velocity.add(new PVector(0, gravity));
      prev = new PVector(position.x, position.y);
      position.add(velocity);
      if (velocity.y > 0) {
        exploded = true;
        int k = int(random(70, 150));
        for (int i = 0; i < k; ++i)
          particles.add(new Particle(position, hu));
      }
    }
    for (Particle cur : particles) {
      cur.update();
    }
    for (int i = particles.size() - 1; i >= 0; --i)
      if (particles.get(i).active == false)
        particles.remove(i);
    if (particles.size() == 0 && exploded)
      active = false;
  }
  void show() {
    if (!exploded) {
      stroke(hu, 255, 255);
      strokeWeight(r);
      line(prev.x, prev.y, position.x, position.y);
    }
    for (Particle cur : particles)
      cur.show();
  }
}
