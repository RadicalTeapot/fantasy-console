import assert from "assert";

export function InstructionFactory(instructions) {
    this.instructions = instructions;
}
Object.assign(InstructionFactory.prototype, {
    createInstruction: function(opcode, ...instructionArgs) {
        assert(opcode in this.instructions, `No instruction for opcode: 0x${opcode.toString(16).padStart(2, "0")}`);
        return {execute: () => this.instructions[opcode](...instructionArgs)};
    }
});
