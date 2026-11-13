const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.clear();localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tips','["cand","prim","term"]')}catch(e){}});
await p.goto('file://'+path.resolve('index.html'));
await p.evaluate(()=>{newGame(1,1,11,null,'pres');pickVP(0);hideModal();G.wk=12;G.dbg=true;G.states.forEach(q=>{q.final=(q.lean>0?1:-1)*4});election()});
let anim=0,n=0;for(let i=0;i<8;i++){await p.waitForTimeout(160);const s=await p.evaluate(()=>{const e=document.querySelector('#modal .sheet');return e?{cls:e.className,op:getComputedStyle(e).opacity}:null});if(s){n++;if(i>3&&(!/noanim/.test(s.cls)||s.op!=='1'))anim++}}
const ok=n>3&&anim===0&&!errs.length;console.log(ok?'ok':'FAIL',{n,anim},errs);await b.close();process.exit(ok?0:1)})();
