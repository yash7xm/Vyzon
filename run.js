const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../Generator/Generator.js');
const { Interpreter } = require('../Interpreter/Interpreter.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();

const fs = require('fs');
const file = 'my_program.pynot';

let code;

fs.readFile(file, 'utf-8', (err, data) => {
    if(err) {
        console.log(`Error reading ${file}: ${err}`);
    }
    code = data;
})

const ast = parser.parse(program);

let generatedCode = gen.generate(ast.body);

console.log("AST Tranformer Type Compiled Code Result")
console.log("==================================");
try {
  eval(generatedCode);
} catch (error) {
  console.error("Error running the generated code:", error);
}

console.log("Interpreter Generated Code");
console.log("==================================");

const ev = interpreter.interpret(ast.body);