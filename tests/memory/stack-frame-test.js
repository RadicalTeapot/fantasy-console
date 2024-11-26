import assert from 'assert';
import { it } from "../it.js";

import { StackFrame, StackFrameBuilder } from '../../src/memory/stack-frame.js';

console.log("Stack frame builder");
it("fails if PC is not set", function () {
    const builder = new StackFrameBuilder();
    assert.throws(() => builder.build());
});

it("sets the correct PC value", function () {
    const builder = new StackFrameBuilder().setPC(0x1234);
    const frame = builder.build();
    assert.strictEqual(frame.pc, 0x1234);
});

it("builds if no arguments are set", function () {
    const builder = new StackFrameBuilder().setPC(0x1234);
    const frame = builder.build();
    assert.strictEqual(frame.pc, 0x1234);
    assert.strictEqual(frame.registers.length, 0);
    assert.strictEqual(frame.functionArguments.length, 0);
});

console.log("Stack frame");
it("has valid bytes when registers and arguments are empty", function () {
    const frame = new StackFrame(0x1234, [], []);
    const bytes = frame.getBytes();
    assert.strictEqual(bytes.length, 5);
    assert.strictEqual(bytes[0], 0);    // Function argument count
    assert.strictEqual(bytes[1], 0);    // Register count
    assert.strictEqual(bytes[2], 0x34); // PC low nibble
    assert.strictEqual(bytes[3], 0x12); // PC high nibble
    assert.strictEqual(bytes[4], 5);    // Size
});

it("has valid bytes when registers are set", function () {
    const frame = new StackFrame(0x789A, [0x12, 0x3456], []);
    const bytes = frame.getBytes();
    assert.strictEqual(bytes.length, 9);
    assert.strictEqual(bytes[0], 0);    // Function argument count
    assert.strictEqual(bytes[1], 0x12); // Register 1 low nibble
    assert.strictEqual(bytes[2], 0x00); // Register 1 high nibble
    assert.strictEqual(bytes[3], 0x56); // Register 2 low nibble
    assert.strictEqual(bytes[4], 0x34); // Register 2 high nibble
    assert.strictEqual(bytes[5], 2);    // Register count
    assert.strictEqual(bytes[6], 0x9A); // PC low nibble
    assert.strictEqual(bytes[7], 0x78); // PC high nibble
    assert.strictEqual(bytes[8], 9);    // Size
});

it("has valid bytes when function arguments are set", function () {
    const frame = new StackFrame(0x789A, [], [0x12, 0x3456]);
    const bytes = frame.getBytes();
    assert.strictEqual(bytes.length, 9);
    assert.strictEqual(bytes[0], 0x12); // Function argument 1 low nibble
    assert.strictEqual(bytes[1], 0x00); // Function argument 1 high nibble
    assert.strictEqual(bytes[2], 0x56); // Function argument 2 low nibble
    assert.strictEqual(bytes[3], 0x34); // Function argument 2 high nibble
    assert.strictEqual(bytes[4], 2);    // Function argument count
    assert.strictEqual(bytes[5], 0);    // Register count
    assert.strictEqual(bytes[6], 0x9A); // PC low nibble
    assert.strictEqual(bytes[7], 0x78); // PC high nibble
    assert.strictEqual(bytes[8], 9);    // Size
});
