// Smoke test: both languages, both modes, render every tab each week, no JS error, no "undefined"/"NaN" in the UI.
const {chromium}=require('playwright');const path=require('path');
(async()=>{
 const b=await chromium.launch();let bad=0;
 for(const lang of ['en','fr','es']){
  const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(l=>{try{localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1')}catch(e){}},lang);
  await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
  const probs=await p.evaluate(()=>{
   const out=[];const chk=w=>{const t=document.body.innerText;if(/undefined|NaN|\[object/.test(t))out.push(w+': '+(t.match(/.{0,30}(undefined|NaN|\[object).{0,20}/)||[''])[0])};
   chk('title');
   for(const mode of ['pres','mid','h2016','h2020','h2024']){
    newGame(1,1,4242,null,mode);
    if(mode==='h2016'||mode==='h2020'||mode==='h2024'){pickVP(0)}
    else if(mode==='pres'){G.cand=G.cands[0];initPrim();G.phase='prim';for(let r=0;r<4&&G.phase==='prim';r++){render();chk('prim');primAct('ads');endRound()}
     if(G.phase==='vp'){pickVP(0)}}
    else G.phase='play';
    for(let w=1;w<=12&&G.phase!=='over';w++){
     for(const tab of ['map','issues','team','log','stats']){try{UI.tab=tab;render();chk(mode+' w'+w+' '+tab)}catch(e){out.push(mode+' '+tab+' threw '+e.message)}}
     try{UI.sel='PA';A.visit();A.fund()}catch(e){out.push('act '+e.message)}
     endWeek();
     if(G.phase==='event'){showEvent&&showEvent();A.choose({i:0});A.evnext()}
    }
    render();chk(mode+' end');
    if(G.phase!=='over')out.push(mode+' did not finish: '+G.phase);
   }
   return out});
  const all=probs.concat(errs);
  console.log((all.length?'FAIL ':'ok   ')+lang,all.slice(0,5).join(' | '));if(all.length)bad++;
  await ctx.close();
 }
 await b.close();process.exit(bad?1:0);
})();
