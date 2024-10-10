import Math;

def Circle(radius) {
    return Math.PI * radius * radius;
}

class Point {
    let x, y;

    def constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    def ShowPoints() {
        write(this.x, this.y);
    }
}

class Point3D extends Point {
    let z;

    def constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    def ShowPoints() {
        write(this.x, this.y, this.z);
    }
}