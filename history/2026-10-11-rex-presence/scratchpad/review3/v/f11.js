const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open(390,844);
  for (const tab of ['throw','stomp','punch']) {
    await page.click('#grp-solo'); await page.click('#tab-'+tab); await page.waitForTimeout(1800);
    const r=await page.evaluate(()=>{const rd=document.querySelector('#bay .effort-read'); const t=rd.innerText;
      const first=rd.querySelector('p').innerText; const s1=first.split(/(?<=\.)\s/)[1]||'';
      const v=document.querySelector('#bay .verdict').getBoundingClientRect(); const tiles=document.querySelector('#bay .tiles');
      const tb=document.querySelector('#tab-'+document.querySelector('[role=tab][aria-selected=true]').id.slice(4)).getBoundingClientRect();
      return {words:t.split(/\s+/).filter(Boolean).length, height:Math.round(rd.getBoundingClientRect().height), sentence2Words: s1.split(/\s+/).length, verdictTop: Math.round(v.top - tb.bottom), tilesTop: tiles? Math.round(tiles.getBoundingClientRect().top - tb.bottom):null, s1}});
    console.log(tab, JSON.stringify(r));
  }
  // Lift with a person: safe passenger off vs on
  await page.click('#tab-lift'); await page.waitForTimeout(800);
  await page.selectOption('#obj','person'); await page.waitForTimeout(800);
  const a=await page.evaluate(()=>document.querySelector('#bay').textContent);
  await page.evaluate(()=>{document.querySelector('#comic-setup').open=true;}); await page.check('#sw-passenger'); await page.waitForTimeout(800);
  const b=await page.evaluate(()=>document.querySelector('#bay').textContent);
  console.log('lift person: identical', a===b, '| mentions passenger', /passenger/i.test(b), '| switch label:', await page.evaluate(()=>document.querySelector('#sw-passenger').parentElement.textContent));
  await browser.close();
})();
