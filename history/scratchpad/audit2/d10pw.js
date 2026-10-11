const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const intro = document.querySelector('#sources .intro').textContent;
    const summary = document.querySelector('#src-summary').textContent;
    const rows = [...document.querySelectorAll('#src-table tbody tr')].map(tr => tr.textContent);
    const body = document.body.innerText;
    const tableText = rows.join('\n');
    const has = (re) => ({ page: re.test(body), table: re.test(tableText) });
    const feats = [...document.querySelectorAll('#feat-groups *')].map(e => e.textContent).filter(t => /474\.5|20 tons in 2007|log-press/.test(t)).slice(-3);
    const ladder = document.querySelector('#ladder-viz').innerHTML;
    return { intro, summary, nrows: rows.length, n231: has(/231 kg/), n474: has(/474\.5/), n20: has(/20 tons/), ladder231: /231 kg/.test(ladder), ladder474: /474\.5/.test(ladder), ladder2007: /2007 profile/.test(ladder), feats: feats.map(s=>s.slice(0,300)) };
  });
  console.log(JSON.stringify(r, null, 1));
  // try to find tier detail interaction: hover/click on ladder items
  const titles = await p.evaluate(() => [...document.querySelectorAll('#ladder-viz title, #ladder-viz [data-detail], #ladder-viz [aria-label]')].map(e => e.textContent || e.getAttribute('aria-label')).filter(t => /231|474|2007/.test(t)));
  console.log('ladder tooltips', titles);
  await b.close();
})();
