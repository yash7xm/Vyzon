const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../src/Generator.js');
const { Interpreter } = require('../Interpreter/Interpreter.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();


const program = `
  let a = 6, b=0;
  for(let i=0; i<5; i+=1){
    if(a>b) write('a is greater');
    elif(a<b) write('b is greater');
    else write('dono barabar h');
    a -=1;
    b +=1;
  }

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
console.log(ev);

