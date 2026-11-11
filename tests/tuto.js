const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['fr','en','es']){for(const mode of ['pres','mid']){
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.clear();localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tips','["cand","prim"]')}catch(e){}},lang);
await p.goto('file://'+path.resolve('index.html'));
// start a game programmatically
await p.evaluate(m=>{newGame(1,1,5,null,m);if(m==='pres')pickVP(0);hideModal();},mode).catch(e=>errs.push('start '+e.message));
await p.evaluate(()=>{if(G.phase!=='play')G.phase='play';UI.tutoPending=true;render()}).catch(e=>errs.push(e.message));
const ok=await p.evaluate(()=>UI.tuto===0&&!$('#coach').hidden);
// step 1 needs a selection
await p.click('#coach [data-act=tutoNext]');
const s1=await p.evaluate(()=>({n:UI.tuto,dis:document.querySelector('#coach [data-act=tutoNext]').disabled}));
await p.evaluate(()=>{UI.sel='PA';render()});
const s2=await p.evaluate(()=>document.querySelector('#coach [data-act=tutoNext]').disabled);
await p.evaluate(()=>{while(UI.tuto<tutoSteps().length-1)tutoGo(UI.tuto+1)});
await p.evaluate(()=>{UI.tuBase=null});await p.click('#endBtn').catch(()=>{});await p.evaluate(()=>{if(UI.tuto!=null)endWeek()});
const done=await p.evaluate(()=>UI.tuto==null&&localStorage.getItem(tutoKey())==='1');
const r=ok&&s1.dis&&!s2&&done&&!errs.length;if(!r)bad++;
console.log(r?'ok  ':'FAIL',lang,mode,JSON.stringify({ok,s1,s2,done,errs}));await p.close();}}
await b.close();process.exit(bad?1:0)})();
