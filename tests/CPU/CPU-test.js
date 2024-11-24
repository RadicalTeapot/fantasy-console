import assert from "assert";
import { it } from "../it.js";

import { CPUBuilder } from "../../src/CPU/CPU.js";
import { Memory } from "../../src/memory/memory.js";

function buildCPU() {
    return new CPUBuilder()
        .setPageSize(0x20)
        .setMemoryPages(3)
        .setStackPages(1)
        .build();
}

console.log("CPU");
it("has valid initial state", () => {
    const cpu = buildCPU();
    assert.strictEqual(cpu.pcRegister.read(), cpu.programAddressStart);
})

it("resets the program counter when loading memory", () => {
    const cpu = buildCPU();
    cpu.loadProgram(new Memory(0x01));
    assert.strictEqual(cpu.pcRegister.read(), cpu.programAddressStart);
})

it("loads the program into memory at the correct address", () => {
    const cpu = buildCPU();
    const memory = new Memory(0x02);
    memory.write16(0x00, 0x1234);
    cpu.loadProgram(memory);
    assert.strictEqual(cpu.memory.read16(cpu.pcRegister.read()), 0x1234);
})

it("increments the program counter on fetch", () => {
    const cpu = buildCPU();
    cpu.loadProgram(new Memory(0x01));
    cpu.fetch();
    assert.strictEqual(cpu.pcRegister.read(), cpu.programAddressStart + 1);
})

it("increments the program counter twice on fetch16", () => {
    const cpu = buildCPU();
    cpu.loadProgram(new Memory(0x02));
    cpu.fetch16();
    assert.strictEqual(cpu.pcRegister.read(), cpu.programAddressStart + 2);
})
