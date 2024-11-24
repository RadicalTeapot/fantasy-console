import assert from 'assert';

export function Stack(memory, spRegister, fpRegister, size, address) {
    assert(size > 1 && size <= memory.size, `Stack size must be between 1 and ${memory.size}: ${size}`);
    this.memory = memory;
    this.size = size;
    this.address = address;
    this.spRegister = spRegister;
    this.fpRegister = fpRegister;
    this.reset();
}
Object.assign(Stack.prototype, {
    reset: function () {
        this.spRegister.write(this.address + this.size - 1);
        this.fpRegister.write(this.address + this.size - 2);
    },
    dumpStack: function () {
        return `Stack -> ${this.memory.dumpBytes(this.address, this.size)}`;
    }
})
