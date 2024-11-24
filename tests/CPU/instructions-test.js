import assert from "assert";
import { it } from "../it.js";
import { Memory } from "../../src/memory/memory.js";
import { instructions, OPCODES } from "../../src/CPU/instructions.js";
import { ByteRegister, WordRegister } from "../../src/CPU/registers.js";

console.log("LOAD instructions");
it("works as intended (LOAD_MEM_REG)", () => {
    const memory = new Memory(0x02);
    const register = new ByteRegister(new Memory(0x01), 0x00, "R0");
    memory.write8(0x00, 0x12);
    instructions[OPCODES.LOAD_MEM_REG](0x00, 0, memory, [register]);
    assert.strictEqual(register.read(), 0x12);
})

it("works as intended (LOAD_LIT_REG)", () => {
    const register = new ByteRegister(new Memory(0x01), 0x00, "R0");
    instructions[OPCODES.LOAD_LIT_REG](0x12, 0, [register]);
    assert.strictEqual(register.read(), 0x12);
})

it("works as intended (LOAD_REG_REG)", () => {
    const registers = [
        new ByteRegister(new Memory(0x01), 0x00, "R0"),
        new ByteRegister(new Memory(0x01), 0x00, "R1")];
    registers[0].write(0x12);
    instructions[OPCODES.LOAD_REG_REG](0, 1, registers);
    assert.strictEqual(registers[1].read(), 0x12);
})

it("works as intended (LOAD_REG_MEM)", () => {
    const register = new ByteRegister(new Memory(0x01), 0x00, "R0");
    const memory = new Memory(0x01);
    register.write(0x12);
    instructions[OPCODES.LOAD_REG_MEM](0, 0x00, memory, [register]);
    assert.strictEqual(memory.read8(0x00), 0x12);
})

it("works as intended (LOAD_LIT_MEM)", () => {
    const memory = new Memory(0x01);
    instructions[OPCODES.LOAD_LIT_MEM](0x12, 0x00, memory);
    assert.strictEqual(memory.read8(0x00), 0x12);
})

it("works as intended (LOAD_MEM_MEM)", () => {
    const memory = new Memory(0x02);
    memory.write8(0x00, 0x12);
    instructions[OPCODES.LOAD_MEM_MEM](0x00, 0x01, memory);
    assert.strictEqual(memory.read8(0x01), 0x12);
})

it("works as intended (LOADW_MEM_REG)", () => {
    const register = new WordRegister(new Memory(0x02), 0x00, "R0");
    const memory = new Memory(0x02);
    memory.write16(0x00, 0x1234);
    instructions[OPCODES.LOADW_MEM_REG](0x00, 0, memory, [register]);
    assert.strictEqual(register.read(), 0x1234);
})

it("works as intended (LOADW_LIT_REG)", () => {
    const register = new WordRegister(new Memory(0x02), 0x00, "R0");
    instructions[OPCODES.LOADW_LIT_REG](0x1234, 0, [register]);
    assert.strictEqual(register.read(), 0x1234);
})

it("works as intended (LOADW_REG_REG)", () => {
    const registers = [
        new WordRegister(new Memory(0x02), 0x00, "R0"),
        new WordRegister(new Memory(0x02), 0x00, "R1")];
    registers[0].write(0x1234);
    instructions[OPCODES.LOADW_REG_REG](0, 1, registers);
    assert.strictEqual(registers[1].read(), 0x1234);
})

it("works as intended (LOADW_REG_MEM)", () => {
    const register = new WordRegister(new Memory(0x02), 0x00, "R0");
    const memory = new Memory(0x02);
    register.write(0x1234);
    instructions[OPCODES.LOADW_REG_MEM](0, 0x00, memory, [register]);
    assert.strictEqual(memory.read16(0x00), 0x1234);
})

it("works as intended (LOADW_LIT_MEM)", () => {
    const memory = new Memory(0x02);
    instructions[OPCODES.LOADW_LIT_MEM](0x1234, 0x00, memory);
    assert.strictEqual(memory.read16(0x00), 0x1234);
})

it("works as intended (LOADW_MEM_MEM)", () => {
    const memory = new Memory(0x04);
    memory.write16(0x00, 0x1234);
    instructions[OPCODES.LOADW_MEM_MEM](0x00, 0x02, memory);
    assert.strictEqual(memory.read16(0x02), 0x1234);
})
