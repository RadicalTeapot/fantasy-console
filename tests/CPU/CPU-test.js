import assert from "assert";
import { it } from "../it.js";

import { CPU } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { registers, _SIZE } from "../../src/CPU/registers.js";
import { instructions, opcodes } from "../../src/CPU/instructions.js";
import { InstructionFactory } from "../../src/CPU/instruction-factory.js";

function buildCPU(memory, pc=0) {
    const registerMemory = new Memory(_SIZE);
    const instructionFactory = new InstructionFactory(memory, registerMemory, instructions);
    const cpu = new CPU(memory, registerMemory, instructionFactory);
    registerMemory.write16(registers.PC, pc);
    return cpu;
}

console.log("CPU");
it("can write 8-bit values to registers", () => {
    const cpu = buildCPU(new Memory(0x01));
    cpu.registers.write8(registers.R0, 0x12);
    assert.strictEqual(cpu.registers.read16(registers.R0), 0x0012);
})

it("executes LOAD_MEM_REG instruction", () => {
    const memory = new Memory(0x04);
    memory.write8(0x00, opcodes.LOAD_MEM_REG); // Literal value
    memory.write8(0x01, 0x03); // Memory address
    memory.write8(0x02, registers.R0); // Register address
    memory.write8(0x03, 0x12); // Memory value
    const cpu = buildCPU(memory);
    cpu.execute();
    assert.strictEqual(cpu.registers.read8(registers.R0), 0x12);
})

it("executes LOAD_LIT_REG instruction", () => {
    const memory = new Memory(0x03);
    memory.write8(0x00, opcodes.LOAD_LIT_REG); // Literal value
    memory.write8(0x01, 0x12); // Literal value
    memory.write8(0x02, registers.R0); // Register address
    const cpu = buildCPU(memory);
    cpu.execute();
    assert.strictEqual(cpu.registers.read8(registers.R0), 0x12);
})
