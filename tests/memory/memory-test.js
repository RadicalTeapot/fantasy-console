import assert from "assert";
import { it } from "../it.js";
import { Memory } from "../../src/memory/memory.js";

console.log("Memory tests");
it("throws if memory size is out of bounds", () => {
    assert.throws(() => {
        new Memory(0);
    });
    assert.throws(() => {
        new Memory(0x10001);
    });
})

it("throws if memory read8 is out of bounds", () => {
    const mem = new Memory(0x01);
    assert.throws(() => {
        mem.read8(0x01);
    });
})

it("throws if memory read16 is out of bounds", () => {
    const mem = new Memory(0x02);
    assert.throws(() => {
        mem.read16(0x01);
    });
})

it("throws if memory write8 is out of bounds", () => {
    const mem = new Memory(0x01);
    assert.throws(() => {
        mem.write8(0x01, 0x01);
    });
})

it("throws if memory write8 value is out of bounds", () => {
    const mem = new Memory(0x01);
    assert.throws(() => {
        mem.write8(0x00, -1);
    });
    assert.throws(() => {
        mem.write8(0x00, 0x100);
    });
})

it("throws if memory write16 is out of bounds", () => {
    const mem = new Memory(0x02);
    assert.throws(() => {
        mem.write16(0x01, 0x01);
    });
})

it("throws if memory write16 value is out of bounds", () => {
    const mem = new Memory(0x02);
    assert.throws(() => {
        mem.write16(0x00, -1);
    });
    assert.throws(() => {
        mem.write16(0x00, 0x10000);
    });
})

it("initialize memory", () => {
    const mem = new Memory(0x02);
    assert.equal(mem.read8(0x00), 0x00);
    assert.equal(mem.read8(0x01), 0x00);
})

it("reads and writes bytes", () => {
    const mem = new Memory(0x01);
    mem.write8(0x00, 0x01);
    assert.equal(mem.read8(0x00), 0x01);
})

it("reads and writes words", () => {
    const mem = new Memory(0x02);
    mem.write16(0x00, 0x0102);
    assert.equal(mem.read16(0x00), 0x0102);
})

it("dumps bytes", () => {
    const mem = new Memory(0x04);
    mem.write8(0x00, 0x01);
    mem.write8(0x01, 0x02);
    mem.write8(0x02, 0x03);
    mem.write8(0x03, 0x04);
    return mem.dumpBytes();
})
