const { open } = require('./harness.js');
(async () => {
  for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const { browser, p } = await open({ viewport: vp });
    const paint = await p.evaluate(() => performance.getEntriesByType('paint').map((e) => e.name + ' ' + Math.round(e.startTime)));
    const lt = await p.evaluate(() => new Promise((res) => { const out = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => out.push(Math.round(e.startTime) + '+' + Math.round(e.duration)))).observe({ type: 'longtask', buffered: true }); } catch (e) {} setTimeout(() => res(out), 6000); }));
    const nav = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { responseEnd: Math.round(n.responseEnd), domInteractive: Math.round(n.domInteractive), dcl: Math.round(n.domContentLoadedEventEnd) }; });
    console.log(vp.width, 'paint', paint, 'nav', nav, 'long tasks (start+duration ms)', lt);
    await browser.close();
  }
})();
