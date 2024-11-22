const data = {
    LOAD_MEM_REG: {opcode: 0x10, instruction: (memoryAddress, registerAddress, memory, registers) => {
        const value = memory.read8(memoryAddress);
        registers.write8(registerAddress, value);
    }},
    LOAD_LIT_REG: {opcode: 0x11, instruction: (value, registerAddress, registers) => {
        registers.write8(registerAddress, value);
    }},
    LOAD_REG_REG: {opcode: 0x12, instruction: (sourceRegisterAddress, destRegisterAddress, registers) => {
        const value = registers.read8(sourceRegisterAddress);
        registers.write8(destRegisterAddress, value);
    }},
    LOAD_REG_MEM: {opcode: 0x13, instruction: (memoryAddress, registerAddress, memory, registers) => {
        const value = registers.read8(registerAddress);
        memory.write8(memoryAddress, value);
    }},
    LOAD_LIT_MEM: {opcode: 0x14, instruction: (value, memoryAddress, memory) => {
        memory.write8(memoryAddress, value);
    }},
    LOAD_MEM_MEM: {opcode: 0x15, instruction: (sourceMemoryAddress, destMemoryAddress, memory) => {
        const value = memory.read8(sourceMemoryAddress);
        memory.write8(destMemoryAddress, value);
    }},
    LOADW_MEM_REG: {opcode: 0x16, instruction: (memoryAddress, registerAddress, memory, registers) => {
        const value = memory.read16(memoryAddress);
        registers.write16(registerAddress, value);
    }},
    LOADW_LIT_REG: {opcode: 0x17, instruction: (value, registerAddress, registers) => {
        registers.write16(registerAddress, value);
    }},
    LOADW_REG_REG: {opcode: 0x18, instruction: (sourceRegisterAddress, destRegisterAddress, registers) => {
        const value = registers.read16(sourceRegisterAddress);
        registers.write16(destRegisterAddress, value);
    }},
    LOADW_REG_MEM: {opcode: 0x19, instruction: (memoryAddress, registerAddress, memory, registers) => {
        const value = registers.read16(registerAddress);
        memory.write16(memoryAddress, value);
    }},
    LOADW_LIT_MEM: {opcode: 0x1a, instruction: (value, memoryAddress, memory) => {
        memory.write16(memoryAddress, value);
    }},
    LOADW_MEM_MEM: {opcode: 0x1b, instruction: (sourceMemoryAddress, destMemoryAddress, memory) => {
        const value = memory.read16(sourceMemoryAddress);
        memory.write16(destMemoryAddress, value);
    }},

    ADD: {opcode: 0x20, instruction: (firstRegisterAddress, secondRegisterAddress, outRegisterAddress, registers) => {
        const firstValue = registers.read16(firstRegisterAddress);
        const secondValue = registers.read16(secondRegisterAddress);
        // TODO Set flags
        registers.write16(outRegisterAddress, firstValue + secondValue);
    }},
    ADDI: {opcode: 0x21, instruction: (value, registerAddress, registers) => {
        value = registers.read16(registerAddress) + value;
        // TODO Set flags
        registers.write16(registerAddress, value);
    }},
    SUB: {opcode: 0x22, instruction: (firstRegisterAddress, secondRegisterAddress, outRegisterAddress, registers) => {
        const firstValue = registers.read16(firstRegisterAddress);
        const secondValue = registers.read16(secondRegisterAddress);
        // TODO Set flags
        registers.write16(outRegisterAddress, firstValue - secondValue);
    }},
    SUBI: {opcode: 0x23, instruction: (value, registerAddress, registers) => {
        value = registers.read16(registerAddress) - value;
        // TODO Set flags
        registers.write16(registerAddress, value);
    }},
    INC: {opcode: 0x24, instruction: (registerAddress, registers) => {
        const value = registers.read16(registerAddress) + 1;
        // TODO Set flags
        registers.write16(registerAddress, value);
    }},
    DEC: {opcode: 0x25, instruction: (registerAddress, registers) => {
        const value = registers.read16(registerAddress) - 1;
        // TODO Set flags
        registers.write16(registerAddress, value);
    }},

    AND: {opcode: 0x30, instruction: () => {}},
    OR: {opcode: 0x31, instruction: () => {}},
    XOR: {opcode: 0x32, instruction: () => {}},
    NOT: {opcode: 0x33, instruction: () => {}},
    LSH: {opcode: 0x34, instruction: () => {}},
    RSH: {opcode: 0x35, instruction: () => {}},

    CMP: {opcode: 0x40, instruction: () => {}},
    CMP_EQ: {opcode: 0x41, instruction: () => {}},
    CMP_NE: {opcode: 0x42, instruction: () => {}},
    CMP_GT: {opcode: 0x43, instruction: () => {}},
    CMP_LT: {opcode: 0x44, instruction: () => {}},
    CMP_GE: {opcode: 0x45, instruction: () => {}},
    CMP_LE: {opcode: 0x46, instruction: () => {}},

    JMP: {opcode: 0x50, instruction: () => {}},
    JEQ: {opcode: 0x51, instruction: () => {}},
    JNE: {opcode: 0x52, instruction: () => {}},
    JGT: {opcode: 0x53, instruction: () => {}},
    JLT: {opcode: 0x54, instruction: () => {}},
    JGE: {opcode: 0x55, instruction: () => {}},
    JLE: {opcode: 0x56, instruction: () => {}},

    PUSH: {opcode: 0x60, instruction: () => {}},
    POP: {opcode: 0x61, instruction: () => {}},
    CALL: {opcode: 0x62, instruction: () => {}},
    RET: {opcode: 0x63, instruction: () => {}},

    IN: {opcode: 0x70, instruction: () => {}},
    OUT: {opcode: 0x71, instruction: () => {}},

    NOP: {opcode: 0x00, instruction: () => {}},
    RESET: {opcode: 0x01, instruction: () => {}},
    HALT: {opcode: 0x02, instruction: () => {}},
    SET_FLAG: {opcode: 0x03, instruction: () => {}},
    CLR_FLAG: {opcode: 0x04, instruction: () => {}},
};

export const opcodes = Object.keys(data).reduce((acc, key) => Object.assign(acc, {[key]: data[key].opcode}), {});
export const instructions = Object.keys(data).reduce((acc, key) => Object.assign(acc, {[data[key].opcode]: data[key].instruction}), {});
