const { open } = require('./render.js');
(async () => {
  const { browser, p } = await open(1280);
  for (const id of ['hulk_savage', 'darkseid', 'abomination', 'thing', 'arnold_schwarzenegger', 'ansur2_m_p50']) {
    await p.evaluate((id) => { document.querySelector('.fig[data-id="' + id + '"]').click(); }, id);
    await p.waitForFunction(() => /Drawing check/.test(document.getElementById('drawer').textContent), null, { timeout: 30000 }).catch(() => {});
    const t = await p.evaluate(() => { const m = document.getElementById("drawer").textContent.match(/Drawing check:.{0,260}/); return m ? m[0] : '(none)'; });
    console.log(id, '=>', t);
  }
  await browser.close();
})();
