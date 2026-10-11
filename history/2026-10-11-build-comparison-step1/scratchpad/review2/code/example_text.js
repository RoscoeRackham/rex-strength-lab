const { open } = require('../harness.js');
(async () => {
  const h = await open({});
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
  console.log(await p.evaluate(() => document.getElementById('toolStatus').textContent));
  console.log(await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).map((r) => r.textContent).filter((t) => /^(Score|Mass|Volume)/.test(t)).join(' | ')));
  console.log(await p.evaluate(() => { const b = window.__bc.LIST.find((e) => e.id === 'ansur2_m_p50'); return 'p50 height ' + b.height.value + ', chart girths chest ' + b.girths.chest.value; }));
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
