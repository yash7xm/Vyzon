const test = require("node:test");
const assert = require("node:assert/strict");

const { tokenize } = require("./helpers/runtime.js");
const { Tokenizer } = require("../parser/Tokenizer.js");

test("Tokenizer returns null at EOF for empty input", () => {
    const tokenizer = new Tokenizer();
    tokenizer.init("");

    assert.equal(tokenizer.getNextToken(), null);
});

test("Tokenizer skips whitespace and comments", () => {
    const tokens = tokenize(`
        // single line
        let value = 10;
        /* multi
           line */
        write(value);
    `);

    assert.deepEqual(
        tokens.map((token) => token.type),
        ["let", "IDENTIFIER", "SIMPLE_ASSIGN", "NUMBER", ";", "IDENTIFIER", "(", "IDENTIFIER", ")", ";"]
    );
    assert.deepEqual(tokens[0].loc.start, {
        line: 3,
        column: 9,
        offset: 32,
    });
});

test("Tokenizer throws a syntax error for unknown characters", () => {
    const tokenizer = new Tokenizer();
    tokenizer.init("@");

    assert.throws(
        () => tokenizer.getNextToken(),
        /Unexpected token: "@" at line 1, column 1/
    );
});
