const { open } = require('../harness.js');
(async () => {
  const h = await open({});
  const { p } = h;
  for (const id of ['hulk_savage', 'thor', 'abomination', 'ronnie_coleman']) {
    const t = await p.evaluate((id) => { document.querySelector('.fig[data-id="' + id + '"]').click(); const d = document.getElementById('drawer'); const i = d.textContent.indexOf("Drawing check"); return i < 0 ? "(none)" : d.textContent.slice(i, i + 230); }, id);
    console.log(id, '->', t);
  }
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
