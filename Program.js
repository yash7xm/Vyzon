const Program = `

// Factorial
def factorial(n) {
    if (n <= 1) {
        return 1;
    }
    else {
        return n * factorial(n - 1);
    }
}

let result = factorial(5);
write(result);


// Fibonacci 
// def fibonacci(n) {
//     if (n == 0) {
//         return 0;
//     }
//     else if (n == 1) {
//         return 1;
//     }
//     else {
//         let fib = 0;
//         let prev = 1;
//         let prevPrev = 0;
//         for (let i = 2; i <= n; i+=1) {
//             fib = prev + prevPrev;
//             prevPrev = prev;
//             prev = fib;
//         }
//         return fib;
//     }
// }

// let result = fibonacci(10);
// write(result);

// Inverted Right Triangle Pattern
// let n = 5;

// for (let i = 1; i <= n; i+=1) {
//     let row = '';
//     for (let j = n; j >= i; j-=1) {
//         row = row + '* ';
//     }
//     write(row);
// }

// Square Pattern
// let n = 5;

// for (let i = 1; i <= n; i+=1) {
//     let row = '';
//     for (let j = 1; j <= n; j+=1) {
//         row = row + '* ';
//     }
//     write(row);
// }

// Right Triangle Pattern
// let n = 5;

// for (let i = 1; i <= n; i+=1) {
//     let row = '';
//     for (let j = 1; j <= i; j+=1) {
//         row = row + '* ';
//     }
//     write(row);
// }


// add sum 
// def add(a, b) {
//     let result = a + b;
//     return result;
// }

// let sum = add(5, 3);
// write(sum);


// function 
// let greeting = "Hello, ";
// let name = "PyNot";
// let message = greeting + name + "!";
// write(message);

// let fullName = name + " Language";
// write("Full Name: " + fullName);

// let length = fullName.length;
// write("Length of Full Name: " + length);



// Conditional Statement 
// let x = 10;
// let y = 5;
// if (x > y) {
//     write("x is greater than y");
// } else {
//     write("y is greater than or equal to x");
// }

// Example 
//    def isEven(a) {
//     return a == 2;
//    }
//    write(isEven(2));


// def isDivisible(n, divisor) {
//     while (n >= divisor) {
//         n = n - divisor;
//     }
//     return n == 0;
// }

// def isPrime(n) {
//     if (n <= 1) {
//         return false;
//     }
//     if (n <= 3) {
//         return true;
//     }
//     if (isDivisible(n, 2) || isDivisible(n, 3)) {
//         return false;
//     }
//     let i = 5;
//     while (i * i <= n) {
//         if (isDivisible(n, i) || isDivisible(n, i + 2)) {
//             return false;
//         }
//         i = i + 6;
//     }
//     return true;
// }

// def findPrimes(limit) {
//     for (let num = 2; num <= limit; num=num+1) {
//         if (isPrime(num)) {
//             write(num);
//         }
//     }
// }

// findPrimes(5);

// Calculate the Area of a Rectangle
// def calculateArea(length, width) {
//     return length * width;
// }

// def main() {
//     let length = 5;
//     let width = 3;
//     let area = calculateArea(length, width);
//     write("The area of the rectangle is: " + area);
// }

// main();

// Calculate Compound Interest
// def calculateCompoundInterest(principal, rate, time) {
//     let amount = principal * (1 + rate / 100) * time;
//     return amount - principal;
// }

// def main() {
//     let principal = 1000;
//     let rate = 5;
//     let time = 3;
//     let interest = calculateCompoundInterest(principal, rate, time);
//     write("The compound interest is: " + interest);
// }

// main();

// def calculateFactorial(n) {
//     if (n == 0 || n == 1) {
//         return 1;
//     }
//     else return n * calculateFactorial(n - 1);

//     // return (n==0 || n==1) ? 1 : n * calculateFactorial(n-1);
// }

// def main() {
//     let n = 2;
//     let factorial = calculateFactorial(n);
//     write("The factorial of " + n + " is: " + factorial);
// }

// main();


// def sumOfNaturalNumbers(n) {
//     if (n <= 1) {
//         return n;
//     } else {
//         return n + sumOfNaturalNumbers(n - 1);
//     }
// }

// let n = 550;
// write("The sum of first " + n + " natural numbers is: " + sumOfNaturalNumbers(n));

// def foo(a) {
//     if(a > 10) return 0;
//     else return a + foo(a+1);
// }

// let a= 5;
// write(foo(a + 5));


// def isEven(a) {
//     if(a % 2 == 0) {
//         write("even");
//     }
//     elif(a % 2 != 0){
//         write('odd');
//     }
// }

// isEven(25);


// def fun4(d){
//     write(d);
// }

// def fun3(c) {
//     fun4('h');
//     write(c);
// }

// def fun2(b) {
//     fun3('s');
//     write(b);
// }

// def fun1(a) {
//     fun2('a');
//     write(a);
// }

// fun1('y');

// def ad(a) {
//     return a;
// }

// def ab(a) {
//     return a;
// }

// def foo(a) {
//     if(a==1) return 1;
//     return foo(ad(a-1) + ab(a-2));
// }
// write(foo(2));

// classes
// class Point {
//     let x, y;

//     def constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }
// }

// class Point3D extends Point {
//     let z;

//     def constructor(x, y, z) {
//         super(x,y);
//         this.z = z;
//     }

//     def sum() {
//         write(this.x + this.y + this.z);
//     }
// }

// let point = new Point3D(10,20,30);
// point.sum();


`

module.exports =  Program ;