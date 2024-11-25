import assert from 'assert';

export function Stack(memory, spRegister, fpRegister, size, address) {
    assert(size > 1 && size <= memory.size, `Stack size must be between 2 and ${memory.size}: ${size}`);
    this.memory = memory;
    this.size = size;
    this.address = address;
    this.spRegister = spRegister;
    this.fpRegister = fpRegister;
    this.reset();
}
Object.assign(Stack.prototype, {
    reset: function () {
        this.spRegister.write(this.address + this.size);
        this.fpRegister.write(this.address + this.size - 1);
    },
    push: function (value) {
        const spAddress = this.spRegister.read() - 1;
        assert(spAddress >= this.address, "Stack overflow");
        this.spRegister.write(spAddress);
        this.memory.write8(spAddress, value);
    },
    push16: function (value) {
        const spAddress = this.spRegister.read() - 2;
        assert(spAddress >= this.address, "Stack overflow");
        this.spRegister.write(spAddress);
        this.memory.write16(spAddress, value);
    },
    pop: function (register) {
        const spAddress = this.spRegister.read();
        assert(spAddress < this.address + this.size, "Stack underflow");
        const value = this.memory.read8(spAddress);
        this.spRegister.write(spAddress+1);
        register.write(value);
    },
    pop16: function (register) {
        const spAddress = this.spRegister.read();
        assert(spAddress < this.address + this.size + 1, "Stack underflow");
        const value = this.memory.read16(spAddress);
        this.spRegister.write(spAddress + 1);
        register.write(value);
    },
    // Debugging functions
    peek: function () {
        const spAddress = this.spRegister.read();
        return this.memory.read8(spAddress);
    },
    peek16: function () {
        const spAddress = this.spRegister.read();
        return this.memory.read16(spAddress);
    },
    poke: function (value) {
        const spAddress = this.spRegister.read();
        this.memory.write8(spAddress, value);
    },
    poke16: function (value) {
        const spAddress = this.spRegister.read();
        this.memory.write16(spAddress, value);
    },
    dumpStack: function () {
        return `Stack -> ${this.memory.dumpBytes(this.address, this.size)}`;
    }
})
