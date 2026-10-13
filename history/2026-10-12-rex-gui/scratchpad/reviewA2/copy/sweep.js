// Every tab in both bays across footing/switch states: collect text, search for retired wording, save texts.
const fs = require('fs');
const H = require('./harness');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const BAD = /dug|claws? in|braced|bracing|settings|comic switch|rex alone|sidebar|ollie panel|kicked|footholds|shear/i;
(async () => {
  const b = await H.launch();
  const states = {
    std: {},
    rexB: { anchor: 'bolted' },
    ollB: { oAnchor: 'bolted' },
    both: { anchor: 'bolted', oAnchor: 'bolted' },
    bothCG: { anchor: 'bolted', oAnchor: 'bolted', groundHolds: true },
    sandRexB: { anchor: 'bolted', surface: 'sand' },
    sand: { surface: 'sand' },
    clay: { surface: 'softclay' },
  };
  const out = {};
  const p = await H.open(b, H.NEW, { duoOpen: true });
  const surfaces = await p.evaluate(() => window.DINO_DATA.surfaces.map((s) => s.id));
  console.log('surfaces', surfaces);
  await p.context().close();
  for (const [sn, s] of Object.entries(states)) {
    if (s.surface && !surfaces.includes(s.surface)) { s.surface = surfaces.find((x) => x.includes(s.surface.split('_')[0])); }
    for (const t of SOLO) {
      const pg = await H.open(b, H.NEW, Object.assign({ action: t, duoOpen: false }, s));
      await H.settle(pg, '#bay', 40000);
      const txt = await pg.evaluate(() => document.querySelector('#bay').textContent);
      out[sn + ':' + t] = txt;
      const m = txt.match(new RegExp('.{0,100}(' + BAD.source + ').{0,100}', 'gi'));
      if (m) console.log(sn, t, 'BAD:', m.join(' || '));
      if (pg.errs.length) console.log(sn, t, 'ERRS', pg.errs);
      await pg.context().close();
    }
    for (const t of DUO) {
      for (const extra of (t === 'wrestle' ? ['push', 'shove', 'lift', 'throw'].map((w) => ({ wrestleMove: w })) : t === 'collide' ? [{ colMode: 'charge' }, { colMode: 'push' }] : [{}])) {
        const pg = await H.open(b, H.NEW, Object.assign({ duoAction: t, duoOpen: true }, s, extra));
        await H.settle(pg, '#duo-bay', 60000);
        const txt = await pg.evaluate(() => document.querySelector('#duo-bay').textContent);
        const key = sn + ':' + t + (extra.wrestleMove ? '-' + extra.wrestleMove : extra.colMode ? '-' + extra.colMode : '');
        out[key] = txt;
        const m = txt.match(new RegExp('.{0,100}(' + BAD.source + ').{0,100}', 'gi'));
        if (m) console.log(key, 'BAD:', m.join(' || '));
        if (pg.errs.length) console.log(key, 'ERRS', pg.errs);
        await pg.context().close();
      }
    }
    console.log('done', sn);
  }
  fs.writeFileSync(H.S + '/sweep.json', JSON.stringify(out, null, 1));
  await b.close();
})();
