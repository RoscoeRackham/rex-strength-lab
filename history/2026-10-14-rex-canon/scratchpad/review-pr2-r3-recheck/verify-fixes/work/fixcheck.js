const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/verify-fixes/repo/rex-strength-lab';
const { settle } = require(REPO + '/test/make-page-fixture.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const m of ['base', 'mmath', 'mwalk']) {
    const prev = path.join(__dirname, 'fc-' + m + '.html');
    fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'mut-' + m, 'rex-strength-lab/dist/index.html'), 'utf8') + '</body></html>');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(prev).href);
    const soloTxt = (s) => page.evaluate((sel) => Array.from(document.querySelectorAll('#bay ' + sel)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), s);
    const res = [];
    for (const st of [{ action: 'pull' }, { action: 'pull', obj: 'baseball' }]) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
      const H = await soloTxt('.happens'), M = await soloTxt('details.math');
      const eng = await page.evaluate(() => { const P = window.DinoPhys; return P.MUSCLE.jump.forceFrac; });
      const mathOk = /his feet push with the smaller of his footing, μ × his weight = [\d.,]+ kN, and his legs’ push, 1\.4 × the strength he uses = [\d.,]+ N/.test(M) && !/min\(\(pull − resistance\)/.test(M);
      const w = H.match(/his legs’ push \(([\d.,]+) N, at most 1\.4× the strength he uses\), so they can speed it up by at most ([\d.]+) m\/s²/);
      const walkOk = !!w && Number(w[2]) < 1 && Math.abs(Number(w[2]) - Number(w[1].replace(/,/g, '')) / 3000) / Number(w[2]) < 0.05 && !/his footing \([\d.,]+ kN\) can speed his own body up/.test(H);
      res.push(JSON.stringify(st) + ' mathOk=' + mathOk + ' walkOk=' + walkOk + (w ? ' (' + w[1] + ' N, ' + w[2] + ' m/s²)' : ''));
    }
    console.log(m + ': ' + res.join(' | '));
    await page.close(); fs.unlinkSync(prev);
  }
  await browser.close();
})();
