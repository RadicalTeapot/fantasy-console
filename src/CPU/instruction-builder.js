import assert from "assert";
import { opcodes, instructions } from "./instructions.js";

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
    build: function() {
        switch (this.opcode) {
            case opcodes.LOAD_MEM_REG:
                {
                    const address = this.CPU.fetch16();
                    const reg = this.CPU.fetch();
                    return () => instructions.LOAD_MEM_REG(address, reg, this.CPU.memory, this.CPU.registers);
                }
            case opcodes.LOAD_LIT_REG:
                {
                    const value = this.CPU.fetch16();
                    const reg = this.CPU.fetch();
                    return () => instructions.LOAD_LIT_REG(value, reg, this.CPU.registers);
                }
            default:
                { return () => instructions.NOP(); }
        }
    }
});
