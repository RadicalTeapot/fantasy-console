import assert from "assert";
import { it } from "../it.js";
import { CPU } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { opcodes } from "../../src/CPU/instructions.js";
import { InstructionBuilder } from "../../src/CPU/instruction-builder.js";
import { registers } from "../../src/CPU/registers.js";

console.log("Instruction Builder");
it("executes LOAD_MEM_REG instruction", () => {
    const memory = new Memory(0x03);
    memory.write8(0x00, 0x02); // Memory address
    memory.write8(0x01, registers.R0); // Register address
    memory.write8(0x02, 0x12); // Memory value
    const cpu = new CPU(memory);
    let address, reg, mem, regs;
    const instructions = {[opcodes.LOAD_MEM_REG]: (a, r, m, rs) => { address = a; reg = r; mem = m; regs = rs; }};
    const instruction = InstructionBuilder.setOpCode(opcodes.LOAD_MEM_REG).setCPU(cpu).setInstructions(instructions).build();
    instruction();
    assert.strictEqual(address, 0x02);
    assert.strictEqual(reg, registers.R0);
    assert.strictEqual(mem, memory);
    assert.strictEqual(regs, cpu.registers);
})

it("executes LOAD_LIT_REG instruction", () => {
    const memory = new Memory(0x02);
    memory.write8(0x00, 0x12); // Literal value
    memory.write8(0x01, registers.R0); // Register address
    const cpu = new CPU(memory);
    let address, value, regs;
    const instructions = {[opcodes.LOAD_LIT_REG]: (v, a, rs) => { address = a; value = v; regs = rs; }};
    const instruction = InstructionBuilder.setOpCode(opcodes.LOAD_LIT_REG).setCPU(cpu).setInstructions(instructions).build();
    instruction();
    assert.strictEqual(address, registers.R0);
    assert.strictEqual(value, 0x12);
    assert.strictEqual(regs, cpu.registers);
})
