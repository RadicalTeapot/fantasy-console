import assert from "assert";
import { Memory } from "../memory/memory.js";
import { registers } from "./registers.js";
import { instructions } from "./instructions.js";

function instructionsMapper() {
    const map = Object.keys(instructions)
        .map(key => [key, NOP])
        .reduce((a, b) => Object.assign(a, b), {});
    map[instructions.LOAD_MEM_REG] = LOAD_MEM_REG;
    return map;
}

function NOP(CPU) {}
function LOAD_MEM_REG(CPU) {
    const address = CPU.fetch16();
    const reg = CPU.fetch();
    const value = CPU.memory.read16(address);
    CPU.registers.write16(reg, value);
}

export function CPU(memory) {
    this.memory = memory;
    this.registers = new Memory(registers._SIZE);
    this.registers.write16(registers.SP, memory.size - 1);
    this.instructions = instructionsMapper();
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
    const instruction = this.fetch();
    assert(instruction in this.instructions, `Unknown instruction: ${instruction}`);
    this.instructions[instruction](this);
}

CPU.prototype.dumpRegisters = function () {
    return Object.keys(registers)
        .filter(key => key !== "_SIZE")
        .map(key => `${key}: 0x${this.registers.read16(registers[key]).toString(16).padStart(4, "0")}`)
        .join("\n");
}
