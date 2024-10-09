let global = "a";

def sum() {
    write("sum");
}

class a {
    let name = 'yash';

    def constructor() {
        write("HEY YO!");
    }

    def afn() {
        write("a");
    }

    this.afn();
}


class b extends a {
    let age = 5;

    def constructor(inc) {
        age += inc;
        write(age, name);
    }

    def cal() {
        write(age);
    }

    this.cal();
}



