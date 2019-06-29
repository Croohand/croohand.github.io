class Star {
  PVector pos, prev, vel, acc;
  int lifetime;
  int start;
  int type;
  float angle;
  float rotationSpeed;
  static final float wd = 20f;
  Star(PVector pos, float ang_vel, float ang_acc, int start, int lifetime) {
    this.pos = pos;
    this.vel = new PVector(cos(ang_vel), sin(ang_vel));
    this.acc = new PVector(cos(ang_acc), sin(ang_acc));
    this.prev = new PVector(this.pos.x, this.pos.y);
    this.start = start;
    this.lifetime = lifetime;
    this.vel.mult(random(2.5, 4.5));
    angle = random(0, PI * 2);
    rotationSpeed = random(0.005f, 0.02f);
    if (random(0, 1) > 0.5)
      rotationSpeed *= -1;
    //this.acc.mult(this.vel.mag() / 40);
    this.acc = new PVector(0, 0);
    this.type = round(random(0, 1));
  }
  void update() {
    if (lifetime == 0 || frameCount < start)
      return;   
    vel.add(acc);
    pos.add(vel);  
    addTrail();
    pushMatrix();
    translate(pos.x, pos.y);
    //float angle = atan2(pos.y - prev.y, pos.x - prev.x);
    imageMode(CENTER);
    rotate(angle);
    image(star, 0, 0);
    popMatrix();
    angle += rotationSpeed;
    if (angle > 2 * PI)
      angle -= 2 * PI;
    prev = new PVector(pos.x, pos.y);
    lifetime -= 1;
  }
  void addTrail() {
    float x1 = prev.x, y1 = prev.y, x2 = pos.x, y2 = pos.y;
    //float angle = atan2(y2 - y1, x2 - x1);
    if (x1 == x2 && y1 == y2)
      return;
    for (float t1 = -wd; t1 <= wd; t1 += 0.5f)
      for (float t2 = -wd; t2 <= wd; t2 += 0.5f) {
        int x = round(x2 + t1 * cos(angle) + t2 * cos(angle + PI / 2));
        int y = round(y2 + t1 * sin(angle) + t2 * sin(angle + PI / 2));
        if (x >= 0 && y >= 0 && x < img.width && y < img.height)
          img.set(x, y, timg.get(x, y));
      }
    //wd -= 0.3f;
  }
};