const { open, load, text } = require('./pg.js');
const fs = require('fs');
const state = JSON.parse(process.argv[2] || '{}'), tag = process.argv[3] || 'default';
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const { browser, page, errs } = await open();
  let out = '';
  for (const t of SOLO) { await load(page, state, t); out += '\n\n######## ' + t + '\n' + (await text(page, 'bay')); }
  for (const t of DUO) { await load(page, state, t, true); out += '\n\n######## duo ' + t + '\n' + (await text(page, 'duo-bay')); }
  fs.writeFileSync(__dirname + '/dump-' + tag + '.txt', out);
  console.log('errs', errs);
  await browser.close();
})();
