import assert from "assert";
import { it } from "../it.js";
import { Memory } from "../../src/memory/memory.js";
import { instructions } from "../../src/CPU/instructions.js";

console.log("LOAD_MEM_REG instruction");
it("works as intended", () => {
    const memory = new Memory(0x02);
    memory.write16(0x00, 0x1234);
    const registers = new Memory(0x02);
    instructions.LOAD_MEM_REG(0x00, 0x00, memory, registers);
    assert.strictEqual(registers.read16(0x00), 0x1234);
})

console.log("LOAD_LIT_REG instruction");
it("works as intended", () => {
    const registers = new Memory(0x02);
    instructions.LOAD_LIT_REG(0x1234, 0x00, registers);
    assert.strictEqual(registers.read16(0x00), 0x1234);
})
