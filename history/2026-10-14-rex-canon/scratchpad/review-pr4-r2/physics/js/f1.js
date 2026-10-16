const {P,D,rex,ollie,ctx,show,fmt}=require('./h.js');
const obj=(id)=>D.objects.find(x=>x.id===id);
const leg=(kg,airAbsorb,xC)=>{const cT=ctx({kg,keepForm:false,airAbsorb}); return P.catchLeg(cT,Object.assign({},cT,{body:ollie()},xC||{}),obj('baseball'),10,'hard');};
for (const air of [0.5,0]) for (const nkb of [true,false]) for (const anc of ['friction','bolted']) {
  const L=leg(1e14,air,{noKnockback:nkb,anchor:anc}), f=L.fireball;
  console.log('air',air,'nkb',nkb,anc, L.result, f&&show(f,['kind','E','p','Egap','Earr','Ehere','Eafter','Ecarry','Enear','Eblast','push.recoilV','push.earthRecoilV','knockAbsorbed.J','knockAbsorbed.E','mLump','vLumpAt']));
}
const Lm=leg(1e14,0.5,{noKnockback:true,meanIt:true}); console.log('meant', show(Lm.fireball,['Eblast','knockAbsorbed.E','E']));
// momentum check: p vs E for lump; E=(gamma-1) m c^2 ; p = gamma m v
