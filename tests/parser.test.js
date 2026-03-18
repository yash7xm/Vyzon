const test = require("node:test");
const assert = require("node:assert/strict");

const { parse } = require("./helpers/runtime.js");

test("Parser supports an empty program", () => {
    const program = parse("");

    assert.equal(program.type, "Program");
    assert.deepEqual(program.body, []);
    assert.deepEqual(program.loc, {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 1, offset: 0 },
    });
});

test("Parser folds chained relational expressions left-to-right", () => {
    const expression = parse("1 < 2 < 3;").body[0].expression;

    assert.equal(expression.type, "BinaryExpression");
    assert.equal(expression.operator, "<");
    assert.equal(expression.left.type, "BinaryExpression");
    assert.equal(expression.left.operator, "<");
    assert.equal(expression.right.value, 3);
});

test("Parser folds chained logical expressions left-to-right", () => {
    const expression = parse("true && false && true;").body[0].expression;

    assert.equal(expression.type, "LogicalANDExpression");
    assert.equal(expression.left.type, "LogicalANDExpression");
    assert.equal(expression.right.type, "BooleanLiteral");
    assert.equal(expression.right.value, true);
});

test("Parser allows for-loops with omitted clauses", () => {
    const statement = parse("for (; false; ) { write(1); }").body[0];

    assert.equal(statement.type, "ForStatement");
    assert.equal(statement.init, null);
    assert.equal(statement.test.type, "BooleanLiteral");
    assert.equal(statement.update, null);
});

test("Parser preserves new expressions", () => {
    const declaration = parse("let point = new Point(1, 2);").body[0].declarations[0];

    assert.equal(declaration.init.type, "NewExpression");
    assert.equal(declaration.init.callee.name, "Point");
    assert.equal(declaration.init.arguments.length, 2);
    assert.deepEqual(declaration.init.loc.start, {
        line: 1,
        column: 13,
        offset: 12,
    });
});

test("Parser attaches source locations to statements", () => {
    const statement = parse("let value = 10;\nwrite(value);").body[1];

    assert.deepEqual(statement.loc, {
        start: { line: 2, column: 1, offset: 16 },
        end: { line: 2, column: 14, offset: 29 },
    });
});

test("Parser errors include line and column information", () => {
    assert.throws(
        () => parse("let a = ;"),
        /Unexpected primary expression at line 1, column 9/
    );
});

test("Parser reports incomplete call expressions cleanly", () => {
    assert.throws(
        () => parse("write("),
        /Unexpected end of input, expected: "\)" at line 1, column 7/
    );
});
