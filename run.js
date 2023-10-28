const { Parser } = require('./src/Parser.js');
const { Generator } = require('./Generator/Generator.js');
const { Interpreter } = require('./Interpreter/Interpreter.js');

const parser = new Parser();
const gen = new Generator();
const interpreter = new Interpreter();

const fs = require('fs');
const directory = './';

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
    }

    const pynotFile = files.find(file => file.endsWith('.pynot'));

    if (!pynotFile) {
        console.error('No .pynot files found in the directory.');
        return;
    }

    const filePath = `${directory}/${pynotFile}`;

    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error(`Error reading ${filePath}: ${readErr}`);
            return;
        }

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

        console.log("==================================");
        console.log("Interpreter Generated Code");

        const ev = interpreter.interpret(ast.body);
    });
});
