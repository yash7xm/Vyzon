const { Parser } = require("./parser/Parser.js");
const { Interpreter } = require("./vyzon.js");

const parser = new Parser();
const interpreter = new Interpreter();

const fs = require("fs");
const directory = "./";

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
    }

    const vyzonFile = files.find((file) => file.endsWith(".vy"));

    if (!vyzonFile) {
        console.error("No .pynot files found in the directory.");
        return;
    }

    const filePath = `${directory}/${vyzonFile}`;

    fs.readFile(filePath, "utf8", (readErr, data) => {
        if (readErr) {
            console.error(`Error reading ${filePath}: ${readErr}`);
            return;
        }

        let code = data;

        const ast = parser.parse(code);

        interpreter.interpret(ast.body);
    });
});
