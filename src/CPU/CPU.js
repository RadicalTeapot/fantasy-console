import assert from "assert";
import { AddressResolver } from "../memory/address-resolver.js";
import { RegistersFactory, REGISTER } from "./registers.js";
import { Stack } from "../memory/stack.js";
import { Memory } from "../memory/memory.js";
import { OPCODES, instructions } from "./instructions.js";
import { InstructionFactory } from "./instruction-factory.js";
import { StackFrameBuilder } from "../memory/stack-frame.js";

export function CPUBuilder() {
    this.pageSize = 0x100;
    this.memoryPages = 0x100;
    this.stackPages = 1;
}
Object.assign(CPUBuilder.prototype, {
    setPageSize: function(pageSize) { this.pageSize = pageSize; return this; },
    setMemoryPages: function(memoryPages) { this.memoryPages = memoryPages; return this; },
    setStackPages: function(stackPages) { this.stackPages = stackPages; return this; },
    setAddressResolver: function(addressResolver) { this.addressResolver = addressResolver; return this; },
    build: function() {
        const registerSize = 0x10;
        assert(this.pageSize >= registerSize, `Page size must be at least ${registerSize} bytes: ${this.pageSize}`);

        const memorySize = this.memoryPages * this.pageSize;
        const stackSize = this.stackPages * this.pageSize;
        if (!this.addressResolver)
            this.addressResolver = new AddressResolver(memorySize);

        const memory = new Memory(memorySize);
        this.addressResolver.reserveAddress(this.pageSize - registerSize, "RAM"); // First page minus registers size for RAM
        const { registers, resolver } = new RegistersFactory(memory, this.addressResolver)
            .addRegister(2, REGISTER.PC)
            .addRegister(1, REGISTER.SP)
            .addRegister(1, REGISTER.FP)
            .addRegister(2, REGISTER.R0)
            .addRegister(2, REGISTER.R1)
            .addRegister(2, REGISTER.R2)
            .addRegister(2, REGISTER.R3)
            .addRegister(2, REGISTER.R4)
            .addRegister(2, REGISTER.R5)
            .finalize(registerSize);

        const stackAddress = this.addressResolver.reserveAddress(stackSize, "stack");
        assert(stackAddress % this.pageSize == 0, `Stack should be paged aligned: ${stackAddress}`);
        const stack = new Stack(memory, registers.SP, registers.FP, stackSize, stackAddress);

        const instructionFactory = new InstructionFactory(memory, resolver, instructions);
        const programAddressStart = this.addressResolver.finalize();
        return new CPU(memory, stack, registers.PC, instructionFactory, programAddressStart);
    }
});

export function CPU(memory, stack, pcRegister, instructionFactory, programAddressStart) {
    this.memory = memory;
    this.stack = stack;
    this.pcRegister = pcRegister;
    this.instructionFactory = instructionFactory;
    this.programAddressStart = programAddressStart;

    this.reset();
}

CPU.prototype.reset = function() {
    this.pcRegister.write(this.programAddressStart);
    // TODO blank general purpose registers
    // TODO reset memory
    this.stack.reset();
}

CPU.prototype.loadProgram = function(memory) {
    this.reset();
    const pc = this.pcRegister.read();
    for (let i = 0; i < memory.size; i++) {
        this.memory.write8(i + pc, memory.read8(i));
    }
    // TODO: Should I load a HALT instruction at the end of the program?
}

CPU.prototype.fetch = function() {
    const pc = this.pcRegister.read();
    const instruction = this.memory.read8(pc);
    this.pcRegister.write(pc + 1);
    return instruction;
}

CPU.prototype.fetch16 = function() {
    //Note: this implementation is not 100% accurate to the specs,
    //      as the CPU architecture uses an 8-bit data bus, so we
    //      should call the fetch() function twice rather than read16().
    const pc = this.pcRegister.read();
    const instruction = this.memory.read16(pc);
    this.pcRegister.write(pc + 2);
    return instruction;
}

CPU.prototype.getNextInstruction = function(opcode) {
    let instructionArgs = [];
    switch (opcode) {
        case OPCODES.LOAD_MEM_REG:
        case OPCODES.LOAD_REG_MEM:
        case OPCODES.LOAD_LIT_REG:
        case OPCODES.LOAD_REG_REG:
        case OPCODES.LOAD_LIT_MEM:
        case OPCODES.LOAD_MEM_MEM:
        case OPCODES.LOADW_MEM_REG:
        case OPCODES.LOADW_REG_MEM:
        case OPCODES.LOADW_REG_REG:
        case OPCODES.LOADW_MEM_MEM:
            instructionArgs = [this.fetch(), this.fetch()];
            break;
        case OPCODES.LOADW_LIT_MEM:
        case OPCODES.LOADW_LIT_REG:
            instructionArgs = [this.fetch16(), this.fetch()];
            break;
        case OPCODES.CALL:
            {
                const jumpAddress = this.fetch16();
                const argumentCount = this.fetch();
                const stackFrameBuilder = new StackFrameBuilder().setPC(this.pcRegister.read());
                for (let i = 0; i < argumentCount; i++)
                    stackFrameBuilder.setFunctionArgument(this.fetch16());
                instructionArgs = [jumpAddress, this.stack, stackFrameBuilder];
                this.pcRegister.write(jumpAddress);
            }
            break;
        default:
            opcode = OPCODES.NOP;
            instructionArgs = [];
            break;
    }
    return this.instructionFactory.createInstruction(opcode, instructionArgs);
}

CPU.prototype.execute = function() {
    const opcode = this.fetch();
    this.getNextInstruction(opcode).execute();
}

CPU.prototype.dumpRegisters = function() {
    return this.registers.dumpRegisters();
}
