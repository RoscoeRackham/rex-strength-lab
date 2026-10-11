const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 9, inf: false, mode: 'comic', action: 'stomp' })); } catch (e) {} });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(1000);
  const r = await page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('svg').forEach(s => s.remove());
    const txt = clone.textContent;
    const svgImgs = [...document.querySelectorAll('svg[role=img]')];
    const res = [];
    for (const s of svgImgs) {
      const vals = [...s.querySelectorAll('text.lbl-strong, text')].map(t => t.textContent.trim()).filter(Boolean);
      res.push({ label: s.getAttribute('aria-label').slice(0, 50), missingOutside: vals.filter(v => !txt.includes(v)).slice(0, 40) });
    }
    const chipLabels = [...document.querySelectorAll('#tier-chips .chip')].map(b => b.textContent);
    return { res, chipLabels };
  });
  console.log(JSON.stringify(r, null, 1));
  // keyboard: tab to first ladder marker and read active element
  await page.focus('svg[role=img] g[role=button]');
  console.log('focused:', await page.evaluate(() => document.activeElement.getAttribute('aria-label')));
  // Chromium playwright accessibility snapshot (uses platform-ish tree?)
  const snap = await page.accessibility.snapshot({ interestingOnly: true });
  let btn = 0, imgs = []; const w = (n) => { if (n.role === 'button' && /Set strength/.test(n.name || '')) btn++; if (n.role === 'img' || n.role === 'image') imgs.push([n.name.slice(0, 40), (n.children || []).length]); (n.children || []).forEach(w); }; w(snap);
  console.log('chromium pw snapshot interestingOnly: ladder buttons', btn, 'imgs', JSON.stringify(imgs));
  for (const tab of ['jump', 'sprint', 'pull']) {
    await page.click('#tab-' + tab); await page.waitForTimeout(200);
    const m = await page.evaluate(() => { const clone = document.querySelector('#bay').cloneNode(true); clone.querySelectorAll('svg').forEach(s => s.remove()); const txt = clone.textContent; return [...document.querySelectorAll('#bay svg[role=img]')].map(s => ({ label: s.getAttribute('aria-label'), missing: [...s.querySelectorAll('text')].map(t => t.textContent.trim()).filter(v => v && !txt.includes(v)) })); });
    console.log(tab, JSON.stringify(m));
  }
  await browser.close();
})();
