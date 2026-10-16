const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  const tiles = (bay) => page.evaluate((b) => Array.from(document.querySelectorAll('#' + b + ' .tiles')).map((row) => Array.from(row.children).map((t) => t.innerText.replace(/\n/g, ' | ').replace(/ /g, ' ')).join('  ##  ')), bay);
  for (const [lab, st] of [['Throw car inf', { action: 'throw', obj: 'car', inf: true }], ['Stomp inf', { action: 'stomp', inf: true }]]) {
    await load(st, 'allout');
    console.log('=== ' + lab); for (const r of await tiles('bay')) console.log(r);
    const v = (await text('#bay .verdict')) || ''; console.log('verdict:', v.slice(0, 300));
  }
  for (const ob of ['car', 'baseball', 'person']) {
    await load({ duoOpen: true, duoAction: 'catch', cObj: ob, cStyle: 'hard', cLogD: 1, inf: true }, 'allout');
    const t = await text('#duo-bay');
    console.log('=== catch ' + ob + ' fastball inf');
    for (const l of t.split('\n')) if (/∞|unbounded|Unbounded|no physical answer/.test(l)) console.log('  ' + l.slice(0, 500));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
