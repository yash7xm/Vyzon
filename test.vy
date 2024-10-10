class Person {
  def constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  def greet() {
    write("Hello, my name is " + this.name + " and I am " + this.age + " years old.");
  }
}

let person1 = new Person("Yash", 22);
person1.greet();