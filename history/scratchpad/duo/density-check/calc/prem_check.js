// Independent PREM integration (numerical, not closed form). Coefficients from the GENIE listing (Dziewonski & Anderson 1981).
const G = 6.67430e-11, RE = 6371e3, GMeng = 3.986004418e14;
const L = [[1221.5,[13.0885,0,-8.8381,0],1],[3480,[12.5815,-1.2638,-3.6426,-5.5281],0],[5701,[7.9565,-6.4761,5.5283,-3.0807],1],
 [5771,[5.3197,-1.4836,0,0],1],[5971,[11.2494,-8.0298,0,0],1],[6151,[7.1089,-3.8045,0,0],1],[6346.6,[2.6910,0.6924,0,0],1],[6356,[2.9,0,0,0],1],[6368,[2.6,0,0,0],1],[6371,[1.02,0,0,0],0]];
function rho(r, ocean) { const km = r/1000, x = r/RE; for (const [t,a] of L) if (km <= t) { if (!ocean && t === 6371) return 2600; return 1000*(a[0]+x*(a[1]+x*(a[2]+x*a[3]))); } return 0; }
function build(ocean, N) {
  const dr = RE/N, M = new Float64Array(N+1);
  for (let i=1;i<=N;i++){ const a=(i-1)*dr,b=i*dr,m=(a+b)/2; const fa=4*Math.PI*a*a*rho(a+1e-9,ocean), fm=4*Math.PI*m*m*rho(m,ocean), fb=4*Math.PI*b*b*rho(b-1e-9,ocean); M[i]=M[i-1]+dr/6*(fa+4*fm+fb); }
  const gr = new Float64Array(N+1); for (let i=1;i<=N;i++) gr[i]=G*M[i]/(i*dr)**2;
  const Phi = new Float64Array(N+1); Phi[N] = -G*M[N]/RE; for (let i=N-1;i>=0;i--) Phi[i]=Phi[i+1]-0.5*(gr[i]+gr[i+1])*dr;
  const P = new Float64Array(N+1); for (let i=N-1;i>=0;i--){ const m=(i+0.5)*dr; P[i]=P[i+1]+rho(m,ocean)*0.5*(gr[i]+gr[i+1])*dr; }
  let U=0; for (let i=1;i<=N;i++){ const m=(i-0.5)*dr; U+= G*0.5*(M[i]+M[i-1])/m*4*Math.PI*m*m*rho(m,ocean)*dr; }
  let t=0; for (let i=0;i<N;i++){ const v=Math.sqrt(2*(Phi[N]-0.5*(Phi[i]+Phi[i+1]))); t+=dr/v; }
  return {dr,M,gr,Phi,P,U,t,N};
}
for (const ocean of [true,false]) {
  const B = build(ocean, 637100); const at=(km)=>Math.round(km*1000/B.dr);
  const s = GMeng/(G*B.M[B.N]);
  console.log(ocean?'WITH OCEAN':'OCEAN->CRUST', 'M',B.M[B.N].toExponential(5),'scale to engine GM',s.toFixed(6));
  for (const km of [1221.5,3480,5701,6371]) console.log('  g',km,B.gr[at(km)].toFixed(4),'scaled',(B.gr[at(km)]*s).toFixed(4),'P GPa',(B.P[at(km)]/1e9).toFixed(3));
  console.log('  Pc GPa',(B.P[0]/1e9).toFixed(3),'scaled',(B.P[0]/1e9*s).toFixed(3),'U',B.U.toExponential(5),'Phi(R)-Phi(0)',(B.Phi[B.N]-B.Phi[0]).toExponential(5),'scaled',((B.Phi[B.N]-B.Phi[0])*s).toExponential(5),
   'vmax',Math.sqrt(2*(B.Phi[B.N]-B.Phi[0])*s).toFixed(1),'diam min unscaled',(2*B.t/60).toFixed(3),'scaled',(2*B.t/Math.sqrt(s)/60).toFixed(3));
  // max g
  let mg=0,mi=0; for (let i=0;i<=B.N;i++) if (B.gr[i]>mg){mg=B.gr[i];mi=i;} console.log('  max g',(mg*s).toFixed(4),'at km',(mi*B.dr/1000).toFixed(1));
  // inner core g slope
  console.log('  g/r in inner core (scaled)', (B.gr[at(100)]*s/100e3).toExponential(4), (B.gr[at(216)]*s/216e3).toExponential(4), 'g(216km)',(B.gr[at(216)]*s).toFixed(4),'g(280km)',(B.gr[at(280)]*s).toFixed(4));
  if (!ocean) require('fs').writeFileSync(__dirname+'/prem_tab.json', JSON.stringify({dr:B.dr, g:Array.from(B.gr).filter((_,i)=>i%10===0).map(x=>x*s), Phi:Array.from(B.Phi).filter((_,i)=>i%10===0).map(x=>(x-B.Phi[B.N])*s)}));
}
