const pw = require('./pw');
(async () => {
  const p = await pw.open({ action: 'walk', surface: 'sand', walker: 'both' }, { wait: 4000 });
  // step effort resets each load; set it via its control
  const ctl = await p.evaluate(() => [...document.querySelectorAll('#bay input, #bay select')].map((e) => e.id + ':' + e.type + ':' + e.value + ':' + e.min + '-' + e.max));
  console.log(ctl.join(' | '));
  const id = await p.evaluate(() => { const r = [...document.querySelectorAll('#bay input[type=range]')].find((e) => /step|eff/i.test(e.id)); if (!r) return null; r.value = r.max; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); return r.id; });
  console.log('set', id);
  await p.waitForTimeout(3000);
  const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => (d.open = true)); return [...document.querySelectorAll('#bay .tile, #bay li, #bay p, #bay .status')].map((e) => e.innerText.replace(/\s+/g, ' ')); });
  for (const l of [...new Set(lines)]) if (/print|Footprint|peak|extrapol|350/i.test(l)) console.log('  ', l.slice(0, 400));
  const all = await pw.allText(p);
  console.log('mentions extrapolat:', /extrapolat/i.test(all), '| 99 kPa:', /99 kPa|99–350|99-350/.test(all));
  const m = all.match(/Footprints\s*In sand[^\n]*/); console.log('CARD:', m ? m[0].slice(0, 700) : 'not found');
  await pw.close();
})();
