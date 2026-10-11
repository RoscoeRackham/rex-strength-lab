const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true })).newPage();
  await page.goto(process.env.URL || 'file:///home/user/dino-strength-sim/dist/preview.html'); await page.waitForTimeout(1200);
  const seen = new Map();
  const states = [];
  for (let lk = 2.708; lk <= 32; lk += 1.5) {
    for (const a of ['lift', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) states.push({ action: a, logKg: lk, obj: 'car' });
    for (const o of ['baseball', 'bowling', 'car', 'bus', 'titanic', 'nimitz', 'pyramid']) states.push({ action: 'throw', logKg: lk, obj: o });
  }
  for (const mode of ['comic', 'real']) for (const s of states) {
    await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ mode: st.mode, inf: false, angle: 45, surface: 'concrete', H: 2, m: 180, anchor: 'friction', groundHolds: false }, st))), Object.assign({ mode }, s));
    await page.reload(); await page.waitForTimeout(120);
    const res = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('#bay .tile .v').forEach((v) => {
        const tn = []; const walk = (n) => { if (n.nodeType === 3) tn.push(n); else n.childNodes.forEach(walk); }; walk(v);
        let prevTop = null, prevCh = null, line = '';
        for (const n of tn) for (let i = 0; i < n.length; i++) {
          const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
          const rc = r.getClientRects()[0]; if (!rc) continue; const ch = n.data[i];
          if (prevTop != null && rc.top > prevTop + 4 && !/\s/.test(ch) && prevCh && !/\s/.test(prevCh)) out.push(v.textContent.slice(0, i) + '|' + v.textContent.slice(i));
          if (!/\s/.test(ch)) prevTop = rc.top; prevCh = ch;
        }
      });
      return out;
    });
    for (const t of res) { const k = t.replace(/[\d.,]+/g, '#'); if (!seen.has(k)) { seen.set(k, 1); console.log(mode, s.action, s.obj, s.logKg.toFixed(3), JSON.stringify(t)); } }
  }
  await browser.close();
})();
