/* @pjs preload="sketch_170517a/data/tp.jpg,sketch_170517a/data/drob.png"; */
int catsNumber = 40;

PImage timg;
PImage img;
PImage star;
ArrayList<Star> stars = new ArrayList<Star>();
float deltaTime, lastTime;
ArrayList<Integer> heights;

Star createStar(int mode, int delay, int h) {
  float x;
  float y = h;
  float angv, anga;
  anga = 0;
  if (mode == 0) {
    x = -50;
    angv = 0;
  } else {
    x = width + 50;
    angv = PI;
  }
  return new Star(new PVector(x, y), angv, anga, delay, 400); 
}

void setup() {
  size(900, 600);
  lastTime = millis();
  timg = loadImage("sketch_170517a/data/tp.jpg");
  timg.resize(width, height);
  star = loadImage("sketch_170517a/data/drob.png");
  star.resize(60, 80);
  img = createImage(width, height, RGB);
  for (int i = 0; i < width; ++i)
    for (int j = 0; j < height; ++j)
      img.set(i, j, color(40));
  int delay = 0;
  //float add = 50;
  float add = 100;
  heights = new ArrayList<Integer>();
  for (int i = 0; i < catsNumber; ++i) 
    heights.add(int(Star.wd + (height - Star.wd - Star.wd) / (catsNumber - 1) * i));
  for (int i = 0; i < heights.size(); ++i) {
    int x = int(random(heights.size()));
    int y = int(random(heights.size()));
    int z = heights.get(x);
    heights.set(x, heights.get(y));
    heights.set(y, z);
  }
  for (int i = 0; i < catsNumber; ++i) {
    delay += int(add);
    int mode = round(random(0, 1));
    stars.add(createStar(mode, delay, heights.get(i)));
    //add *= 0.95;
    add *= 0.98;
    add = max(add, 7);
    //add = max(add, 3);
  }
}

void draw() {
  deltaTime = (millis() - lastTime) / 1000f;
  lastTime = millis();
  deltaTime = 0.01666666666666666666666666666667;
  background(40);
  imageMode(CORNER);
  image(img, 0, 0);
  for (Star star : stars)
    star.update();
  for (int i = stars.size() - 1; i >= 0; --i)
    if (stars.get(i).lifetime == 0) 
      stars.remove(i);
}