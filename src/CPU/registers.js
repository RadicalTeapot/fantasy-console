import assert from "assert";
import { Memory } from "../memory/memory.js";

// 16 bytes
const registerSizes = {
    PC: 0x02,
    SP: 0x01,
    FP: 0x01,

    R0: 0x02,
    R1: 0x02,
    R2: 0x02,
    R3: 0x02,
    R4: 0x02,
    R5: 0x02,
};

const {offsets, size, runningSize: totalSize, indices: REGISTER} = Object.keys(registerSizes)
    .reduce((acc, key, i) => {
        return {
            runningSize: acc.runningSize + registerSizes[key],
            offsets: acc.offsets.concat([acc.runningSize]),
            size: acc.size.concat([registerSizes[key]]),
            indices: Object.assign(acc.indices, {[key]: i})
        };
    }, {offsets: [], size: [], runningSize: 0, indices: {}});

export function RegistersBuilder() {
    this.startAddress = 0x00;
}
Object.assign(RegistersBuilder.prototype, {
    setMemory: function (memory) {
        this.memory = memory;
        return this;
    },
    setStartAddress: function (address) {
        this.startAddress = address;
        return this;
    },
    build: function () {
        if (!this.memory) this.memory = new Memory(totalSize + this.startAddress);
        return new Registers(this.memory, this.startAddress);
    }
});

export function Registers(memory, address) {
    assert(memory.size >= totalSize + address, `Memory too small to hold registers, requires ${totalSize} bytes, but only has ${memory.size - address} bytes left`);
    this.memory = memory;
    this.startAddress = address;
    this.readMethods = [null, this.memory.read8.bind(this.memory), this.memory.read16.bind(this.memory)];
    this.writeMethods = [null, this.memory.write8.bind(this.memory), this.memory.write16.bind(this.memory)];
}
Object.assign(Registers.prototype, {
    blankGeneralRegisters: function () {
        this.writeRegister(REGISTER.R0, 0x00);
        this.writeRegister(REGISTER.R1, 0x00);
        this.writeRegister(REGISTER.R2, 0x00);
        this.writeRegister(REGISTER.R3, 0x00);
        this.writeRegister(REGISTER.R4, 0x00);
        this.writeRegister(REGISTER.R5, 0x00);
    },
    readRegister: function (register) {
        // console.log(`Read register: Reading from ${register}`);
        return this.readMethods[size[register]](this.startAddress + offsets[register]);
    },
    writeRegister: function (register, value) {
        // console.log(`Write register: Writing 0x${value.toString(16).padStart(4, "0")} to ${register}`);
        this.writeMethods[size[register]](this.startAddress + offsets[register], value);
    },
    dumpRegisters: function () {
        const dump = Object.keys(REGISTER)
            .map(key => `${key}: 0x${this.readRegister(REGISTER[key]).toString(16).padStart(4, "0")}`)
            .join(" ");
        return `Registers -> ${dump}`;
    }
});

export { REGISTER, totalSize as REGISTER_SIZE };
