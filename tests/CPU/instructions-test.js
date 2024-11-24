import assert from "assert";
import { it } from "../it.js";
import { Memory } from "../../src/memory/memory.js";
import { instructions, OPCODES } from "../../src/CPU/instructions.js";
import { RegistersBuilder, REGISTER } from "../../src/CPU/registers.js";

console.log("LOAD instructions");
it("works as intended (LOAD_MEM_REG)", () => {
    const registers = new RegistersBuilder().setStartAddress(0x01).build();
    registers.memory.write8(0x00, 0x12);
    instructions[OPCODES.LOAD_MEM_REG](0x00, REGISTER.R0, registers.memory, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R0), 0x12);
})

it("works as intended (LOAD_LIT_REG)", () => {
    const registers = new RegistersBuilder().build();
    instructions[OPCODES.LOAD_LIT_REG](0x12, REGISTER.R0, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R0), 0x12);
})

it("works as intended (LOAD_REG_REG)", () => {
    const registers = new RegistersBuilder().build();
    registers.writeRegister(REGISTER.R0, 0x12);
    instructions[OPCODES.LOAD_REG_REG](REGISTER.R0, REGISTER.R1, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R1), 0x12);
})

it("works as intended (LOAD_REG_MEM)", () => {
    const registers = new RegistersBuilder().setStartAddress(0x01).build();
    registers.writeRegister(REGISTER.R0, 0x12);
    instructions[OPCODES.LOAD_REG_MEM](REGISTER.R0, 0x00, registers.memory, registers);
    assert.strictEqual(registers.memory.read8(0x00), 0x12);
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
    const registers = new RegistersBuilder().setStartAddress(0x02).build();
    registers.memory.write16(0x00, 0x1234);
    instructions[OPCODES.LOADW_MEM_REG](0x00, REGISTER.R0, registers.memory, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R0), 0x1234);
})

it("works as intended (LOADW_LIT_REG)", () => {
    const registers = new RegistersBuilder().build();
    instructions[OPCODES.LOADW_LIT_REG](0x1234, REGISTER.R0, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R0), 0x1234);
})

it("works as intended (LOADW_REG_REG)", () => {
    const registers = new RegistersBuilder().build();
    registers.writeRegister(REGISTER.R0, 0x1234);
    instructions[OPCODES.LOADW_REG_REG](REGISTER.R0, REGISTER.R1, registers);
    assert.strictEqual(registers.readRegister(REGISTER.R1), 0x1234);
})

it("works as intended (LOADW_REG_MEM)", () => {
    const registers = new RegistersBuilder().setStartAddress(0x02).build();
    registers.writeRegister(REGISTER.R0, 0x1234);
    instructions[OPCODES.LOADW_REG_MEM](REGISTER.R0, 0x00, registers.memory, registers);
    assert.strictEqual(registers.memory.read16(0x00), 0x1234);
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
