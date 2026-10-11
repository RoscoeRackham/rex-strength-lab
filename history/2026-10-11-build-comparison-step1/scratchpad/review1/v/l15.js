const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const p = await open(b, { width: 1280, height: 900, skel: 'host', fonts: false });
  await p.waitForTimeout(1500);
  let chooser = 0; p.on('filechooser', () => chooser++);
  const before = await p.evaluate(() => ({ v: document.getElementById('tExample').value, name: document.getElementById('sheetName').textContent, status: document.getElementById('toolStatus').textContent.slice(0, 80), rows: document.getElementById('results').rows.length }));
  await p.focus('#tExample');
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(500);
  const after = await p.evaluate(() => ({ v: document.getElementById('tExample').value, name: document.getElementById('sheetName').textContent, rows: document.getElementById('results').rows.length, sel: document.getElementById('tExample').selectedOptions[0].textContent }));
  console.log('before', JSON.stringify(before)); console.log('after ArrowDown: filechooser events =', chooser, JSON.stringify(after));
  // re-select the already selected option: does change fire? (dispatch only if value differs, emulate by setting same value)
  let changes = 0; await p.evaluate(() => { window.__ch = 0; document.getElementById('tExample').addEventListener('change', () => window.__ch++); });
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); // already on last option
  console.log('ArrowDown on last option: change events =', await p.evaluate(() => window.__ch), 'filechooser =', chooser);
  await b.close();
})();
