const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');
const { Generator } = require('../src/Generator.js');

const tokenizer = new Tokenizer();
const parser = new Parser();
const gen = new Generator();

const program = `
    a = b||c;
    a = b;
    !!b;
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
const code = gen.generate(ast.body);
console.log(code);

