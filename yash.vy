module Math {
    def abs(x) {
        if(x < 0) {
            return x*-1;
        } else {
            return x;
        }
    }

    def square(x) {
        return x*x;
    }

    let MAX = 1000;

    let PI = 22/7;
}

module Area {
    def circle(r) {
        return Math.PI * r * r;
    }
}

write(Math.abs(-10));
write(Math.MAX);
write(Math.square(5));
write(Area.circle(7));
