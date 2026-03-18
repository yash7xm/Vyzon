const test = require("node:test");
const assert = require("node:assert/strict");

const { runCli } = require("./helpers/runtime.js");

test("CLI evaluates inline expressions", () => {
    const { logs } = runCli(["-e", "write(2 + 2);"]);

    assert.deepEqual(logs, [[4]]);
});

test("CLI executes files", () => {
    const { logs } = runCli(["-f", "test.vy"]);

    assert.deepEqual(logs, [[10]]);
});
