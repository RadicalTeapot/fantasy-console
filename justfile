# Use Powershell instead of sh
set shell := ["powershell", "-NoProfile", "-NonInteractive", "-Command"]

set quiet

start:
    node src/server.js

reload:
    node src/trigger-refresh.js

test-CPU:
    node tests/CPU/CPU-test.js

test-memory:
    node tests/memory/memory-test.js

test-instructions:
    node tests/CPU/instructions-test.js

tests: test-CPU test-memory test-instructions
