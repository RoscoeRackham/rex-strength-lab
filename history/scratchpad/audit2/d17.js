const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  await p.goto(url);
  for (const [action, logKg] of [['stomp', Math.log10(511)], ['punch', Math.log10(511)], ['clap', Math.log10(511)], ['jump', Math.log10(511)], ['punch', 9], ['clap', 12]]) {
    await p.evaluate(([a, l]) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: a, logKg: l })); }, [action, logKg]);
    await p.reload();
    await p.waitForTimeout(600);
    const txt = await p.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(s => /pitch|killed|Houses collapse|Lung|Eardrum|Windows|Compared/i.test(s));
    console.log('==', action, logKg.toFixed(3));
    console.log(lines.slice(0, 20).join('\n'));
    const svgtxt = await p.evaluate(() => Array.from(document.querySelectorAll('svg')).map(s => s.textContent).filter(t => /killed/.test(t)).join(' | '));
    console.log('SVG:', svgtxt.slice(0, 400));
  }
  await b.close();
})();
