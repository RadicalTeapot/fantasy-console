import assert from "assert";
import { it } from "../it.js";

import { Stack } from "../../src/memory/stack.js";
import { Memory } from "../../src/memory/memory.js";
import { ByteRegister, WordRegister } from "../../src/CPU/registers.js";

function buildStack(stackSize=0x8) {
    const memorySize = stackSize + 2;
    const memory = new Memory(memorySize);
    const spRegister = new ByteRegister(memory, 0x0, "sp");
    const fpRegister = new ByteRegister(memory, 0x1, "fp");
    return new Stack(memory, spRegister, fpRegister, stackSize, 0x2);
}

console.log("Stack");
it("has valid initial state", () => {
    const stack = buildStack();
    const endOfStackAddress = stack.address + stack.size;
    assert.strictEqual(stack.spRegister.read(), endOfStackAddress, "SP register has valid initial state");
    assert.strictEqual(stack.fpRegister.read(), endOfStackAddress - 1, "FP register has valid initial state");
})

it("resets its registers to the proper address", () => {
    const stack = buildStack();
    stack.reset();
    const endOfStackAddress = stack.address + stack.size;
    assert.strictEqual(stack.spRegister.read(), endOfStackAddress, "SP register has valid initial state");
    assert.strictEqual(stack.fpRegister.read(), endOfStackAddress - 1, "FP register has valid initial state");
})

it("pushes and pops 8 bit values", () => {
    const stack = buildStack();
    const popRegister = new ByteRegister(stack.memory, 0x0, "r0");
    stack.push(0x12);
    const value = stack.peek();
    assert.strictEqual(value, 0x12, "Pushed value is correct");
    stack.pop(popRegister);
    assert.strictEqual(popRegister.read(), 0x12, "Popped value is correct");
})

it("pushes and pops 16 bit values", () => {
    const stack = buildStack();
    const popRegister = new WordRegister(stack.memory, 0x0, "r0");
    stack.push16(0x1234);
    const value = stack.peek16();
    assert.strictEqual(value, 0x1234, "Pushed value is correct");
    stack.pop16(popRegister);
    assert.strictEqual(popRegister.read(), 0x1234, "Popped value is correct");
})

it("fails on stack overflow for 8 bit push", () => {
    const stack = buildStack(2);
    stack.push(0x12); stack.push(0x34);
    assert.throws(() => stack.push(0x56));
})

it("fails on stack overflow for 16 bit push", () => {
    const stack = buildStack(2);
    stack.push16(0x1234);
    assert.throws(() => stack.push16(0x9abc));
})

it("fails on stack underflow for 8 bit pop", () => {
    const stack = buildStack(2);
    assert.throws(() => stack.pop(new ByteRegister(stack.memory, 0x0, "r0")));
})

it("fails on stack underflow for 16 bit pop", () => {
    const stack = buildStack(2);
    assert.throws(() => stack.pop16(new WordRegister(stack.memory, 0x0, "r0")));
})
