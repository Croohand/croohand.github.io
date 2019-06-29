PVector fit(PVector a) {
  a = new PVector(a.x, a.y);
  if (a.x >= width)
    a.sub(width, 0);
  if (a.y >= height)
    a.sub(0, height);
  if (a.x < 0)
    a.add(width, 0);
  if (a.y < 0)
    a.add(0, height);
  return a;
}

void accurateLine(PVector a, PVector b) {
  for (int dx = -1; dx <= 1; ++dx)
    for (int dy = -1; dy <= 1; ++dy)
      if ((a.x + dx * width >= 0 && a.x + dx * width <= width && a.y + dy * height >= 0 && a.y + dy * height <= height) || 
         (b.x + dx * width >= 0 && b.x + dx * width <= width && b.y + dy * height >= 0 && b.y + dy * height <= height))
        line(a.x + dx * width, a.y + dy * height, b.x + dx * width, b.y + dy * height);
}

class Triangle {
  PVector[] v;
  
  void sort() {
    for (int i = 1; i < 3; ++i)
      for (int j = 0; j < 3 - i; ++j)
      if (v[j].x < v[j + 1].x || v[j].x == v[j + 1].x && v[j].y < v[j + 1].y) {
        PVector t = new PVector(v[j + 1].x, v[j + 1].y);
        v[j + 1] = v[j];
        v[j] = t;
      }
  }
  
  Triangle() {
    v = new PVector[3]; 
    v[0] = new PVector(0, 0);
    v[1] = new PVector(LENGTH, 0);
    v[2] = (new PVector(cos(PI / 3), sin(PI / 3)));
    v[2].mult(LENGTH);
  }
  
  Triangle(PVector v1, PVector v2, PVector v3) {
    v = new PVector[3];
    v[0] = new PVector(v1.x, v1.y);
    v[1] = new PVector(v2.x, v2.y);
    v[2] = new PVector(v3.x, v3.y);
  }
  
  void display(PVector position) {
    for (int j1 = 0; j1 < 3; ++j1)
      for (int j2 = 0; j2 < 3; ++j2) {
        PVector v1 = new PVector(v[j1].x, v[j1].y);
        v1.add(position);
        PVector v2 = new PVector(v[j2].x, v[j2].y);
        v2.add(position);
        accurateLine(v1, v2);
      }
  }
};