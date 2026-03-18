const { Parser } = require("../../parser/Parser.js");
const { Interpreter } = require("../../vyzon.js");
const { Tokenizer } = require("../../parser/Tokenizer.js");
const { main } = require("../../bin/vyzon");

function parse(source) {
    return new Parser().parse(source);
}

function interpret(source) {
    return new Interpreter().interpret(parse(source).body);
}

function tokenize(source) {
    const tokenizer = new Tokenizer();
    tokenizer.init(source);

    const tokens = [];
    let token = tokenizer.getNextToken();

    while (token !== null) {
        tokens.push(token);
        token = tokenizer.getNextToken();
    }

    return tokens;
}

function captureLogs(fn) {
    const logs = [];
    const originalLog = console.log;

    console.log = (...args) => {
        logs.push(args);
    };

    try {
        const result = fn();
        return { logs, result };
    } finally {
        console.log = originalLog;
    }
}

function runCli(args) {
    return captureLogs(() => main([process.execPath, "bin/vyzon", ...args]));
}

module.exports = {
    captureLogs,
    interpret,
    parse,
    runCli,
    tokenize,
};
