const test = require("node:test");
const assert = require("node:assert/strict");

const { captureLogs, interpret } = require("./helpers/runtime.js");

test("Interpreter handles for-loops with omitted clauses", () => {
    const { logs } = captureLogs(() => {
        interpret("for (; false; ) { write(1); } write(2);");
    });

    assert.deepEqual(logs, [[2]]);
});

test("Interpreter stops executing a function after return", () => {
    const { logs, result } = captureLogs(() => {
        return interpret("def f() { return 1; write(2); } f();");
    });

    assert.deepEqual(logs, []);
    assert.equal(result, 1);
});

test("Interpreter supports class methods returning values", () => {
    const { logs } = captureLogs(() => {
        interpret(`
            class A {
                def constructor() {}

                def value() {
                    return 7;
                    write(8);
                }
            }

            let a = new A();
            write(a.value());
        `);
    });

    assert.deepEqual(logs, [[7]]);
});

test("Interpreter resolves imports from the modules directory", () => {
    const { logs } = captureLogs(() => {
        interpret(`
            import Geometry;
            let p = new Point3D(1, 2, 3);
            p.ShowPoints();
            write(Circle(2));
        `);
    });

    assert.deepEqual(logs, [[1, 2, 3], [12.571428571428571]]);
});
