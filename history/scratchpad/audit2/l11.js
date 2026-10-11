const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 9, inf: false, mode: 'comic', action: 'stomp' })); } catch (e) {} });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const out = {};
    const imgs = [...document.querySelectorAll('svg[role=img]')];
    out.imgs = imgs.map(s => ({ label: s.getAttribute('aria-label'), focusables: s.querySelectorAll('[tabindex]').length, texts: [...s.querySelectorAll('text')].map(t => t.textContent).slice(0, 30) }));
    return out;
  });
  console.log(JSON.stringify(info, null, 1).slice(0, 4000));
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const byId = new Map(nodes.map(n => [n.nodeId, n]));
  const imgNodes = nodes.filter(n => n.role && n.role.value === 'image' && !n.ignored);
  for (const n of imgNodes) {
    const kids = []; const walk = (id, d) => { const x = byId.get(id); if (!x) return; if (x !== n && !x.ignored) kids.push((x.role && x.role.value) + ':' + ((x.name && x.name.value) || '').slice(0, 60)); (x.childIds || []).forEach(c => walk(c, d + 1)); };
    walk(n.nodeId, 0);
    console.log('IMG', JSON.stringify(n.name && n.name.value), 'exposed descendants:', kids.length, kids.slice(0, 8));
  }
  const buttons = nodes.filter(n => !n.ignored && n.role && n.role.value === 'button' && n.name && /Set strength here/.test(n.name.value));
  console.log('ladder buttons exposed in chromium:', buttons.length);
  // axe
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] }); return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, targets: v.nodes.slice(0, 3).map(x => x.target.join(' ') + ' :: ' + x.failureSummary.slice(0, 200)) })); });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
