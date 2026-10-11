const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 390, h: 800, state: {}, wait: 3000 });
  console.log(process.env.FONTS ? 'proxy' : 'no proxy', await page.evaluate(async () => { await document.fonts.ready; const s = {}; for (const f of document.fonts) s[f.family + ' ' + f.weight + ' ' + f.status] = (s[f.family + ' ' + f.weight + ' ' + f.status] || 0) + 1; return JSON.stringify(s); }));
  await ctx.close(); await close();
})();
