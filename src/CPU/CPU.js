import { Memory } from "../memory/memory.js";
import { registers } from "./registers.js";
import { InstructionBuilder } from "./instruction-builder.js";

export function CPU(memory) {
    this.memory = memory;
    this.registers = new Memory(registers._SIZE);
    this.registers.write16(registers.SP, memory.size - 1);
}

CPU.prototype.fetch = function () {
    const pc = this.registers.read16(registers.PC);
    const instruction = this.memory.read8(pc);
    this.registers.write16(registers.PC, pc + 1);
    return instruction;
}

CPU.prototype.fetch16 = function () {
    //Note: this implementation is not 100% accurate to the specs,
    //      as the CPU architecture uses an 8-bit data bus, so we
    //      should call the fetch() function twice rather than read16().
    const pc = this.registers.read16(registers.PC);
    const instruction = this.memory.read16(pc);
    this.registers.write16(registers.PC, pc + 2);
    return instruction;
}

CPU.prototype.execute = function () {
    const opcode = this.fetch();
    const instruction = InstructionBuilder.setOpCode(opcode).setCPU(this).build();
    instruction();
}

CPU.prototype.dumpRegisters = function () {
    return Object.keys(registers)
        .filter(key => key !== "_SIZE")
        .map(key => `${key}: 0x${this.registers.read16(registers[key]).toString(16).padStart(4, "0")}`)
        .join("\n");
}

