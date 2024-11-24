import assert from "assert";
import { it } from "../it.js";

import { Memory } from "../../src/memory/memory.js";
import { OPCODES } from "../../src/CPU/instructions.js";
import { InstructionFactory } from "../../src/CPU/instruction-factory.js";
import { ByteRegister } from "../../src/CPU/registers.js";

console.log("Instruction factory");
it("builds LOAD_MEM_REG instruction", () => {
    const registers = [new ByteRegister(new Memory(0x01), 0x00, "R0")];
    const memory = new Memory(0x02);
    memory.write8(0x01, 0x02);
    let address, reg, mem, regs;
    const instructions = {[OPCODES.LOAD_MEM_REG]: (a, r, m, rs) => { address = a; reg = r; mem = m; regs = rs; }};
    const factory = new InstructionFactory(memory, registers, instructions);
    factory.createInstruction(OPCODES.LOAD_MEM_REG, [0x01, 0x00]).execute();
    assert.strictEqual(address, 0x01);
    assert.strictEqual(reg, 0x00);
    assert.strictEqual(mem, memory);
    assert.strictEqual(regs, registers);
})

it("executes LOAD_LIT_REG instruction", () => {
    const memory = new Memory(0x01);
    const registers = [new ByteRegister(memory, 0x00, "R0")];
    let address, value, regs;
    const instructions = {[OPCODES.LOAD_LIT_REG]: (v, a, rs) => { address = a; value = v; regs = rs; }};
    const factory = new InstructionFactory(memory, registers, instructions);
    factory.createInstruction(OPCODES.LOAD_LIT_REG, [0x12, 0x00]).execute();
    assert.strictEqual(address, 0x00);
    assert.strictEqual(value, 0x12);
    assert.strictEqual(regs, registers);
})
