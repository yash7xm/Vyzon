const { Tokenizer } = require('./Tokenizer.js');
const { Parser } = require('./Parser.js');

const tokenizer = new Tokenizer();
const parser = new Parser();

const program = `
    if(a+5){
        b = 5;
        if(j) {
            c=d;
        }
    }
    else {
        c= d;
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

