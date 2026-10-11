global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js');
const b=P.makeBody({H:2,m:4.986e8});
const lo=P.fallThrough(b,{sigma:P.W8.SIGMA_LOW,k:0.5}), hi=P.fallThrough(b,{sigma:P.W8.SIGMA_HIGH,k:2}), mid=P.fallThrough(b,{});
for (const [n,f] of [['lo',lo],['mid',mid],['hi',hi]]) console.log(n, f.stuck? ('stuck r='+(f.stuck.r/1e3).toFixed(1)+' km t='+(f.stuck.t/3600).toFixed(2)+' h') : ('not stuck; firstPass='+JSON.stringify(f.firstPass)+' rEnd='+f.rEnd));
