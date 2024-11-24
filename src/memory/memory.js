import assert from 'assert';

export function Memory(size) {
    assert(size > 0 && size <= 0x10000, `Memory size must be between 0 and 0x10000: ${size}`);
    this.size = size;
    this.memory = new ArrayBuffer(this.size);
    this.view = new DataView(this.memory);
    this.isLittleEndian = true;
}

Memory.prototype.read8 = function (address) {
    assert(address < this.size, `Memory out of bounds: ${address} >= ${this.size}`);
    return this.view.getUint8(address);
};

Memory.prototype.write8 = function (address, value) {
    assert(address < this.size, `Memory out of bounds: ${address} >= ${this.size}`);
    assert(value >= 0 && value <= 0xff, `Value out of bounds: ${value}`);
    this.view.setUint8(address, value);
};

Memory.prototype.read16 = function (address) {
    assert(address < this.size - 1, `Memory out of bounds: ${address} >= ${this.size - 1}`);
    return this.view.getUint16(address, this.isLittleEndian);
};

Memory.prototype.write16 = function (address, value) {
    assert(address < this.size - 1, `Memory out of bounds: ${address} >= ${this.size - 1}`);
    assert(value >= 0 && value <= 0xffff, `Value out of bounds: ${value}`);
    this.view.setUint16(address, value, this.isLittleEndian);
};

Memory.prototype.dumpBytes = function (address=0, length) {
    const bytes = [];
    if (!length) {
        length = this.size - address;
    }
    for (let i = address; i < Math.min(address + length, this.size); i++) {
        bytes.push(`0x${this.read8(i).toString(16).padStart(2, "0")}`);
    }
    return `0x${address.toString(16).padStart(4, "0")}: ${bytes.join(" ")}`;
};
