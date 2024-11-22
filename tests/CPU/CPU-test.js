import assert from "assert";
import { it } from "../it.js";
import { CPU } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { registers } from "../../src/CPU/registers.js";

it("can write 8-bit values to registers", () => {
    const cpu = new CPU(new Memory(0x10));
    cpu.registers.write8(registers.R0, 0x12);
    assert.strictEqual(cpu.registers.read16(registers.R0), 0x0012);
})
