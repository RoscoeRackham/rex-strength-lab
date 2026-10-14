const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
const { readResult, settle } = require(path.resolve('repo/rex-strength-lab/test/make-page-fixture.js'));
const SOLO=['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight'], DUO=['arm','wrestle','catch','collide'];
const STATES=[
 {},
 {anchor:'bolted'},
 {oAnchor:'bolted', surface:'sand'},
 {anchor:'bolted',oAnchor:'bolted',mode:'real',surface:'granite'},
 {logKg:9, anchor:'bolted', groundHolds:true},
 {logKg:2.8, surface:'ice', wrestleMove:'throw', angle:30},
 {inf:true, anchor:'bolted', colMode:'push'},
 {H:50, m:3007*Math.pow(50/3.048,3), surface:'soft_clay', gentleHold:true, coolFlight:true, wrestleMove:'shove', wrestleWho:'both'},
 {logKg:12, cObj:'partner', softLanding:true, silentStrike:true, safePassenger:true, wrestleMove:'lift', wrestleWho:'ollie', oAnchor:'bolted'},
];
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pm=await b.newPage({viewport:{width:1280,height:900}}), pb=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; for (const p of [pm,pb]) p.on('pageerror',e=>errs.push(e.message));
  await pm.goto('file://'+path.resolve('mainw.html')); await pb.goto('file://'+path.resolve('branch.html'));
  let diffs=0, n=0;
  for (const [i,st] of STATES.entries()) {
    for (const tab of SOLO.concat(DUO)) {
      const duo=DUO.includes(tab);
      await pm.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)), Object.assign({},st, duo?{group:'duo',duoAction:tab}:{group:'solo',action:tab}));
      await pb.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)), Object.assign({},st, duo?{duoOpen:true,duoAction:tab}:{duoOpen:false,action:tab}));
      await pm.reload(); await pb.reload(); await pm.waitForTimeout(600); await pb.waitForTimeout(duo?900:600);
      await settle(pm,'bay'); await settle(pb, duo?'duo-bay':'bay');
      const a=await readResult(pm,'bay'), c=await readResult(pb, duo?'duo-bay':'bay'); n++;
      for (const k of Object.keys(a)) { const A=JSON.stringify(a[k]), C=JSON.stringify(c[k]); if (A!==C) { diffs++;
        // print the differing segments
        const aa=[].concat(a[k]), cc=[].concat(c[k]);
        for (let j=0;j<Math.max(aa.length,cc.length);j++) if (aa[j]!==cc[j]) { const x=aa[j]||'', y=cc[j]||''; let s=0; while (s<x.length && x[s]===y[s]) s++; let e=0; while (e<x.length-s && e<y.length-s && x[x.length-1-e]===y[y.length-1-e]) e++;
          console.log(`S${i} ${tab} ${k}[${j}]\n   main: …${x.slice(Math.max(0,s-40), x.length-e+20)}…\n   new : …${y.slice(Math.max(0,s-40), y.length-e+20)}…`); }
      } }
    }
  }
  console.log('cases',n,'diff fields',diffs,'errs',errs);
  await b.close();
})();
