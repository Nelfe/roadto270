// Media invitations appear over a campaign, can be answered in person or by a surrogate, and render in 3 languages.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('cap270.tuto','1')});
 await p.goto('file://'+path.join(__dirname,'..','index.html'));
 const r=await p.evaluate(()=>{const out={seen:0,done:0,bad:[]};
  for(const mode of ['pres','mid']){newGame(1,1,31,null,mode);if(mode==='pres'){G.cand=G.cands[0];UI.skipPrim=true;A.pickc({i:0});pickVP(0)}else G.phase='play';
   for(let w=1;w<=12&&G.phase!=='over';w++){UI.tab='actions';render();
    for(const lg of ['fr','en','es']){LANG=lg;const h=mediaHTML();if(/undefined|NaN/.test(h))out.bad.push('html '+lg)}LANG='en';
    out.seen+=(G.media||[]).length;
    while((G.media||[]).length&&G.cash>1){const n=G.media.length;try{mediaDo(0,G.ap<1||G.media.length%2===0)}catch(e){out.bad.push(e.message)}if(G.media.length===n)break;out.done++}
    G.cash+=5;endWeek();if(G.phase==='event'){showEvent();A.choose({i:0});A.evnext()}}
   if(!isFinite(G.img)||!isFinite(G.cash))out.bad.push('NaN')}
  return out});
 console.log(JSON.stringify(r),errs.slice(0,2));const ok=r.seen>3&&r.done>3&&!r.bad.length&&!errs.length;await b.close();process.exit(ok?0:1)})();
