const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../src/Generator.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();

const program = `
 for(let i= 0; i<5 && i>0; i+=2){
  i += 2;
 }
 while(0){
  let b= 5;
 }
 for(let i,j=0; i<5 || j>3; i+=1){
  while(0){
    let x=5;
  }
 }
 for(i=0; i<5; j+=2){
  yo;
 }
`

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


