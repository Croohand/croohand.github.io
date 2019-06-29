float gravity;
ArrayList<Firework> fireworks = new ArrayList<Firework>();
PImage img;

void setup() {
  gravity = 0.15;
  size(600, 600);
  background(0);
}

void draw() {
  colorMode(RGB);
  noStroke();
  fill(0, 0, 0, 50);
  rectMode(CORNERS);
  rect(0, 0, width, height);
  colorMode(HSB, 256, 256, 256);
  for (Firework firework : fireworks) {
    firework.update();
    firework.show();
  }
  for (int i = fireworks.size() - 1; i >= 0; --i)
    if (!fireworks.get(i).active)
     fireworks.remove(i);
  if (random(10) <= 1) {
      fireworks.add(new Firework(random(width - 60) + 30, 50 + random(height * 2 / 3 - 50)));
  }
}

void mousePressed() {
  fireworks.add(new Firework(pmouseX, pmouseY));
}