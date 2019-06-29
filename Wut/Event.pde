class Event {
  float time;
  PVector change;
  Event(float time, PVector change) {
    this.time = time;
    this.change = new PVector(change.x, change.y);
  }
  Event copy() {
    return new Event(time, change);
  }
}
