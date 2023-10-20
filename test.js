const { Tokenizer } = require('./Tokenizer.js');
const { Parser } = require('./Parser.js');

const tokenizer = new Tokenizer();
const parser = new Parser();

const program = `
    2 + ;
`

tokenizer.init(program);
let token = tokenizer.getNextToken();
while (token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}

const ast = parser.parse(program);
console.log(ast);
console.log(JSON.stringify(ast, null, 2));

