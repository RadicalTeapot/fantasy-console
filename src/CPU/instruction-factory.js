import assert from "assert";
import { opcodes } from "./instructions.js";

export function InstructionFactory(memory, registers, instructions) {
    this.memory = memory;
    this.registers = registers;
    this.instructions = instructions;
}
Object.assign(InstructionFactory.prototype, {
    createInstruction: function(opcode, instructionArgs) {
        assert(opcode in this.instructions, `No instruction for opcode: 0x${opcode.toString(16).padStart(2, "0")}`);
        switch (opcode) {
            case opcodes.LOAD_MEM_REG:
            case opcodes.LOAD_REG_MEM:
            case opcodes.LOADW_MEM_REG:
            case opcodes.LOADW_REG_MEM:
                instructionArgs.push(this.memory, this.registers);
                break;
            case opcodes.LOAD_LIT_REG:
            case opcodes.LOAD_REG_REG:
            case opcodes.LOADW_REG_REG:
            case opcodes.LOADW_LIT_REG:
                instructionArgs.push(this.registers);
                break;
            case opcodes.LOAD_LIT_MEM:
            case opcodes.LOAD_MEM_MEM:
            case opcodes.LOADW_MEM_MEM:
            case opcodes.LOADW_LIT_MEM:
                instructionArgs.push(this.memory);
                break;
            default:
                opcode = opcodes.NOP;
                instructionArgs = [];
                break;
        }
        return {execute: () => this.instructions[opcode](...instructionArgs)};
    }
});
