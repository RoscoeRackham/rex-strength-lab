// Fresh visit and reload with saved settings: does every tab open least disruptive?
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText));
async function survey(page, label) {
  const SOLO = ['walk', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  for (const t of SOLO.concat(DUO)) {
    const duo = DUO.includes(t);
    await page.click(duo ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + t);
    for (let i = 0; i < 150; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    const r = await page.evaluate(() => {
      const bay = document.querySelector('#bay');
      const sel = bay.querySelector('#effort, #duo-effort');
      const rd = bay.querySelector('.effort-read');
      const chips = [...bay.querySelectorAll('.status')].map((s) => s.innerText.trim());
      const st = bay.querySelector('#step-effort');
      return { sel: sel && sel.value, step: st && st.value, read: rd && rd.innerText.replace(/\n/g, ' | ').slice(0, 260), chips: chips.join(' ; ').slice(0, 300), verdict: (bay.querySelector('.verdict') || {}).innerText };
    });
    console.log(label, t, JSON.stringify(r));
  }
}
(async () => {
  const b = await launch();
  {
    const { ctx, page, errs } = await open(b, 390, 844, 'light', { wait: 1500 });
    await survey(page, 'FRESH');
    console.log('errs', errs);
    await ctx.close();
  }
  {
    const saved = { effort: 'allout', effortLogKg: 9, stepEffort: 1, duoEffort: 'allout', oEffortOwn: true, absorb: 'runaway', growWhat: 'sun', near: Number(process.argv[2] || 1000), gThrow: 1e6, gJump: 1e5, gSprint: 3e7, gPull: 0.01, softLanding: false };
    const { ctx, page, errs } = await open(b, 390, 844, 'light', { wait: 1500, storage: JSON.stringify(saved) });
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    console.log('state after load', JSON.stringify({ effort: st.effort, stepEffort: st.stepEffort, duoEffort: st.duoEffort, oEffortOwn: st.oEffortOwn, absorb: st.absorb, growWhat: st.growWhat, near: st.near, gThrow: st.gThrow, gJump: st.gJump }));
    await survey(page, 'RELOAD');
    console.log('errs', errs);
    await ctx.close();
  }
  await b.close();
})();
