const Program = `

// Factorial
// def factorial(n) {
//     if (n <= 1) {
//         return 1;
//     }
//     else {
//         return n * factorial(n - 1);
//     }
// }

// let result = factorial(5);
// write(result);


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


def isDivisible(n, divisor) {
    while (n >= divisor) {
        n = n - divisor;
    }
    return n == 0;
}

def isPrime(n) {
    if (n <= 1) {
        return false;
    }
    if (n <= 3) {
        return true;
    }
    if (isDivisible(n, 2) || isDivisible(n, 3)) {
        return false;
    }
    let i = 5;
    while (i * i <= n) {
        if (isDivisible(n, i) || isDivisible(n, i + 2)) {
            return false;
        }
        i = i + 6;
    }
    return true;
}

def findPrimes(limit) {
    for (let num = 2; num <= limit; num=num+1) {
        if (isPrime(num)) {
            write(num);
        }
    }
}

findPrimes(30);




`

module.exports =  Program ;