class Animal {
    let name;

    def constructor(name) {
        this.name = name;
    }

    def showName() {
        write(this.name);
    }
}

class Monkey extends Animal {
    def sound() {
        write("Monkey");
    }
}

class Lion extends Animal {
    def sound() {
        write("Lion");
    }
}