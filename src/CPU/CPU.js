import assert from "assert";
import { RegistersBuilder, REGISTER, REGISTER_SIZE } from "./registers.js";
import { Stack } from "../memory/stack.js";
import { Memory } from "../memory/memory.js";
import { OPCODES, instructions } from "./instructions.js";
import { InstructionFactory } from "./instruction-factory.js";

export const PAGE_SIZE = 0x0100;

export function CPUBuilder() {
    this.memorySize = PAGE_SIZE * 256;
    this.stackSize = PAGE_SIZE;
}
Object.assign(CPUBuilder.prototype, {
    setMemorySize: function(memorySize) { this.memorySize = memorySize; return this; },
    setStackSize: function(stackSize) { this.stackSize = stackSize; return this; },
    build: function() {
        assert(this.memorySize >= PAGE_SIZE + this.stackSize, `Memory too small to hold stack, it should be at least ${PAGE_SIZE+this.stackSize} bytes.`);
        const memory = new Memory(this.memorySize);
        const registers = new RegistersBuilder()
            .setMemory(memory)
            .setStartAddress(PAGE_SIZE - REGISTER_SIZE) // End of first page
            .build();
        const stack = new Stack(memory, registers, this.stackSize, PAGE_SIZE);
        const instructionFactory = new InstructionFactory(memory, registers, instructions);
        return new CPU(memory, stack, registers, instructionFactory);
    }
});

export function CPU(memory, stack, registers, instructionFactory) {
    this.memory = memory;
    this.stack = stack;
    this.registers = registers;
    this.instructionFactory = instructionFactory;

    this.reset();
}

CPU.prototype.reset = function () {
    this.registers.writeRegister(REGISTER.PC, 2 * PAGE_SIZE);
    this.registers.blankGeneralRegisters();
    // TODO reset memory
    // TODO reset stack
}

CPU.prototype.loadProgram = function (memory) {
    this.reset();
    const pc = this.registers.readRegister(REGISTER.PC);
    for (let i = 0; i < memory.size; i++) {
        this.memory.write8(i + pc, memory.read8(i));
    }
}

CPU.prototype.fetch = function () {
    const pc = this.registers.readRegister(REGISTER.PC);
    const instruction = this.memory.read8(pc);
    this.registers.writeRegister(REGISTER.PC, pc + 1);
    return instruction;
}

CPU.prototype.fetch16 = function () {
    //Note: this implementation is not 100% accurate to the specs,
    //      as the CPU architecture uses an 8-bit data bus, so we
    //      should call the fetch() function twice rather than read16().
    const pc = this.registers.readRegister(REGISTER.PC);
    const instruction = this.memory.read16(pc);
    this.registers.writeRegister(REGISTER.PC, pc + 2);
    return instruction;
}

CPU.prototype.getNextInstruction = function(opcode) {
    let instructionArgs = [];
    switch (opcode) {
        case OPCODES.LOAD_MEM_REG:
        case OPCODES.LOAD_REG_MEM:
        case OPCODES.LOADW_MEM_REG:
        case OPCODES.LOADW_REG_MEM:
        case OPCODES.LOAD_LIT_REG:
        case OPCODES.LOAD_REG_REG:
        case OPCODES.LOADW_REG_REG:
        case OPCODES.LOAD_LIT_MEM:
        case OPCODES.LOAD_MEM_MEM:
        case OPCODES.LOADW_MEM_MEM:
            instructionArgs = [this.fetch(), this.fetch()];
            break;
        case OPCODES.LOADW_LIT_MEM:
        case OPCODES.LOADW_LIT_REG:
            instructionArgs = [this.fetch16(), this.fetch()];
            break;
        default:
            opcode = OPCODES.NOP;
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
    return this.registers.dumpRegisters();
}
