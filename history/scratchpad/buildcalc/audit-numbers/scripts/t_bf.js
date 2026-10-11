const run = require('./page.js');
async function snap(p, label) {
  const s = await p.evaluate(() => ({
    stats: Array.from(document.querySelectorAll('#stats > div')).map(d => d.innerText.replace(/\s+/g, ' ')).join(' || '),
    w: document.getElementById('wBig').innerText + ' ' + document.getElementById('wChip').innerText,
    chest: document.querySelector('#girths li[data-site="chest"]').innerText.replace(/\s+/g, ' ').slice(0, 160),
    hHint: document.getElementById('hHint').innerText,
    fields: [document.getElementById('hFt').value, document.getElementById('hIn').value, document.getElementById('hCm').value].join('/')
  }));
  console.log('--', label); console.log(JSON.stringify(s, null, 1));
}
run(async (p) => {
  for (const [id, units] of [['ansur2_m_p50', 'imperial'], ['ronnie_coleman', 'metric']]) {
    if (units === 'metric') await p.click('#uMet'); 
    await p.selectOption('#buildSelect', id);
    await p.waitForTimeout(100);
    await snap(p, id + ' ' + units + ' before');
    await p.fill('#bfIn', '12');
    await p.dispatchEvent('#bfIn', 'input');
    await p.waitForTimeout(100);
    await snap(p, id + ' ' + units + ' after typing body fat 12');
  }
});
