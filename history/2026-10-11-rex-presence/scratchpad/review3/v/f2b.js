const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open(1280,900);
  await page.click('#grp-solo'); await page.click('#tab-throw'); await page.waitForTimeout(1500);
  await page.selectOption('#effort','allout'); await page.waitForTimeout(800);
  const all=await page.evaluate(()=>document.querySelector('#bay .verdict').textContent);
  await page.selectOption('#effort','least'); await page.waitForTimeout(800);
  await page.evaluate(()=>{document.querySelector('#effort-use').closest('details').open=true;});
  const b=await (await page.$('#effort-use')).boundingBox();
  await page.mouse.move(b.x+b.width*0.5,b.y+b.height/2); await page.mouse.down();
  for (let i=1;i<=10;i++) await page.mouse.move(b.x+b.width*(0.5+0.06*i), b.y+b.height/2);
  await page.mouse.up(); await page.waitForTimeout(800);
  const r=await page.evaluate(()=>({v:document.querySelector('#effort-use').value, max:document.querySelector('#effort-use').max, vt:document.querySelector('#effort-use').getAttribute('aria-valuetext'), verdict:document.querySelector('#bay .verdict').textContent, read:document.querySelector('#bay .effort-read p').textContent}));
  console.log('allout verdict:', all); console.log('drag past right end:', JSON.stringify(r));
  // decimal arithmetic of the step grid
  console.log('steps in decimal:', '(4.957695736225271 - 1.4776957362252712)/0.01 =', (4.957695736225271 - 1.4776957362252712)/0.01);
  await browser.close();
})();
