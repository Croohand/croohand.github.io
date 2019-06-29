final float LENGTH = 20;
final float SEARCH_RANGE = 3;
ArrayList<Figure> figures;

void setup() {
  size(600, 600);
  figures = new ArrayList<Figure>();
  for (int i = 0; i < 50; ++i)
    figures.add(new Figure(new PVector(random(0, width), random(0, height))));
}

void tryMatch() {
  for (int i = 0; i < figures.size(); ++i)
    for (int j = i + 1; j < figures.size(); ++j)
      if (figures.get(i).match(figures.get(j))) {
        if (figures.get(i).dead)
          figures.remove(i);
        else
          figures.remove(j);
        return;
      }
        
}

void update() {
  for (Figure fig : figures)
    fig.update();
}

void draw() {
  background(0);
  update();
  tryMatch();
  for (Figure fig : figures) 
    fig.display();
}