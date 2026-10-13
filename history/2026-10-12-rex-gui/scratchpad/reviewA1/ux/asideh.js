const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(NEW()); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2000);
  for (const [s, p] of [[false, false], [true, false], [false, true], [true, true]]) {
    const r = await page.evaluate(([s, p]) => { document.getElementById('setup').open = s; document.getElementById('powers').open = p; const a = document.querySelector('aside'); const sum = document.querySelector('#powers > summary').getBoundingClientRect().top - a.getBoundingClientRect().top; const bolt = document.getElementById('bolt-ollie').getBoundingClientRect().top - a.getBoundingClientRect().top; return { asideH: Math.round(a.getBoundingClientRect().height), powersSummaryOffset: Math.round(sum), boltOllieOffset: p ? Math.round(bolt) : null, stickyTop: getComputedStyle(a).top, maxH: getComputedStyle(a).maxHeight, overflowY: getComputedStyle(a).overflowY }; }, [s, p]);
    console.log('setup ' + (s ? 'open' : 'closed') + ', powers ' + (p ? 'open' : 'closed'), JSON.stringify(r), '(viewport 900; visible while stuck: offsets < ' + (900 - 12) + ')');
  }
  await b.close();
})();
