ArrayList<SpawnCluster> spawnClusters = new ArrayList<SpawnCluster>();
boolean pressed = false;
float timeDelta;
float prevTime;
int mode = 0;
int moveMode = 0;
int centerMode = 0;
float hue = 0;
int showCenterMode = 0;
int showOptsMode = 1;
float particleDelay = 0.025;

void setup() {
  prevTime = millis();
  size(900, 600);
  colorMode(HSB, 256, 256, 256, 100);
}

void draw() {
  timeDelta = .016666667;
  //fill(0, 0, 0, 20);
  //rect(0, 0, width, height);
  background(0);
  hue += timeDelta * 50;
  if (hue >= 256) {
    hue -= 256;
  }
  fill(hue, 255, 255);
  if (showOptsMode == 1) {
    String txt;
    if (mode == 0) {
      txt = "draw: vert";
    } else if (mode == 1) {
      txt = "draw: hor";
    } else if (mode == 2) {
      txt = "draw: diag";
    } else {
      txt = "draw: quad";
    }
    text(txt, 5, 15);
    if (moveMode == 0) {
      txt = "move: out";
    } else if (moveMode == 1) {
      txt = "move: in";
    } else {
      txt = "move: both";
    }
    text(txt, 5, 30);
    if (centerMode == 0) {
      txt = "center: mouse";
    } else {
      txt = "center: screen";
    }
    text(txt, 5, 45);
    if (showCenterMode == 0) {
      txt = "showC: false";
    } else {
      txt = "showC: true";
    }
    text(txt, 5, 60);
    text("delay: " + nf(particleDelay, 1, 3), 5, 75);
  }
  if (showCenterMode == 1) {
    ellipse(width / 2, height / 2, 10, 10);
  }
  for (SpawnCluster cluster : spawnClusters) {
      cluster.update();
      cluster.show();
  }
}

void mousePressed() {
  if (!pressed) {
    pressed = true;
    spawnClusters.add(new SpawnCluster(mode));
  }
}

void mouseDragged() {
  if (pressed) {
    if (new PVector(pmouseX, pmouseY).dist(spawnClusters.get(spawnClusters.size() - 1).getLastPos()) > 5) {
      spawnClusters.get(spawnClusters.size() - 1).addSpawn();
    }
  }
}

void mouseReleased() {
  if (pressed) {
    pressed = false;
    spawnClusters.get(spawnClusters.size() - 1).start();
  }
}

void keyPressed() {
  if (key == 'k') {
    spawnClusters.clear();
  }
  if (key == 'q') {
    if (spawnClusters.size() > 0) {
      spawnClusters.remove(spawnClusters.size() - 1);
    }
  }
  if (key == 'z') {
    mode = (mode + 1) % 4;
  }
  if (key == 'x') {
    moveMode = (moveMode + 1) % 3;
  }
  if (key == 'c') {
    centerMode = (centerMode + 1) % 2;
  }
  if (key == 'v') {
    showCenterMode = (showCenterMode + 1) % 2;
  }
  if (key == ' ') {
    showOptsMode = (showOptsMode + 1) % 2;
  }
  if (key == 'a') {
    particleDelay += 0.001;
  }
  if (key == 's') {
    particleDelay -= 0.001;
    if (particleDelay < 0) {
      particleDelay = 0;
    }
  }
  if (key == 'd') {
    particleDelay += 0.005;
  }
  if (key == 'f') {
    particleDelay -= 0.005;
    if (particleDelay < 0) {
      particleDelay = 0;
    }
  }
}
