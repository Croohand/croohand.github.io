float sqdist(float x, float y) {
  return x * x + y * y;
}

class Figure {
  PVector position;
  PVector velocity;
  ArrayList<Triangle> badTriangles;
  ArrayList<Triangle> triangles;
  float rotationSpeed;
  float speed;
  boolean dead;
  
  Figure(PVector pos) {
    dead = false;
    position = pos;
    triangles = new ArrayList<Triangle>();
    badTriangles = new ArrayList<Triangle>();
    Triangle t = new Triangle(); 
    triangles.add(t);
    float head = random(0, 2 * PI);
    velocity = new PVector(cos(head), sin(head));
    rotationSpeed = random(0.05, 0.2) * (1 - 2 * round(random(1)));
    speed = random(1.3, 3.5);
  }
  
  void rotateme(float angle) {
    for (int i = 0; i < triangles.size(); ++i)
      for (int j = 0; j < 3; ++j) {
        triangles.get(i).v[j].rotate(angle);
      }
    for (int i = 0; i < badTriangles.size(); ++i)
      for (int j = 0; j < 3; ++j)
        badTriangles.get(i).v[j].rotate(angle);
  }
  
  void sortTriangles() {
    for (int i = 0; i < triangles.size(); ++i)
      triangles.get(i).sort();
  }
  
  void update() {
    if (random(0, 100 * pow(size(), 0.7)) < 1) {
      float head = random(0, 2 * PI);
      velocity = new PVector(cos(head), sin(head));
    }
    if (random(0, 100 * pow(size(), 0.7)) < 1) {
      rotationSpeed = random(0.05, 0.2) * (1 - 2 * round(random(1)));
    }
    if (random(0, 100 * pow(size(), 0.7)) < 1) {
      speed = random(1.3, 3.5);
    }
    position.add(PVector.mult(velocity, speed / pow(size(), 0.33)));
    position = fit(position);
    recountCenter();
    rotateme(rotationSpeed / pow(size(), 0.6));
  }
  
  void recountCenter() {
    PVector allsum = new PVector(0, 0);
    for (int i = 0; i < triangles.size(); ++i)
      for (int j = 0; j < 3; ++j)
        allsum.add(triangles.get(i).v[j]);
    for (int i = 0; i < badTriangles.size(); ++i)
      for (int j = 0; j < 3; ++j)
        allsum.add(badTriangles.get(i).v[j]);
    allsum.div(size() * 3);
    position.add(allsum);
    for (int i = 0; i < triangles.size(); ++i)
      for (int j = 0; j < 3; ++j)
        triangles.get(i).v[j].sub(allsum);
    for (int i = 0; i < badTriangles.size(); ++i)
      for (int j = 0; j < 3; ++j)
        badTriangles.get(i).v[j].sub(allsum);
  }
  
  void display() {
    stroke(250, 150, 30);
    strokeWeight(2.5);
    for (int i = 0; i < triangles.size(); ++i)
      triangles.get(i).display(position);
    for (int i = 0; i < badTriangles.size(); ++i)
      badTriangles.get(i).display(position);
  }
  
  int size() {
    return triangles.size() + badTriangles.size();
  }
  
  void filterTriangles() {
    Triangle t;
    for (int i = triangles.size() - 1; i >= 0; --i) {
      boolean good = false;
      for (int j1 = 0; j1 < 3; ++j1)
        for (int j2 = j1 + 1; j2 < 3; ++j2) {
          if (good)
            break;
          boolean found = false;
          for (int i1 = 0; i1 < triangles.size(); ++i1) {
            if (i == i1) 
              continue;
            if (found)
              break;
            t = triangles.get(i1);
            for (int j3 = 0; j3 < 3; ++j3)  
              for (int j4 = 0; j4 < 3; ++j4)
                if (j3 != j4 && triangles.get(i).v[j1].dist(t.v[j3]) < 1 && triangles.get(i).v[j2].dist(t.v[j4]) < 1) 
                  found = true;
          }
          for (int i1 = 0; i1 < badTriangles.size(); ++i1) {
            if (found)
              break;
            t = badTriangles.get(i1);
            for (int j3 = 0; j3 < 3; ++j3)  
              for (int j4 = 0; j4 < 3; ++j4)
                if (j3 != j4 && triangles.get(i).v[j1].dist(t.v[j3]) < 1 && triangles.get(i).v[j2].dist(t.v[j4]) < 1) 
                  found = true;
          }
          if (!found) 
            good = true;
        }
      if (!good) {
        badTriangles.add(triangles.get(i));
        triangles.remove(i);
      }
    }
  }
  
  boolean match(Figure other) {
    Figure a, b;
    if (size() < other.size()) {
      a = this; 
      b = other;
    } else {
      a = other;
      b = this;
    }
    a.sortTriangles();
    b.sortTriangles();
    Triangle t1, t2, t3, t4, tc;
    for (int i1 = 0; i1 < a.triangles.size(); ++i1)
      for (int i2 = 0; i2 < b.triangles.size(); ++i2) {
        t1 = a.triangles.get(i1);
        t2 = b.triangles.get(i2);
        for (int j1 = 0; j1 < 3; ++j1)
          for (int j2 = 0; j2 < 3; ++j2) 
            if (sqdist(t1.v[j1].x + a.position.x - t2.v[j2].x - b.position.x,
                       t1.v[j1].y + a.position.y - t2.v[j2].y - b.position.y) < SEARCH_RANGE * SEARCH_RANGE) {
              for (int j3 = 0; j3 < 3; ++j3)
                for (int j4 = 0; j4 < 3; ++j4) 
                  if (j3 != j1 && j4 != j2 && PVector.add(t1.v[j3], a.position).dist(PVector.add(t2.v[j4], b.position)) < SEARCH_RANGE) {
                    float angle = atan2(t2.v[j4].y - t2.v[j2].y, t2.v[j4].x - t2.v[j2].x) - atan2(t1.v[j3].y - t1.v[j1].y, t1.v[j3].x - t1.v[j1].x);
                    PVector delta = PVector.add(t2.v[j2], b.position);
                    PVector tmp = new PVector(t1.v[j1].x, t1.v[j1].y);
                    tmp.rotate(angle);
                    delta.sub(PVector.add(tmp, a.position));
                    tmp = PVector.sub(a.position, b.position);
                    tmp.add(delta);
                    for (int i3 = 0; i3 < a.triangles.size(); ++i3) {
                      t3 = a.triangles.get(i3);
                      PVector v1 = new PVector(t3.v[0].x, t3.v[0].y);
                      v1.rotate(angle);
                      v1.add(tmp);
                      PVector v2 = new PVector(t3.v[1].x, t3.v[1].y);
                      v2.rotate(angle);
                      v2.add(tmp);
                      PVector v3 = new PVector(t3.v[2].x, t3.v[2].y);
                      v3.rotate(angle);
                      v3.add(tmp);
                      tc = new Triangle(v1, v2, v3);
                      tc.sort();
                      for (int i4 = 0; i4 < b.triangles.size(); ++i4) {
                        t4 = b.triangles.get(i4);
                        boolean intersect = true;
                        for (int j = 0; j < 3; ++j) 
                          if (tc.v[j].dist(t4.v[j]) > 1)
                            intersect = false;
                        if (intersect)
                          return false;
                      }
                    }
                    a.rotateme(angle);
                    a.position.add(delta);
                    b.speed = (a.speed * a.size() + b.speed * b.size()) / (a.size() + b.size());
                    b.rotationSpeed = (a.rotationSpeed * a.size() + b.rotationSpeed * b.size()) / (a.size() + b.size());
                    a.velocity.mult(a.size());
                    b.velocity.mult(b.size());
                    b.velocity.add(a.velocity);
                    b.velocity.normalize();
                    for (int i3 = 0; i3 < a.triangles.size(); ++i3) {
                      t3 = a.triangles.get(i3);
                      for (int j = 0; j < 3; ++j)
                        t3.v[j].sub(PVector.sub(b.position, a.position));
                      b.triangles.add(t3);
                    }
                    for (int i3 = 0; i3 < a.badTriangles.size(); ++i3) {
                      t3 = a.badTriangles.get(i3);
                      for (int j = 0; j < 3; ++j)
                        t3.v[j].sub(PVector.sub(b.position, a.position));
                      b.badTriangles.add(t3);
                    }
                    b.filterTriangles();
                    a.dead = true;
                    return true;
                  }
            }
      }
    return false;
  }
};