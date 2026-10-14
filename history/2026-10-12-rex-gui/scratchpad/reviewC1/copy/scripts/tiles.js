const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto(url);
  const out = [];
  for (const mode of ['comic','real']) for (const action of ['punch','clap','stomp']) for (let logKg=1; logKg<=34; logKg+= (process.argv[2]?Number(process.argv[2]):1)) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action, logKg, mode });
    await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay');
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => [t.querySelector('.k')&&t.querySelector('.k').textContent, t.querySelector('.v')&&t.querySelector('.v').textContent, t.querySelector('.s')&&t.querySelector('.s').textContent]));
    const eff = await page.evaluate(() => { const e = document.querySelector('#bay .effort-read'); return e ? e.textContent.slice(0,120) : ''; });
    const cmp = t.find(x => x[0]==='Compared with'); const en = t.find(x => /^Energy/.test(x[0]));
    out.push({mode, action, logKg, energy: en, cmp: cmp && cmp[1]});
    console.log(mode, action, logKg, '|', en && en.join(' / '), '|', cmp && cmp[1]);
  }
  fs.writeFileSync(OUT+'/tiles.json', JSON.stringify(out, null, 1));
  console.log('errors', errs);
  await browser.close();
})();
