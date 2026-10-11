const { open, S } = require('./h.js');
(async () => {
  for (const w of [390, 1280]) {
    const { browser, p } = await open(w, 900);
    await p.waitForTimeout(500);
    // put the target images in view without starting the tool? The observer has a 900px margin, so check before start is impossible; capture at 'Drawing…'
    await p.evaluate(() => { window.__log = []; const ts = document.getElementById('targetStatus'); new MutationObserver(() => window.__log.push([Math.round(performance.now()), ts.textContent.slice(0, 40), !!document.getElementById('tgtFront').getAttribute('src')])).observe(ts, { childList: true, characterData: true, subtree: true }); });
    await p.evaluate(() => document.getElementById('tgtFront').scrollIntoView({ block: 'center' }));
    await p.waitForFunction(() => /Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 30000 });
    const st = await p.evaluate(() => { const i = document.getElementById('tgtFront'); const r = i.getBoundingClientRect(); return { src: i.getAttribute('src'), nw: i.naturalWidth, complete: i.complete, inView: r.top < innerHeight && r.bottom > 0, h: Math.round(r.height) }; });
    console.log(w, 'at Drawing…', JSON.stringify(st));
    await p.screenshot({ path: S + '/target-empty-' + w + '.png' });
    await p.waitForFunction(() => !!document.getElementById('tgtFront').getAttribute('src'), null, { timeout: 60000 });
    console.log(' log', JSON.stringify(await p.evaluate(() => window.__log)));
    // after a refused target
    await p.fill('#tTarget', '900'); await p.selectOption('#tShape', { index: 0 });
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    console.log(' after 900:', await p.evaluate(() => document.getElementById('targetStatus').textContent.slice(0, 120)), await p.evaluate(() => document.getElementById('tgtFront').getAttribute('src') ? 'has src' : 'no src'));
    await browser.close();
  }
})();
