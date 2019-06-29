class Thing {
  float hu, r;
  float allTime;
  float curTime;
  PVector pos;
  PVector ppos;
  PVector velocity, acc;
  boolean active;
  float speed;
  ArrayList<Event> events;
  int cur;
  Thing() {
    cur = -1;
    active = true;
    hu = random(0, 255);
    r = 5;
    curTime = 0;
    speed = 40;
    pos = new PVector(start.x, start.y);
    ppos = new PVector(pos.x, pos.y);
    velocity = PVector.sub(end, start);
    velocity.normalize();
    velocity.mult(speed);
    acc = new PVector(0, 0);
    allTime = PVector.sub(end, start).mag() / speed;

    events = new ArrayList<Event>();
    int k = int(random(30, 50));
    for (int i = 0; i < k; ++i) {
      float l = random(0, allTime);
      float r = random(0, allTime);
      if (l > r) {
        float t = l;
        l = r;
        r = t;
      }
      PVector c = PVector.random2D();
      c.setMag(int(speed / random(2, 4)));
      float l1 = l + (r - l) / 4f;
      float r1 = r - (r - l) / 4f;
      events.add(new Event(l, c));
      events.add(new Event(l1, PVector.mult(c, -2)));
      events.add(new Event(r1, PVector.mult(c, 2)));
      events.add(new Event(r, PVector.mult(c, -1)));
      //events.add(new Event(l, c));
      //events.add(new Event(r, c));
      //events.add(new Event((l + r) / 2, PVector.mult(c, -2)));
    }
  }
  void update() {
    if (curTime == 0) {
      curTime = 0.00001;
      return;
    }
    ppos = new PVector(pos.x, pos.y);
    curTime += deltaTime;
    while (events.size() > 0) {
      if (cur == -1) {
        for (int i = 0; i < events.size(); ++i) {
          if (cur == -1 || events.get(i).time < events.get(cur).time) {
            cur = i;
          }
        }
      }
      if (curTime < events.get(cur).time) {
        break;
      }
      acc.add(events.get(cur).change);
      float delta = deltaTime - (curTime - events.get(cur).time);
      velocity.add(PVector.mult(events.get(cur).change, -delta));
      pos.add(PVector.mult(events.get(cur).change, -delta * delta / 2));
      events.remove(cur);
      cur = -1;
    }
    velocity.add(PVector.mult(acc, deltaTime));
    if (curTime >= allTime)
      active = false;
    pos.add(PVector.mult(velocity, deltaTime));
    if (pos.x < 0) {
      pos.x += width;
      ppos.x += width;
    }
    if (pos.x >= width) {
      pos.x -= width;
      ppos.x -= width;
    }
    if (pos.y < 0) {
      pos.y += height;
      ppos.y += height;
    }
    if (pos.y >= height) {
      pos.y -= height;
      ppos.y -= height;
    }
  }
  void show() {
    stroke(hu, 255, 255);
    strokeWeight(2);
    line(ppos.x, ppos.y, pos.x, pos.y);
  }
}
