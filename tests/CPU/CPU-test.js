import assert from "assert";
import { it } from "../it.js";

import { CPUBuilder, PAGE_SIZE } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { OPCODES } from "../../src/CPU/instructions.js";
import { REGISTER } from "../../src/CPU/registers.js";

function buildCPU() {
    return new CPUBuilder().setMemorySize(PAGE_SIZE * 3).setStackSize(PAGE_SIZE).build();
}

console.log("CPU");
it("can write 8-bit values to registers", () => {
    const cpu = buildCPU();
    cpu.registers.writeRegister(REGISTER.R0, 0x12);
    assert.strictEqual(cpu.registers.readRegister(REGISTER.R0), 0x12);
})

it("executes program in memory", () => {
    const memory = new Memory(0x03);
    memory.write8(0x00, OPCODES.LOAD_LIT_REG); // Literal value
    memory.write8(0x01, 0x12); // Literal value
    memory.write8(0x02, REGISTER.R0); // Register address

    const cpu = buildCPU(memory);
    cpu.loadProgram(memory);
    cpu.execute();

    assert.strictEqual(cpu.registers.readRegister(REGISTER.R0), 0x12);
})
