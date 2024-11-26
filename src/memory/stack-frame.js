import assert from 'assert';

export function StackFrameBuilder() {
    this.registers = [];
    this.funcArgs = [];
}
Object.assign(StackFrameBuilder.prototype, {
    setPC: function (value) { this.pc = value; return this; },
    setRegister: function (value) { this.registers.push(value); return this; },
    setFunctionArgument: function (value) { this.funcArgs.push(value); return this; }, //Note: function arguments are assumed to be 16-bit values
    build: function () {
        assert(this.pc !== undefined, "PC must be set");
        return new StackFrame(this.pc, this.registers, this.funcArgs);
    }
});

export function StackFrame(pc, registers, functionArguments) {
    this.pc = pc;
    this.registers = registers;
    this.functionArguments = functionArguments;
}
StackFrame.prototype.getBytes = function () {
    // + 2 for PC, + 1 for argument count, + 1 for register count, + 1 for size
    const size = this.registers.length * 2 + this.functionArguments.length * 2 + 5;
    assert(size <= 0xFF, `Stack frame too large: ${size}`);

    const bytes = new Uint8Array(size);
    let index = 0;

    this.functionArguments.forEach(value => {
        bytes[index++] = value & 0xff;
        bytes[index++] = (value >> 8) & 0xff;
    });
    bytes[index++] = this.functionArguments.length;

    this.registers.forEach(value => {
        bytes[index++] = value & 0xff;
        bytes[index++] = (value >> 8) & 0xff;
    });
    bytes[index++] = this.registers.length;

    bytes[index++] = this.pc & 0xff;
    bytes[index++] = (this.pc >> 8) & 0xff;
    bytes[index++] = size;

    return bytes;
};
