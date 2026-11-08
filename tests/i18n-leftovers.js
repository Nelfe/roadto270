// Plays a few weeks in the given language and lists visible lines that still look English (missing translations).
const {chromium}=require('playwright');const path=require('path');
const lang=process.argv[2]||'es';
const EN=/\b(the|and|you|your|of|to|with|for|week|state|this|that|are|will|not|from|in|on)\b/i;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(l=>{localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1')},lang);
 await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
 const lines=await p.evaluate(()=>{const seen=new Set();const grab=()=>document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean).forEach(s=>seen.add(s));
  grab();
  for(const mode of ['pres','mid']){newGame(1,1,777,null,mode);
   if(mode==='pres'){G.cand=G.cands[0];initPrim();G.phase='prim';for(let r=0;r<4&&G.phase==='prim';r++){render();grab();primAct('ads');endRound()}if(G.phase==='vp'){render();showBrief&&0;pickVP(0)}}else G.phase='play';
   for(let w=1;w<=12&&G.phase!=='over';w++){for(const tab of ['map','issues','groups','team','actions','log']){UI.tab=tab;UI.sel='PA';render();grab()}
    UI.sel='PA';A.visit();A.fund();endWeek();if(G.phase==='event'){showEvent();grab();A.choose({i:0});grab();A.evnext()}}
   render();grab()}
  showModal(helpHTML(true),'help');grab();showModal(settingsHTML(),'set');grab();
  return [...seen]});
 const bad=lines.filter(s=>EN.test(s));console.log(bad.length+' suspicious lines of '+lines.length);bad.slice(0,+process.argv[3]||60).forEach(s=>console.log(' -',s.slice(0,110)));
 await b.close()})();
