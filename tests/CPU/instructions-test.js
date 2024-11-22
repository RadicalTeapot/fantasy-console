import assert from "assert";
import { it } from "../it.js";
import { Memory } from "../../src/memory/memory.js";
import { instructions, opcodes } from "../../src/CPU/instructions.js";

console.log("LOAD instructions");
it("works as intended (LOAD_MEM_REG)", () => {
    const memory = new Memory(0x01);
    memory.write8(0x00, 0x12);
    const registers = new Memory(0x01);
    instructions[opcodes.LOAD_MEM_REG](0x00, 0x00, memory, registers);
    assert.strictEqual(registers.read8(0x00), 0x12);
})

it("works as intended (LOAD_LIT_REG)", () => {
    const registers = new Memory(0x01);
    instructions[opcodes.LOAD_LIT_REG](0x12, 0x00, registers);
    assert.strictEqual(registers.read8(0x00), 0x12);
})

it("works as intended (LOAD_REG_REG)", () => {
    const registers = new Memory(0x02);
    registers.write8(0x00, 0x12);
    instructions[opcodes.LOAD_REG_REG](0x00, 0x01, registers);
    assert.strictEqual(registers.read8(0x01), 0x12);
})

it("works as intended (LOAD_REG_MEM)", () => {
    const memory = new Memory(0x01);
    const registers = new Memory(0x01);
    registers.write8(0x00, 0x12);
    instructions[opcodes.LOAD_REG_MEM](0x00, 0x00, memory, registers);
    assert.strictEqual(memory.read8(0x00), 0x12);
})

it("works as intended (LOAD_LIT_MEM)", () => {
    const memory = new Memory(0x01);
    instructions[opcodes.LOAD_LIT_MEM](0x12, 0x00, memory);
    assert.strictEqual(memory.read8(0x00), 0x12);
})

it("works as intended (LOAD_MEM_MEM)", () => {
    const memory = new Memory(0x02);
    memory.write8(0x00, 0x12);
    instructions[opcodes.LOAD_MEM_MEM](0x00, 0x01, memory);
    assert.strictEqual(memory.read8(0x01), 0x12);
})

it("works as intended (LOADW_MEM_REG)", () => {
    const memory = new Memory(0x02);
    memory.write16(0x00, 0x1234);
    const registers = new Memory(0x02);
    instructions[opcodes.LOADW_MEM_REG](0x00, 0x00, memory, registers);
    assert.strictEqual(registers.read16(0x00), 0x1234);
})

it("works as intended (LOADW_LIT_REG)", () => {
    const registers = new Memory(0x02);
    instructions[opcodes.LOADW_LIT_REG](0x1234, 0x00, registers);
    assert.strictEqual(registers.read16(0x00), 0x1234);
})

it("works as intended (LOADW_REG_REG)", () => {
    const registers = new Memory(0x04);
    registers.write16(0x00, 0x1234);
    instructions[opcodes.LOADW_REG_REG](0x00, 0x02, registers);
    assert.strictEqual(registers.read16(0x02), 0x1234);
})

it("works as intended (LOADW_REG_MEM)", () => {
    const memory = new Memory(0x02);
    const registers = new Memory(0x02);
    registers.write16(0x00, 0x1234);
    instructions[opcodes.LOADW_REG_MEM](0x00, 0x00, memory, registers);
    assert.strictEqual(memory.read16(0x00), 0x1234);
})

it("works as intended (LOADW_LIT_MEM)", () => {
    const memory = new Memory(0x02);
    instructions[opcodes.LOADW_LIT_MEM](0x1234, 0x00, memory);
    assert.strictEqual(memory.read16(0x00), 0x1234);
})

it("works as intended (LOADW_MEM_MEM)", () => {
    const memory = new Memory(0x04);
    memory.write16(0x00, 0x1234);
    instructions[opcodes.LOADW_MEM_MEM](0x00, 0x02, memory);
    assert.strictEqual(memory.read16(0x02), 0x1234);
})
