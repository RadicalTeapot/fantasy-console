import assert from "assert";

export function AddressResolver(maxSize = 0x10000) {
    this.address = 0x0000;
    this.maxSize = maxSize;
}
Object.assign(AddressResolver.prototype, {
    reserveAddress: function (size, type) {
        assert(this.address + size <= this.maxSize, `Memory allocation too large for ${type}: ${this.address + size} > ${this.maxSize}`);
        const start = this.address;
        this.address += size;
        return start;
    },
    finalize: function () {
        return this.address;
    }
})

