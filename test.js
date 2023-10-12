const { Tokenizer } = require('./Tokenizer');

const tokenizer = new Tokenizer();

const program = `
    let a = 5;
`

tokenizer.init(program);
let token = tokenizer.getNextToken();
while(token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}