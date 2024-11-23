# Use Powershell instead of sh
set shell := ["powershell", "-NoProfile", "-NonInteractive", "-Command"]

alias s := start
alias r := reload
alias ta := test-all

set quiet

start:
    node src/server.js

reload:
    node src/trigger-refresh.js

test-CPU:
    node tests/CPU/CPU-test.js
    echo ""

test-memory:
    node tests/memory/memory-test.js
    echo ""

test-instructions:
    node tests/CPU/instructions-test.js
    echo ""

test-instruction-factory:
    node tests/CPU/instruction-factory-test.js
    echo ""

test-all: test-CPU test-memory test-instructions test-instruction-factory
