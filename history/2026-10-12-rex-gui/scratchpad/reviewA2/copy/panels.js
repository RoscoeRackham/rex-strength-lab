// Open every sidebar panel and the Rex + Ollie element; dump their text.
const H = require('./harness');
(async () => {
  const b = await H.launch();
  const p = await H.open(b, H.NEW, { duoOpen: true });
  await p.evaluate(() => { for (const d of document.querySelectorAll('aside details, #duo, #ollie-setup')) d.open = true; });
  await H.settle(p, '#duo-bay', 60000);
  console.log('--- ASIDE ---\n' + await p.evaluate(() => document.querySelector('aside').innerText));
  console.log('--- DUO ---\n' + (await p.evaluate(() => document.querySelector('#duo').innerText)).slice(0, 3000));
  // the real-muscle hint
  await p.click('#mode-real');
  await p.waitForTimeout(300);
  console.log('--- REAL HINT ---\n' + await p.evaluate(() => document.querySelector('#mode-hint').textContent));
  // Ollie what-if strength through the UI
  await p.click('#o-own');
  await p.waitForTimeout(300);
  console.log('--- OLLIE OWN ---', await p.evaluate(() => [document.querySelector('#duo-sum').textContent, document.querySelector('#ollie-sum').textContent, document.querySelector('#o-dial').innerText]));
  await p.check('#o-inf');
  await p.waitForTimeout(300);
  console.log('--- OLLIE INF ---', await p.evaluate(() => [document.querySelector('#duo-sum').textContent, document.querySelector('#ollie-sum').textContent]));
  // growth modes
  for (const m of ['gradual', 'instant', 'runaway']) {
    await p.selectOption('#absorb', m);
    await p.waitForTimeout(200);
    console.log('--- GROWTH', m, '---', await p.evaluate(() => document.querySelector('#powers-sum').textContent));
  }
  console.log('errs', p.errs);
  await b.close();
})();
