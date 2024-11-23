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
    R6: 0x02,
    R7: 0x02,
};

const [registers, _SIZE] = Object.keys(registerSizes)
    .reduce((acc, key) => [Object.assign(acc[0], {[key]: acc[1]}), acc[1] + registerSizes[key]], [{}, 0])
export { registers, registerSizes, _SIZE };
