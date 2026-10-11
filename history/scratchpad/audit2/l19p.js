const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const url = 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l19-patched.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  async function run(label, saved, extra) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 120)); });
    await page.goto(url);
    await page.evaluate((s) => { localStorage.clear(); if (s !== undefined) localStorage.setItem('rex-lab-v1', s); }, saved);
    await page.reload();
    await page.waitForTimeout(400);
    if (extra) await extra(page);
    const info = await page.evaluate(() => ({
      dial: document.querySelector('#dial-big').textContent,
      force: document.querySelector('#dial-force').textContent,
      sum: document.querySelector('#setup-sum').textContent,
      comic: document.querySelector('#mode-comic').getAttribute('aria-pressed'),
      real: document.querySelector('#mode-real').getAttribute('aria-pressed'),
      anchorVal: document.querySelector('#anchor').value,
      heightVal: document.querySelector('#height').value,
      massVal: document.querySelector('#mass').value,
      tabsSel: [...document.querySelectorAll('#tabs .tab')].filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.id),
      bay: document.querySelector('#bay').innerText.slice(0, 260).replace(/\n+/g, ' | '),
      stored: localStorage.getItem('rex-lab-v1'),
    }));
    console.log('=== ' + label + ' ===');
    console.log(JSON.stringify(info, null, 1));
    if (errs.length) console.log('ERRORS', errs.slice(0, 4));
    await ctx.close();
  }
  await run('baseline (no storage)', undefined);
  await run('action fly', '{"action":"fly"}');
  await run('mode cartoon', '{"mode":"cartoon"}');
  await run('anchor glued', '{"anchor":"glued"}');
  await run('H 1e6', '{"H":1000000}');
  await run('logKg null', '{"logKg":null}');
  await run('m null', '{"m":null}');
  await run('UI: mass 1e400 then reload', undefined, async (page) => {
    await page.evaluate(() => { document.querySelector('#setup').open = true; });
    await page.fill('#mass', '1e400');
    await page.press('#mass', 'Enter');
    await page.locator('#mass').blur();
    await page.waitForTimeout(300);
    console.log('  after typing 1e400, bay:', (await page.locator('#bay').innerText()).slice(0, 200).replace(/\n+/g, ' | '));
    console.log('  stored:', await page.evaluate(() => localStorage.getItem('rex-lab-v1')));
    await page.reload(); await page.waitForTimeout(400);
  });
  await browser.close();
})();
