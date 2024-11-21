export function it(name, fn) {
    try {
        const ret = fn();
        console.log(`It ${name}: \x1b[32m✓\x1b[0m`);
        if (ret !== undefined) console.log(ret);
    } catch (e) {
        console.error(`It ${name}: \x1b[31m✗\x1b[0m: ${e.message}`);
    }
}
