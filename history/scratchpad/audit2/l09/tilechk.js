const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true })).newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await page.waitForTimeout(1200);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'stomp', logKg: 20, mode: 'comic', inf: false })));
  await page.reload(); await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const v = [...document.querySelectorAll('#bay .tile .v')].find((x) => /Krakatoa/.test(x.textContent));
    const cs = getComputedStyle(v);
    const codes = [...v.textContent].map((c) => c.charCodeAt(0).toString(16)).join(' ');
    const w = v.clientWidth;
    // measure word widths
    const span = document.createElement('span'); span.style.font = cs.font; span.style.whiteSpace = 'nowrap'; document.body.append(span);
    const m = (s) => { span.textContent = s; return span.getBoundingClientRect().width; };
    const res = { w, font: cs.font, textWrap: cs.textWrap || cs.getPropertyValue('text-wrap-style'), wordBreak: cs.wordBreak, ow: cs.overflowWrap, codes, html: v.innerHTML, '1883 Krakatoa': m('1883 Krakatoa'), 'Krakatoa eruption': m('Krakatoa eruption'), 'Krakatoa': m('Krakatoa'), '51× the 1883': m('51× the 1883') };
    // try alternative
    v.style.overflowWrap = 'break-word';
    const rects = v.getClientRects(); res.heightAnywhere = null; res.heightBreakWord = v.getBoundingClientRect().height;
    v.style.overflowWrap = ''; res.heightAnywhere = v.getBoundingClientRect().height;
    return res;
  });
  console.log(r);
  await browser.close();
})();
