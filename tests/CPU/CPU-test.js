import assert from "assert";
import { it } from "../it.js";

import { CPU } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { registers } from "../../src/CPU/registers.js";
import { opcodes } from "../../src/CPU/instructions.js";
import { InstructionFactory } from "../../src/CPU/instruction-factory.js";

console.log("CPU");
it("can write 8-bit values to registers", () => {
    const cpu = new CPU(new Memory(0x10));
    cpu.registers.write8(registers.R0, 0x12);
    assert.strictEqual(cpu.registers.read16(registers.R0), 0x0012);
})

it("executes LOAD_MEM_REG instruction", () => {
    const memory = new Memory(0x04);
    memory.write8(0x00, opcodes.LOAD_MEM_REG); // Literal value
    memory.write8(0x01, 0x02); // Memory address
    memory.write8(0x02, registers.R0); // Register address
    memory.write8(0x03, 0x12); // Memory value
    let address, reg, mem, regs;
    const instructions = {[opcodes.LOAD_MEM_REG]: (a, r, m, rs) => { address = a; reg = r; mem = m; regs = rs; }};
    const cpu = new CPU(memory, new InstructionFactory(instructions));
    cpu.execute();
    assert.strictEqual(address, 0x02);
    assert.strictEqual(reg, registers.R0);
    assert.strictEqual(mem, memory);
    assert.strictEqual(regs, cpu.registers);
})

it("executes LOAD_LIT_REG instruction", () => {
    const memory = new Memory(0x03);
    memory.write8(0x00, opcodes.LOAD_LIT_REG); // Literal value
    memory.write8(0x01, 0x12); // Literal value
    memory.write8(0x02, registers.R0); // Register address
    let address, value, regs;
    const instructions = {[opcodes.LOAD_LIT_REG]: (v, a, rs) => { address = a; value = v; regs = rs; }};
    const cpu = new CPU(memory, new InstructionFactory(instructions));
    cpu.execute();
    assert.strictEqual(address, registers.R0);
    assert.strictEqual(value, 0x12);
    assert.strictEqual(regs, cpu.registers);
})
