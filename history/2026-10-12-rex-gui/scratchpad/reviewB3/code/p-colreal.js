const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  for (const st of JSON.parse(process.argv[3])) {
    await W.load(Object.assign({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' }, st), 'duo-bay');
    await W.settle('duo-bay');
    await W.pick('#duo-effort', 'ground', 'duo-bay');
    const eff = await W.text('#duo-bay .effort-read');
    const chips = await W.page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .status-row .status')).map((n) => n.textContent.trim()));
    const all = await W.text('#duo-bay');
    console.log('\n== ' + JSON.stringify(st) + '\nEFFORT: ' + eff + '\nCHIPS: ' + chips.join(' | ') + '\nshake mentions in bay: ' + ((all.match(/[^.]*shak[^.]*\./g) || []).join(' // ')));
    // the same at the plaster preset with real ground? and the effort at which plaster cracks with powers on
  }
  console.log('errors', W.errs);
  await W.close();
})();
