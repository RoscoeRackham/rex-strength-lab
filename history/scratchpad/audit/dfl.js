for (const L of [3,5,10]) {
  global.window={}; delete require.cache[require.resolve('./eng_L'+L+'.js')];
  const P=require('./eng_L'+L+'.js');
  const b=P.makeBody({H:2,m:7.416e16});
  const st=P.settle(b);
  console.log('DF_LNL',L,'settle years',st.years.toFixed(1));
}
