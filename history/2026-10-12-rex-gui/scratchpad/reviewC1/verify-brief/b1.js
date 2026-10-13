const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const R=process.argv[2];
(async()=>{
  const body=fs.readFileSync(path.join(R,'dist','index.html'),'utf8');
  const prev=path.join(process.env.S,'prev.html');
  fs.writeFileSync(prev,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>');
  const b=await chromium.launch({executablePath:CHROME});
  const page=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const st of JSON.parse(process.argv[3])) {
    await page.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),st);
    await page.reload(); await page.waitForTimeout(2500);
    const t=await page.evaluate(()=>document.body.innerText);
    console.log('=== '+JSON.stringify(st));
    for (const line of t.split("\n")) if (/blow the Earth apart|holds the Earth together|Compared with|Energy|Jupiter|roughly|beyond the ladder|the same as|% of/.test(line)) console.log("  > "+(line.length>600? "..."+line.slice(-700):line));
  }
  console.log('errors',errs);
  await b.close();
})();
