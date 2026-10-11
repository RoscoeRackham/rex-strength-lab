const BC=require('/home/user/build-calc/src/calc.js'); const d=require('/home/user/build-calc/data/builds.json'); const M=BC.create(d); const fmt=BC.fmt;
const by=id=>d.builds.find(b=>b.id===id);
console.log('== F1 height round-trip (what readMain feeds back after any input event)');
for (const [id,u] of [['ansur2_m_p50','imperial'],['ronnie_coleman','metric']]) { const b=by(id), H=b.height_m.value; const p=fmt.heightParts(H); const Hin=u==='imperial'?(p.ft*12+p.inch)*BC.IN:(Math.round(H*1000)/10)/100; const r0=M.compute({buildId:id}), r1=M.compute({buildId:id,heightM:Hin,bodyFatPct:12}); console.log(id,u,'H',H,'->',Hin,'| height',r0.height.status,'->',r1.height.status,'| weight',r0.weight.value,r0.weight.status,'->',+r1.weight.value.toFixed(2),r1.weight.status,'| chest',r0.girths.chest.status,'->',r1.girths.chest.status); }
console.log('== F2 female FFMI normalisation');
for (const id of ['ansur2_f_p5','ansur2_f_p50']) { const r=M.compute({buildId:id}); console.log(id,'H',r.height.value,'unadjusted',r.ffmi.value.toFixed(1),'plotted (normalised to 1.80 m, c=6.1)',r.ffmi.norm.toFixed(1),'refs: Schutz median 15.4 (unadjusted), Blue max 25.5 (unadjusted)'); }
console.log('== F3 midpoints labelled reported');
const IN=0.0254;
for (const [id,k] of [['dorian_yates','H'],['jay_cutler','H'],['brian_shaw','H'],['ronnie_coleman','thigh'],['dorian_yates','chest'],['dorian_yates','waist'],['dorian_yates','arm_flexed'],['dorian_yates','calf'],['jay_cutler','calf'],['sergio_oliva','chest'],['sergio_oliva','arm_flexed']]) { const b=by(id); const e=k==='H'?b.height_m:b.girths[k]; const v=k==='H'?e.value:e.value_m; console.log(id,k,v,(v/IN).toFixed(2)+' in','status',e.status,'| basis:',(e.value_basis||e.basis)); }
console.log('== F4 Cap DK Avengers edition');
const cap=by('captain_america'); cap.editions.forEach(e=>console.log(e.label,'->',fmt.height(e.height_m,'imperial'),fmt.mass(e.weight_kg,'imperial')));
console.log('== F5 default 15% fat gives Kouri verdict for everyday builds');
for (const id of ['ansur2_m_p95','ansur2_m_largest_arm','ansur2_m_leanheavy']) { const r=M.compute({buildId:id}); console.log(id,'bf',r.bodyFat.value,r.bodyFat.status,'FFMI norm',r.ffmi.norm.toFixed(1),'above Kouri 25:',r.ffmi.ref.above); }
console.log('== F6 Rex weight at 9 ft');
const rx=M.compute({buildId:'rex',heightM:9*12*IN}); console.log('rex ref weight status',by('rex').weight_kg.status,'| at 9 ft:',rx.weight.value.toFixed(0),rx.weight.status,'| bmi',rx.bmi.status,'| ffmi',rx.ffmi.status);
console.log('== F7 Ollie');
const ol=by('ollie'), f=d.facts.rex_ollie_picture_mass.values; console.log('ollie.volume_m3',ol.volume_m3.value,'fact ollie central',f.volume_central_m3.ollie,'| ollie H',ol.height_m.value,'vs 794 px x',f.height_note.match(/0\.\d+/)[0],'=',(794*0.0038582).toFixed(3),'m to horn tips');
console.log('== F9 Kraemer BMI wording');
const kr=M.compute({buildId:'kraemer2020_strongmen'}); console.log('bmi',kr.bmi.value.toFixed(3),'stats shows',fmt.num(kr.bmi.value,1),'basis shows BMI',fmt.num(kr.bmiGirth,0),'is above 43.5');
