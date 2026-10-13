const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await openPage(b, 'branch', { action: 'throw', duoAction: 'arm', duoOpen: true });
  await waitIdle(page, '#duo-bay', 30000);
  const info = await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((e) => { const anc = []; let p = e.parentElement; while (p && p.id !== 'bay' && p.id !== 'duo-bay') { anc.push(p.tagName + (p.className ? '.' + p.className.replace(/ /g, '.') : '') + (p.tagName === 'DETAILS' ? '[open=' + p.open + ']' : '')); p = p.parentElement; } return (p ? p.id : '?') + ': visible=' + !!e.offsetParent + ' ' + anc.join(' < '); }));
  console.log(info.join('\n'));
  await ctx.close(); await b.close();
})();
