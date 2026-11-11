// Donor offers: accept/decline over whole campaigns in 3 languages; no NaN, positions stay in range, cash and dependence move.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('cap270.tuto','1')});
 await p.goto('file://'+path.join(__dirname,'..','index.html'));
 const r=await p.evaluate(()=>{const out={offers:0,accepted:0,declined:0,expo:0,pac:0,bad:[]};
  for(const mode of ['pres','mid']){for(const me of [1,-1]){newGame(me,1,17,null,mode);if(mode==='pres'){G.cand=G.cands[0];UI.skipPrim=true;A.pickc({i:0});pickVP(0)}else G.phase='play';
   for(let w=1;w<=12&&G.phase!=='over';w++){UI.tab='actions';render();
    for(const lg of ['fr','en','es']){LANG=lg;if(/undefined|NaN/.test(donorHTML()))out.bad.push('html '+lg)}LANG='en';
    out.offers+=(G.donors||[]).length;
    while((G.donors||[]).length){const yes=(w+G.donors.length)%3!==0;const c0=G.cash;try{donorDo(0,yes)}catch(e){out.bad.push(e.message);break}if(yes){out.accepted++;if(G.cash<c0-1e-9)out.bad.push('cash fell')}else out.declined++}
    endWeek();if(G.phase==='event'){showEvent();A.choose({i:0});A.evnext()}}
   out.expo+=G.expo||0;out.pac+=G.pac?1:0;
   if(!isFinite(G.img)||!isFinite(G.cash))out.bad.push('NaN');if(G.pos[side()].some(v=>v<-2||v>2))out.bad.push('pos range')}}
  return out});
 console.log(JSON.stringify(r),errs.slice(0,2));const ok=r.offers>6&&r.accepted>3&&r.declined>0&&!r.bad.length&&!errs.length;await b.close();process.exit(ok?0:1)})();
