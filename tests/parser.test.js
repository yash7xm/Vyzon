const test = require("node:test");
const assert = require("node:assert/strict");

const { parse } = require("./helpers/runtime.js");

test("Parser supports an empty program", () => {
    assert.deepEqual(parse(""), {
        type: "Program",
        body: [],
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
});
