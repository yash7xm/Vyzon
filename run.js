const { Parser } = require('./src/Parser.js');
const { Generator } = require('./Generator/Generator.js');
const { Interpreter } = require('./Interpreter/Interpreter.js');

const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();

const fs = require('fs');
const file = 'my_program.pynot';

fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
        console.log(`Error reading ${file}: ${err}`);
    } else {
        let code = data;

        const ast = parser.parse(code);

        let generatedCode = gen.generate(ast.body);

        console.log("AST Transformer Type Compiled Code Result");
        console.log("==================================");
        try {
            eval(generatedCode);
        } catch (error) {
            console.error("Error running the generated code:", error);
        }

        console.log("Interpreter Generated Code");
        console.log("==================================");

        const ev = interpreter.interpret(ast.body);
    }
});
