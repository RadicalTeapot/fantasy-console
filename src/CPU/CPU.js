import { Memory } from "../memory/memory.js";
import { registers } from "./registers.js";
import { opcodes } from "./instructions.js";

export function CPU(memory, registersMemory, instructionFactory) {
    this.memory = memory;
    this.registers = registersMemory;
    this.instructionFactory = instructionFactory;

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

CPU.prototype.getNextInstruction = function(opcode) {
    let instructionArgs = [];
    switch (opcode) {
        case opcodes.LOAD_MEM_REG:
        case opcodes.LOAD_REG_MEM:
        case opcodes.LOADW_MEM_REG:
        case opcodes.LOADW_REG_MEM:
        case opcodes.LOAD_LIT_REG:
        case opcodes.LOAD_REG_REG:
        case opcodes.LOADW_REG_REG:
        case opcodes.LOAD_LIT_MEM:
        case opcodes.LOAD_MEM_MEM:
        case opcodes.LOADW_MEM_MEM:
            instructionArgs = [this.fetch(), this.fetch()];
            break;
        case opcodes.LOADW_LIT_MEM:
        case opcodes.LOADW_LIT_REG:
            instructionArgs = [this.fetch16(), this.fetch()];
            break;
        default:
            opcode = opcodes.NOP;
            instructionArgs = [];
            break;
    }
    return this.instructionFactory.createInstruction(opcode, instructionArgs);
}

CPU.prototype.execute = function () {
    const opcode = this.fetch();
    this.getNextInstruction(opcode).execute();
}

CPU.prototype.dumpRegisters = function () {
    return Object.keys(registers)
        .map(key => `${key}: 0x${this.registers.read16(registers[key]).toString(16).padStart(4, "0")}`)
        .join("\n");
}

