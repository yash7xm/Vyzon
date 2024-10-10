class Point {
    let x, y;

    def constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Point3D extends Point {
    let z;

    def constructor(x, y, z) {
        super(x,y);
        this.z = z;
    }

    def sum() {
        write(this.x + this.y + this.z);
    }
}

let point = new Point3D(10,20,30);
point.sum();