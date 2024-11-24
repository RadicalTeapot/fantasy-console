import assert from "assert";

const registers = ["PC", "SP", "FP", "R0", "R1", "R2", "R3", "R4", "R5"];
const resolvableRegisters = ["R0", "R1", "R2", "R3", "R4", "R5"];
export const REGISTER = registers.reduce((acc, key) => Object.assign(acc, {[key]: key}), {});

export function RegistersFactory(memory, addressResolver) {
    this.memory = memory;
    this.addressBuilder = addressResolver;
    this.registers = {};
    this.registerResolver = [];
    this.size = 0;
}
Object.assign(RegistersFactory.prototype, {
    addRegister: function (size, name) {
        assert(registers.includes(name), `Invalid register name: ${name}`);
        assert(name, "Name not set");
        assert(size == 1 || size == 2, "Size must be 1 or 2 bytes");

        const address = this.addressBuilder.reserveAddress(size, `register ${name}`);
        this.size += size;
        this.registers[name] = this.size === 1
            ? new ByteRegister(this.memory, address, this.name)
            : new WordRegister(this.memory, address, this.name);
        if (resolvableRegisters.includes(name)) this.registerResolver.push(this.registers[name]);
        return this;
    },
    finalize: function (expectedSize) {
        assert(this.size === expectedSize, `Expected ${expectedSize} bytes, but only have ${this.size} bytes`);
        return {registers: this.registers, resolver: this.registerResolver};
    }
})

function BaseRegister(memory, address, name) {
    assert(memory.size >= address + 1, `Memory too small to hold register, requires ${address + 1} bytes, but only has ${memory.size - address} bytes left`);
    this.memory = memory;
    this.address = address;
    this.name = name;
}

export function ByteRegister(memory, address, name) {BaseRegister.call(this, memory, address, name);}
Object.assign(ByteRegister.prototype, {
    read: function () {
        return this.memory.read8(this.address);
    },
    write: function (value) {
        this.memory.write8(this.address, value);
    },
    dump: function () {
        return `${this.name}: 0x${this.read().toString(16).padStart(2, "0")}`;
    }
});

export function WordRegister(memory, address, name) {BaseRegister.call(this, memory, address, name);}
Object.assign(WordRegister.prototype, {
    read: function () {
        return this.memory.read16(this.address);
    },
    write: function (value) {
        this.memory.write16(this.address, value);
    },
    dump: function () {
        return `${this.name}: 0x${this.read().toString(16).padStart(4, "0")}`;
    }
});
