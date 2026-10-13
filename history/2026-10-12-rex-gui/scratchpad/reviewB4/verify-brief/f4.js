const {P,D,surf,rex,ollie,ctx}=require('./h.js');
for (const [kg,s] of [[1.45e5,'concrete'],[90700,'sand']]) {
  const cR=ctx(kg,{surface:surf(s)});
  const t=P.tossPartner(cR, ollie(), 'Ollie', 'hard', 100, 'friction');
  const sT=P.impulseSource(cR.surface,t.toGroundT.J,t.toGroundT.T), sC=P.impulseSource(cR.surface,t.toGroundC.J,t.toGroundC.T);
  console.log(s,kg,'result',t.result,'v',t.v.toFixed(1),'toGroundT',JSON.stringify(t.toGroundT),'plaster5',P.plasterOver(sT,5),'| toGroundC',JSON.stringify(t.toGroundC),'sinkRatioRaw',t.catch.sinkRatioRaw.toFixed(2),'plaster5',P.plasterOver(sC,5),'ppv5 mm/s',(P.ppvAt(sC,5)*1000).toFixed(1));
}
