 # Fantasy console

A simple 8-bit fantasy console and a JavaScript emulator.

## Usage

- Run: `npm run start`
- Open your browser at `http://localhost:8080`

## Testing

Run `npm run test` to run tests.

## Hot-reloading

The server exposes a websocket endpoint for hot-reloading. To use it run `npm run reload`.

## Design

### Registers

6 general purpose 16-bit registers called `R0`, `R1`, `R2`, `R3`, `R4`, `R5`.

| Register | Address | Size (bytes) |
|----------|---------|--------------|
| PC       | 0x00F0  | 2            |
| SP       | 0x00F2  | 1            |
| FP       | 0x00F3  | 1            |
| R0       | 0x00F4  | 2            |
| R1       | 0x00F6  | 2            |
| R2       | 0x00F8  | 2            |
| R3       | 0x00FA  | 2            |
| R4       | 0x00FC  | 2            |
| R5       | 0x00FE  | 2            |

### Memory

Memory size is 64kB, divided into pages of 256 bytes.
Most of the first page is reserved for general purpose RAM, with only the last 16 bytes reserved for registers.
The second page is reserved for the stack.
Program memory starts on third page.

Layout:

| Address range   | Description         |
|-----------------|---------------------|
| 0x0000 - 0x00EF | General purpose RAM |
| 0x00F0 - 0x00FF | Registers           |
| 0x0100 - 0x01FF | Stack               |
| 0x0200 - 0xFFFF | Program             |

