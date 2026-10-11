const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(390, 844);
  await p.waitForTimeout(1000);
  const ids = await p.evaluate(() => Array.from(document.querySelectorAll('section.sec, section')).map((s) => s.id).filter(Boolean));
  for (const id of ['top', 'empty', 'empty-2', 'meatball'].concat(ids.filter((x) => /empty|gap|meat/.test(x)))) {
    const ok = await p.evaluate((id) => { const e = document.getElementById(id); if (!e) return false; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.3); return true; }, id);
    if (!ok) continue;
    await p.waitForTimeout(300);
    const o = await p.evaluate(() => ({ now: document.getElementById('locNow').textContent, aria: document.getElementById('locTape').getAttribute('aria-label'), role: document.getElementById('locTape').getAttribute('role') }));
    console.log(id, JSON.stringify(o));
  }
  const ax = await p.accessibility.snapshot({ root: await p.$('#locTape') }).catch((e) => String(e));
  console.log('AX', JSON.stringify(ax));
  await browser.close();
})();
