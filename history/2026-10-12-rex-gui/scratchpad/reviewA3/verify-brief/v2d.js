const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + D + '/branch.html');
  // Ollie heavier (3,500 kg) than Rex (3,007 kg), on sand, Wrestle push
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand', oSame: false, oM: 3500 })); });
  await p.reload(); await p.waitForTimeout(3000);
  const out = await p.evaluate(() => { const st = JSON.parse(localStorage.getItem('rex-lab-v1')); const t = document.body.innerText; return { m: st.m, oM: st.oM, oSame: st.oSame, verdict: [...document.querySelectorAll('.verdict')].map(e => e.textContent)[1], chips: t.match(/(Rex|Ollie) holds [^\n]*/g), heavier: t.match(/Equal bodies[^\n]*/g), oMfield: document.querySelector('#o-m, #oM, input[id*=o-mass], input[id^=o-m]')?.value, olliemass: (document.querySelector('#duo')||document.body).innerText.match(/3,500 kg|3500/g) }; });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
