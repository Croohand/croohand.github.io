class Spawn {
  PVector pos;
  
  Spawn(PVector pos) {
    this.pos = new PVector(pos.x, pos.y);
  }
  
  void show(float hue) {
    fill(hue, 255, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 2, 2);
  }
}