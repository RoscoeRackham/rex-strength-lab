global.window = global;
const P = require('./lab/src/engine.js');
require('./lab/src/data.js');
module.exports = { P, D: global.DINO_DATA };
