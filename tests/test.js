const { Tokenizer } = require('../src/Tokenizer.js');
const { Parser } = require('../src/Parser.js');

const tokenizer = new Tokenizer();
const parser = new Parser();

const program = `
for (;;) {
    if(y>9) {
        let h= 'hi';
    }
    elif(z) {
        'hi';
    }
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

