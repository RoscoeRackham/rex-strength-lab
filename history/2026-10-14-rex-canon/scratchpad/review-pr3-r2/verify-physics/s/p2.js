const run = require('./page.js');
(async () => {
  const res = await run([
    { name: 'throw 5.5 angle 0', state: { action: 'throw', obj: 'person', logKg: 5.5, angle: 0 }, effort: 'allout' },
    { name: 'catch miss 8 D100 air0', state: { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 2, logKg: 8, airAbsorb: 0 }, effort: 'allout' },
  ]);
  for (const r of res) { const m = r.text.match(/(They land at|If Ollie misses)[^.]*\.[^.]*\.[^.]*\.[^.]*\.[^.]*\.[^.]*\./); console.log(r.name, '\n  ', m && m[0]); const ap = r.text.match(/Tops out[^.]*|apex[^.]*/i); console.log('   ', ap && ap[0].slice(0,120)); }
})();
