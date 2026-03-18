const test = require("node:test");
const assert = require("node:assert/strict");

const { createReplSession } = require("../bin/vyzon");
const { captureLogs } = require("./helpers/runtime.js");

test("REPL keeps variables across commands", () => {
    const errors = [];
    const { logs } = captureLogs(() => {
        const session = createReplSession({
            error: (message) => errors.push(message),
        });

        session.handleLine("let a = 10;");
        session.handleLine("write(a);");
    });

    assert.deepEqual(logs, [[10]]);
    assert.deepEqual(errors, []);
});

test("REPL supports help and exit commands", () => {
    const logs = [];
    const session = createReplSession({
        log: (message) => logs.push(message),
    });

    const helpResult = session.handleLine(".help");
    const exitResult = session.handleLine(".exit");

    assert.deepEqual(logs, ["Commands: .help, .exit"]);
    assert.equal(helpResult.action, "continue");
    assert.equal(exitResult.action, "exit");
});

test("REPL prints primitive expression results", () => {
    const logs = [];
    const session = createReplSession({
        log: (message) => logs.push(message),
    });

    session.handleLine("1 + 2;");

    assert.deepEqual(logs, ["3"]);
});

test("REPL reports errors and continues running", () => {
    const errors = [];
    const { logs } = captureLogs(() => {
        const session = createReplSession({
            error: (message) => errors.push(message),
        });

        const errorResult = session.handleLine("write(");
        const successResult = session.handleLine("write(5);");

        assert.equal(errorResult.ok, false);
        assert.equal(successResult.ok, true);
    });
    assert.deepEqual(errors, [
        'Unexpected end of input, expected: ")" at line 1, column 7',
    ]);
    assert.deepEqual(logs, [[5]]);
});
