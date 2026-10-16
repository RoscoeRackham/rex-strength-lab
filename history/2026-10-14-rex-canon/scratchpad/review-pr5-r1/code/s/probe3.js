const run = require('./pw.js');
run(async ({ load, tile }) => { await load({}); console.log('default Throw tile on this page:', JSON.stringify(await tile('bay'))); });
