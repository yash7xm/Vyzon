const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../Generator/Generator.js');
const { Interpreter } = require('../Interpreter/Interpreter.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();


const program = `
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
  
  for (let num = 2; num <= limit; num+=1) {
      if (isPrime(num)) {
        write(num);
      }
  }

}

findPrimes(30);
write('true');

`;
console.log("==================================");
tokenizer.init(program);
let token = tokenizer.getNextToken();
while (token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}

console.log("==================================");
const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
let code = gen.generate(ast.body);

console.log("==================================");
console.log(code);

console.log("==================================");
try {
  eval(code);
} catch (error) {
  console.error("Error running the generated code:", error);
}


console.log("==================================");

const ev = interpreter.interpret(ast.body);


