const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(1280, 900);
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => {
    const o = {};
    o.limitsVerdict = document.getElementById('limitsVerdict').textContent;
    o.limitsSub = document.getElementById('limitsSub').textContent;
    o.cards = Array.from(document.querySelectorAll('#limitCards .limit')).map((c) => c.innerText.replace(/\n+/g, ' / '));
    o.notes = Array.from(document.querySelectorAll('.limitnote')).map((n) => { const s = n.closest('section'); return (s && s.id) + ': ' + n.innerText; });
    o.gaps = Array.from(document.querySelectorAll('section')).filter((s) => /sooner|test/.test(s.innerText) && s.querySelector('.gaptile')).map((s) => s.id + ': ' + s.innerText.replace(/\n+/g, ' / ').slice(0, 1500));
    o.pos = {}; ['limits'].concat(Array.from(document.querySelectorAll('.limitnote')).map((n) => n.closest('section').id)).forEach((id) => { const e = document.getElementById(id); if (e) o.pos[id] = Math.round(e.getBoundingClientRect().top + scrollY); });
    return o;
  });
  console.log(JSON.stringify(t, null, 1));
  await browser.close();
})();
