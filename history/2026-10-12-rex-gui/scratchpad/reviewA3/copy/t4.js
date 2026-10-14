const L = require('./lib.js');
(async () => {
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const p = await L.open(b, L.NEW(), { action: 'walk', walker: 'ollie', oM: 30000 });
  const t = await L.waitSettled(p, '#bay');
  console.log(t.slice(0, 3000));
  await b.close();
})();
