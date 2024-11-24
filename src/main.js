import { CPUBuilder } from "./CPU/CPU.js";

const cpu = new CPUBuilder()
    .setMemorySize(0x1000)
    .setStackSize(0x100)
    .build();
