global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=(id)=>D.surfaces.find(s=>s.id===id);
const mk=(kg,H,m,anchor,surf,mode)=>({F:kg*9.80665,mode:mode||'comic',body:P.makeBody({H,m}),surface:S(surf||'concrete'),groundHolds:false,anchor:anchor||'friction'});
const show=(t,r)=>console.log(t, JSON.stringify(r,(k,v)=>typeof v==='number'?+v.toPrecision(5):v).slice(0,900));
show('default', P.armWrestle(mk(90718.474,2,180),mk(90718.474,2,180)));
show('rex180 vs ollie300 huge', P.armWrestle(mk(1e12,2,180),mk(1e11,2,300)));
show('human record vs hulk table holds?', P.armWrestle(mk(90718.474,2,180),mk(511/ (1) ,2,180)));
show('both 1000kg dial', P.armWrestle(mk(1000,2,180),mk(2000,2,180)));
