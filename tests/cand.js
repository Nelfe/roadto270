// Candidate screen: reroll, skip primaries, every trait/weakness plays through a full campaign.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
 for(const lang of ['en','fr','es']){
  const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(l=>{localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1')},lang);
  await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
  const r=await p.evaluate(()=>{
   const out={};newGame(1,1,99,null,'pres');render();
   const before=G.cands.map(c=>c.n).join();A.rerollc();out.reroll=before!==G.cands.map(c=>c.n).join()&&G.cands.length===3;
   out.btns=!!document.querySelector('[data-act=rerollc]')&&!!document.querySelector('[data-act=skipp]');
   A.skipp();out.skipFlag=UI.skipPrim===true;A.pickc({i:0});out.skipPhase=G.phase==='vp'&&G.pr==null&&!!G.cand;
   pickVP(0);out.afterVP=G.phase;
   UI.skipPrim=false;
   // every trait and weakness
   const bad=[];const tr=Object.keys(TRAITS),wk=Object.keys(WEAKS);out.nt=tr.length;out.nw=wk.length;
   for(let i=0;i<Math.max(tr.length,wk.length);i++){
     newGame(1,1,100+i,null,'pres');G.cand=G.cands[0];G.cand.tr=[tr[i%tr.length],tr[(i+3)%tr.length]];G.cand.wk=wk[i%wk.length];
     if(G.cand.tr[0]===G.cand.tr[1])G.cand.tr[1]=tr[(i+1)%tr.length];
     UI.skipPrim=true;A.pickc({i:0});pickVP(0);
     for(let w=1;w<=12&&G.phase!=='over';w++){UI.sel='PA';try{A.visit();A.fund();A.ads({n:1})}catch(e){bad.push('act '+e.message)}endWeek();if(G.phase==='event'){showEvent();A.choose({i:0});A.evnext()}}
     render();const txt=document.body.innerText;if(/undefined|NaN/.test(txt))bad.push('txt '+G.cand.tr+G.cand.wk);if(G.phase!=='over')bad.push('stuck '+G.cand.tr+' '+G.cand.wk+' '+G.phase)
   }
   UI.skipPrim=false;out.bad=bad;return out});
  const ok=r.reroll&&r.btns&&r.skipFlag&&r.skipPhase&&!r.bad.length&&!errs.length;
  console.log((ok?'ok   ':'FAIL ')+lang,JSON.stringify(r),errs.slice(0,2));if(!ok)bad++;await p.close()}
 await b.close();process.exit(bad?1:0)})();
