const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(1500);
    const res = await page.evaluate(() => {
      function parse(c){const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(s=>parseFloat(s));return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
      function effBg(el){const stack=[];let e=el;while(e){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c.a>0)stack.push(c);if(c&&c.a===1)break;e=e.parentElement;}
        let base={r:255,g:255,b:255};for(let i=stack.length-1;i>=0;i--){const c=stack[i];base={r:c.r*c.a+base.r*(1-c.a),g:c.g*c.a+base.g*(1-c.a),b:c.b*c.a+base.b*(1-c.a)};}return base;}
      function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
      function L(o){return 0.2126*lin(o.r)+0.7152*lin(o.g)+0.0722*lin(o.b);}
      function cr(a,b){const x=L(a),y=L(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
      const out=[];
      const sel=['.hero .eyebrow','.start','.start span','#ladder .eyebrow','#feats .eyebrow','#sources .eyebrow','footer','.tab[aria-selected="true"]','.panel-controls .eyebrow','.scale-ends','.feat .w','th','.tile .k','.field label'];
      for(const s of sel){const el=document.querySelector(s);if(!el){out.push(s+' MISSING');continue;}const cs=getComputedStyle(el);const fg=parse(cs.color);const bg=effBg(el);out.push(`${s.padEnd(28)} fg=${cs.color} bg=rgb(${bg.r.toFixed(0)},${bg.g.toFixed(0)},${bg.b.toFixed(0)}) size=${cs.fontSize} wt=${cs.fontWeight} ff=${cs.fontFamily.split(',')[0]} CR=${cr(fg,bg).toFixed(2)} text="${el.textContent.trim().slice(0,50)}"`);}
      // ladder lines
      const lad=document.querySelector('#ladder-viz svg');
      if(lad){const ln=lad.querySelector('line');out.push('ladder axis stroke='+getComputedStyle(ln).stroke+' wrapBg='+JSON.stringify(effBg(document.querySelector('#ladder-viz'))));
        const p=lad.querySelector('.mk path');out.push('ladder leader stroke='+getComputedStyle(p).stroke);}
      out.push('fonts: '+[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+':'+f.weight).join(', '));
      return out.join('\n');
    });
    console.log('=== '+scheme+' ===\n'+res);
    await page.screenshot({ path: `l08_top_${scheme}.png`, clip: { x: 0, y: 0, width: 1280, height: 600 } });
    await ctx.close();
  }
  await browser.close();
})();
