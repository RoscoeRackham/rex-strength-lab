for (const C of [3000,6000,9000]) {
  global.window={};
  const P=require('./eng_C'+C+'.js');
  const b=P.makeBody({H:2,m:7.416e16});
  const st=P.settle(b);
  console.log('CS_ROCK',C,'settle years',st.years.toFixed(1));
}
