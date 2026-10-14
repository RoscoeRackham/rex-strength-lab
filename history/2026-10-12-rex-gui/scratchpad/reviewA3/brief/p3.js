const { NEW, OLD, launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 800], [1280, 900], [1440, 900], [1920, 1080]]) {
    for (const [name, url] of [['new', NEW], ['old', OLD]]) {
      const p = await open(b, url, null, { w, h });
      const r = await p.evaluate((name) => {
        const a = document.querySelector('aside');
        const vis = (id) => { const n = document.getElementById(id); if (!n) return null; const r = n.getBoundingClientRect(), ar = a.getBoundingClientRect(); return { top: Math.round(r.top), visible: r.top >= 0 && r.top < innerHeight && r.top < ar.bottom }; };
        return { asideH: Math.round(a.getBoundingClientRect().height), scrollH: a.scrollHeight, clientH: a.clientHeight, overflowY: getComputedStyle(a).overflowY,
          ground: vis(name === 'new' ? 'ground-sec' : 'surface'), powers: vis(name === 'new' ? 'powers' : 'comic-setup'), mass: vis('mass') };
      }, name);
      console.log(w + 'x' + h, name, JSON.stringify(r));
      if (w === 1280 && h === 800) await p.screenshot({ path: `${name}-1280x800.png` });
      // can page scrolling alone reveal Their powers? scroll the page to the bottom of the rig
      const r2 = await p.evaluate((name) => { const rig = document.querySelector('.rig'); window.scrollTo(0, rig.getBoundingClientRect().bottom + scrollY - innerHeight); const n = document.getElementById(name === 'new' ? 'powers' : 'comic-setup').getBoundingClientRect(); return { top: Math.round(n.top), bottom: Math.round(n.bottom), vh: innerHeight }; }, name);
      console.log('   page scrolled to rig end ->', JSON.stringify(r2));
      await p.close();
    }
  }
  await b.close();
})();
