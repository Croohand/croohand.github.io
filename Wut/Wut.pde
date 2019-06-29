float deltaTime;
PVector start, end;
ArrayList<Thing> things;
int fCount = 0;

void setup() {
  size(650, 650);
  start = new PVector(width / 10, height / 10);
  end = new PVector(width - width / 10, height - height / 10);
  things = new ArrayList<Thing>();
  colorMode(HSB, 256, 256, 256);
}

void draw() {
  if (fCount == 0 && random(4) < 1.5) {
    int k = int(random(51));
    start = new PVector(random(0, width), random(0, height));
    end = new PVector(random(0, width), random(0, height));
    for (int i = 0; i < k; ++i)
      things.add(new Thing());
  }
  fCount++;
  if (fCount == 50) {
    fCount = 0;
  }
  colorMode(RGB);
  rectMode(CORNER);
  fill(0, 0, 0, 15);
  noStroke();
  rect(0, 0, width, height);

  colorMode(HSB, 256, 256, 255, 100);
  deltaTime = 0.02f;
  for (Thing t : things) {
    t.update();
    t.show();
  }
  for (int i = things.size() - 1; i >= 0; --i)
    if (things.get(i).active == false)
      things.remove(i);
}


void keyReleased() {
  if (key == 'q') {
    start = new PVector(random(0, width), random(0, height));
    end = new PVector(random(0, width), random(0, height));
    for (int i = 0; i < 100; ++i)
      things.add(new Thing());
  }
}
