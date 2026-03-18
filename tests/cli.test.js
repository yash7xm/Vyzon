const test = require("node:test");
const assert = require("node:assert/strict");

const { runCli } = require("./helpers/runtime.js");
const { run } = require("../bin/vyzon");

test("CLI evaluates inline expressions", () => {
    const { logs } = runCli(["-e", "write(2 + 2);"]);

    assert.deepEqual(logs, [[4]]);
});

test("CLI executes files", () => {
    const { logs } = runCli(["-f", "tests/fixtures/cli-success.vy"]);

    assert.deepEqual(logs, [[10]]);
});

test("CLI prints clean parser errors without a stack trace", () => {
    const errors = [];
    const originalError = console.error;
    const originalExitCode = process.exitCode;

    console.error = (...args) => {
        errors.push(args.join(" "));
    };

    try {
        run([process.execPath, "bin/vyzon", "-e", "write("]);
    } catch (error) {
        assert.fail(`CLI should not rethrow errors: ${error.message}`);
    } finally {
        console.error = originalError;
        process.exitCode = originalExitCode;
    }

    assert.deepEqual(errors, [
        'Unexpected end of input, expected: ")" at line 1, column 7',
    ]);
});
