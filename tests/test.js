const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../src/Generator.js');
const { Interpreter } = require('../Interpreter/Interpreter.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();


const program = `
   let a = 1, b= 1;
   if(a > b) {
    a = 0;
   }
   elif(a<b){
    b=0;
   }
   else {
    a=0;
    b=0;
    let c=0;

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

const ev = interpreter.interpret(ast.body);
console.log(ev);

