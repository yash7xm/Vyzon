module Math {
    def abs(x) {
        if(x < 0) {
            return -x;
        } else {
            return x;
        }
    }
}

write(Math.abs(10));