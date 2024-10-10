import Math;

def Circle(radius) {
    return PI * radius * radius;
}

class Point {
    let x, y;

    def constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    def showPoints() {
        write(this.x, this.y);
    }
}