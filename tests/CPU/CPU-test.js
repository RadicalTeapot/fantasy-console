import assert from "assert";
import { it } from "../it.js";
import { CPU } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";
import { instructions } from "../../src/CPU/instructions.js";
import { registers } from "../../src/CPU/registers.js";

it("Executes LOAD_MEM_REG instruction", () => {
    const memory = new Memory(0x10);
    memory.write8(0x00, instructions.LOAD_MEM_REG);
    memory.write16(0x01, 0x04);
    memory.write8(0x03, registers.R1);
    memory.write16(0x04, 0x1234);
    const cpu = new CPU(memory);
    // console.log(cpu.dumpRegisters());
    // console.log(memory.dumpBytes());
    cpu.execute();
    // console.log(cpu.dumpRegisters());
    // console.log(memory.dumpBytes());
    assert.strictEqual(cpu.registers.read16(registers.R1), 0x1234);
})

