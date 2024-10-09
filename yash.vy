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
}

let obj1 = new b(10);
let obj2 = new b(100);



