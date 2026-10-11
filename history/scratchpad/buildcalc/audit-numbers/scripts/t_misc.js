const run = require('./page.js');
run(async (p) => {
  await p.selectOption('#buildSelect', 'captain_america');
  await p.waitForTimeout(100);
  console.log('CAP notes:', (await p.innerText('#bNotes')).split('\n').filter(l => /Edition|Height/.test(l)).join('\n'));
  await p.selectOption('#buildSelect', 'ansur2_f_p5');
  await p.waitForTimeout(100);
  console.log('F p5 FFMI stat:', (await p.innerText('#stats')).replace(/\s+/g, ' '));
  console.log('F p5 FFMI note:', await p.innerText('#ffmiNote'));
  const ticks = await p.evaluate(() => Array.from(document.querySelectorAll('#ffmiScale .tl, #ffmiScale .tick, #ffmiScale .me')).map(e => (e.className + ' ' + (e.getAttribute('title') || e.innerText) + ' @' + e.style.left)));
  console.log('F p5 scale:', ticks.join(' | '));
  await p.selectOption('#buildSelect', 'ansur2_m_p50');
  await p.waitForTimeout(100);
  const rc = await p.innerText('#revOut');
  console.log('REV (imperial):', rc.split('\n').slice(0, 8).join(' / '));
});
