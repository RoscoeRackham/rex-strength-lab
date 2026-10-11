const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/n1/fixed.html');
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#src-table tbody tr')];
    const withSrc = rows.filter(r => r.cells[3].textContent.trim());
    return {
      summary: document.querySelector('#src-summary').textContent,
      rows: rows.length, withSrc: withSrc.length,
      anchors: document.querySelectorAll('#src-table a').length,
      leadingComma: withSrc.filter(r => r.cells[3].textContent.startsWith(',')).length,
      samples: rows.filter(r => /Air heat|Anderson|log|deadlift/i.test(r.cells[0].textContent)).slice(0,5).map(r => [r.cells[0].textContent.slice(0,60), r.cells[3].innerHTML.slice(0,300)]),
      first: withSrc[0] && withSrc[0].cells[3].innerHTML.slice(0,300),
    };
  });
  console.log(JSON.stringify(r, null, 1), errs);
  await b.close();
})();
