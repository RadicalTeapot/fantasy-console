import assert from 'assert';
import { REGISTER } from '../CPU/registers.js';

export function Stack(memory, registers, size, address) {
    assert(size > 1 && size <= memory.size, `Stack size must be between 1 and ${memory.size}: ${size}`);
    this.memory = memory;
    this.size = size;
    this.address = address;
    this.registers = registers;
    this.registers.writeRegister(REGISTER.SP, this.size - 1);
    this.registers.writeRegister(REGISTER.FP, this.size - 2);
}
Object.assign(Stack.prototype, {
    dumpStack: function () {
        return `Stack -> ${this.memory.dumpBytes(this.address, this.size)}`;
    }
})
