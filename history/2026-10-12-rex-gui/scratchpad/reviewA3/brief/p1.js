const { NEW, OLD, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const w of [1280, 390]) {
    const p = await open(b, NEW, null, { w, h: w === 390 ? 844 : 900 });
    const r = await p.evaluate(() => {
      const aside = document.querySelector('aside');
      const kids = Array.from(aside.children).map((n) => n.tagName + '#' + n.id + '.' + n.className);
      return { kids, powersSum: document.getElementById('powers-sum').textContent, setupSum: document.getElementById('setup-sum').textContent, ollieSum: document.getElementById('ollie-sum').textContent, duoSum: document.getElementById('duo-sum').textContent, setupOpen: document.getElementById('setup').open, powersOpen: document.getElementById('powers').open, duoOpen: document.getElementById('duo').open,
        duoSumRect: (() => { const r = document.getElementById('duo-sum').getBoundingClientRect(); return [r.height, getComputedStyle(document.getElementById('duo-sum')).lineHeight]; })(),
        tabsLabel: document.getElementById('tabs').getAttribute('aria-label'), duoTabsLabel: document.getElementById('duo-tabs').getAttribute('aria-label'),
        tabs: Array.from(document.querySelectorAll('#tabs .tab')).map((t) => t.textContent), duoTabs: Array.from(document.querySelectorAll('#duo-tabs .tab')).map((t) => t.textContent),
        mainLabel: document.querySelector('main').getAttribute('aria-label'), bayHead: document.querySelector('main h2') ? document.querySelector('main h2').textContent : null,
        duoNextToMain: document.querySelector('main').nextElementSibling && document.querySelector('main').nextElementSibling.id,
        saved: localStorage.getItem('rex-lab-v1') };
    });
    console.log(w, JSON.stringify(r, null, 1));
    await p.close();
  }
  // old page structure for comparison
  const o = await open(b, OLD, null);
  console.log('OLD setup-sum', await o.evaluate(() => document.getElementById('setup-sum').textContent), '| comic-sum', await o.evaluate(() => document.getElementById('comic-sum').textContent), '| ollie-sum', await o.evaluate(() => document.getElementById('ollie-sum').textContent));
  console.log('OLD main heading?', await o.evaluate(() => document.querySelector('main').getAttribute('aria-label')));
  await b.close();
})();
