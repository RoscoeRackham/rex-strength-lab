const { NEW, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const st of [{ oAnchor: 'bolted', anchor: 'bolted' }, { oAnchor: 'bolted', anchor: 'friction' }]) {
    const p = await open(b, NEW, Object.assign({ duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'ollie', colSrc: 'sprint', colBounce: 'bounce', surface: 'ice' }, st), { wait: 1500 });
    await settle(p, 'duo-bay');
    console.log(JSON.stringify(st));
    console.log(' VERDICT:', await txt(p, '#duo-bay .verdict'));
    console.log(' TILES:', await txt(p, '#duo-bay .tiles'));
    const t = await txt(p, '#duo-bay .happens');
    console.log(' HAPPENS:', t && t.slice(0, 900));
    await p.close();
  }
  await b.close();
})();
