// load the engine and data from a lab dir: const { P, D } = require('./load.js')(dir)
module.exports = (dir) => { global.window = global.window || {}; const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js'); return { P, D: window.DINO_DATA }; };
