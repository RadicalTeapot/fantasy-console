import assert from "assert";
import { opcodes } from "./instructions.js";

export const InstructionBuilder = Object.assign({}, {
    setOpCode: function(opcode) {
        assert(opcode in Object.values(opcodes), `Unknown opcode: 0x${opcode.toString(16).padStart(2, "0")}`);
        this.opcode = opcode;
        return this;
    },
    setCPU: function(CPU) {
        this.CPU = CPU;
        return this;
    },
    setInstructions: function(instructions) {
        this.instructions = instructions;
        return this;
    },
    build: function() {
        let instructionArgs = [];
        switch (this.opcode) {
            case opcodes.LOAD_MEM_REG:
            case opcodes.LOAD_REG_MEM:
            case opcodes.LOADW_MEM_REG:
            case opcodes.LOADW_REG_MEM:
                instructionArgs = [this.CPU.fetch(), this.CPU.fetch(), this.CPU.memory, this.CPU.registers];
                break;
            case opcodes.LOAD_LIT_REG:
            case opcodes.LOAD_REG_REG:
            case opcodes.LOADW_REG_REG:
                instructionArgs = [this.CPU.fetch(), this.CPU.fetch(), this.CPU.registers];
                break;
            case opcodes.LOAD_LIT_MEM:
            case opcodes.LOAD_MEM_MEM:
            case opcodes.LOADW_MEM_MEM:
                instructionArgs = [this.CPU.fetch(), this.CPU.fetch(), this.CPU.memory];
                break;
            case opcodes.LOADW_LIT_MEM:
                instructionArgs = [this.CPU.fetch16(), this.CPU.fetch(), this.CPU.memory];
                break;
            case opcodes.LOADW_LIT_REG:
                instructionArgs = [this.CPU.fetch16(), this.CPU.fetch(), this.CPU.registers];
                break;
            default:
                this.opcode = opcodes.NOP;
                instructionArgs = [];
                break;
        }
        return () => this.instructions[this.opcode](...instructionArgs);
    }
});
