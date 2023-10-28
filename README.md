# PyNot 

PyNot is a modern programming language inspired by the elegance of Python, the flexibility of JavaScript, and the expressiveness of Ruby. It is designed with a primary focus on readability and simplicity while maintaining powerful functionality.
 
## Usage

To use PyNot locally, follow these steps:

1. **Clone the repository** to your local machine using Git:
   `
   https://github.com/yash7xm/PyNot.git
   `
2. **Change your current directory** to the cloned repository: ` cd PyNot `
 
4. **Create a new PyNot file** with your code in the main directory. Name the file with a .pynot extension, for example, yourfile.pynot.
  
6. To **run your PyNot code**, execute the following command in your terminal: ` node run.js `

# Documentation


## Variable Declarations

In PyNot, variables are declared using the `let` keyword. By default, when you declare a variable using `let`, it is initialized with a value of 0. For example:

```pynot
let a;  // Variable 'a' is declared and initialized with the default value of 0
let b = 1;  // Variable 'b' is declared and initialized with the value 1
let c = 'Hello, World!';
```

## Data Types

PyNot supports various data types, including `strings`, `numbers`, `true`, `false`, and `null`, to represent a wide range of values. 
For example:

```pynot
let a = 'Hello, World!';
let b = 10;
let c = 10 + (10 * 3) + a;
let d = "Ok!";
let e = null;
let f = true;
let g = false;
```

## Build-ins
### Console Output
In PyNot, you can print to the console using the `write()` function. 
Here are some examples:

```pynot
let a = 'Anything';
write(a); 
write("abc");
write("write anything: ", a);
```
### String Operations

PyNot provides string manipulation capabilities:

* **`.length` Property**: To find the length of a string, use the .length property. For example:
```pynot
let a = 'abcd';
write(a.length); // This will print the length of the string.
```
* **String Indexing**: You can access individual characters within a string using square brackets. For instance:

```pynot 
let a = 'abcd';
write(a[0]); // This will print the first character 'a'.
```
## Conditionals

PyNot supports conditional statements for decision-making in your code. You can use the `if`, `elif`, and `else` statements to execute different blocks of code based on specific conditions. Here's an example:

```pynot 
let x = 10;

if (x > 15) {
  write("x is greater than 15");
} elif (x > 5) {
  write("x is greater than 5 but not greater than 15");
} else {
  write("x is not greater than 5");
}
```

## Loops 

 PyNot supports various loop types to suit your needs. You can use `for`, `while`, and `do while` loops to control the flow of your PyNot programs by repeating code as needed.

 ```pynot 
write("Using the for loop:");
for (let i=0; i<10; i+=1) {
  write("Current value of i: ", i);
}

write("Using the while loop:");
let j = 0;
while (j < 5) {
  write("Current value of j: ", j);
  j = j + 1;
}

write("Using the do-while loop:");
let k = 0;
do {
  write("Current value of k: ", k);
  k = k + 1;
} while (k < 5);
```

## Functions

You can declare functions in PyNot using the `def` keyword, followed by the function name and parameters enclosed in parentheses. The function body is defined in a block. To call a function, use its name followed by parentheses, passing any required arguments.

```pynot
def greet(name) {
  write("Hello, " + name + "!");
}

greet("Yash"); // Calls the greet function with "Alice" as an argument.
```

## Operators 

* **Logical Operators:** 
  - The logical operators are the same as in other programming languages. Ex: `&&,||,!`
* **Relational operators:** 
  - The relational operators are the same as in other programming languages. Ex: `<, >, <=, >=, ==, !=`
* **Arithmetic operators:**
  - The arithmetic operators are the same as in other programming languages. Ex: `+, -, *, /, %, ^`
* **Assignment operators:**
  - Assignment operators are the same as in other programming languages. Ex: `=, +=, -=, *=, /=`