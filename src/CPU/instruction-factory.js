import assert from "assert";
import { OPCODES } from "./instructions.js";

export function InstructionFactory(memory, registerResolver, instructions) {
    this.memory = memory;
    this.registerResolver = registerResolver;
    this.instructions = instructions;
}
Object.assign(InstructionFactory.prototype, {
    createInstruction: function(opcode, instructionArgs) {
        assert(opcode in this.instructions, `No instruction for opcode: 0x${opcode.toString(16).padStart(2, "0")}`);
        switch (opcode) {
            case OPCODES.LOAD_MEM_REG:
            case OPCODES.LOAD_REG_MEM:
            case OPCODES.LOADW_MEM_REG:
            case OPCODES.LOADW_REG_MEM:
                instructionArgs.push(this.memory, this.registerResolver);
                break;
            case OPCODES.LOAD_LIT_REG:
            case OPCODES.LOAD_REG_REG:
            case OPCODES.LOADW_REG_REG:
            case OPCODES.LOADW_LIT_REG:
                instructionArgs.push(this.registerResolver);
                break;
            case OPCODES.LOAD_LIT_MEM:
            case OPCODES.LOAD_MEM_MEM:
            case OPCODES.LOADW_MEM_MEM:
            case OPCODES.LOADW_LIT_MEM:
                instructionArgs.push(this.memory);
                break;
            default:
                opcode = OPCODES.NOP;
                instructionArgs = [];
                break;
        }
        return {execute: () => this.instructions[opcode](...instructionArgs)};
    }
});
