const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  for (const st of [{ action: 'throw', obj: 'baseball', angle: 30 }, { action: 'throw', obj: 'baseball', angle: 30, keepForm: false }, { action: 'throw', anchor: 'bolted' }, { action: 'throw', anchor: 'bolted', ownRecoil: false }, { action: 'throw', surface: 'sand' }, { action: 'throw', surface: 'sand', unbreakable: false }]) {
    await W.load(st);
    const t = await W.text('#bay .effort-read');
    console.log(JSON.stringify(st), '=>', (t.match(/Courtesy ceiling:[^]*?(?=At this effort|Where each|$)/) || [''])[0]);
  }
  await W.close();
})();
