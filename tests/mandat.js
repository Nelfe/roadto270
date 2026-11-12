const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['fr','en','es']){
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.clear();localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tuto.mid','1');localStorage.setItem('cap270.tips','["cand","prim","term"]')}catch(e){}},lang);
await p.goto('file://'+path.resolve('index.html'));
const r=await p.evaluate(()=>{
  const out={};newGame(1,1,11,null,'pres');pickVP(0);hideModal();
  G.natM=3;G.cand=G.cands[0];termStart();
  out.phase=G.phase;out.ren=!!document.querySelector('#main .card');
  const runHalf=()=>{let guard=0;while(G.phase==='term'&&TM().q<=TM().qmax&&guard++<40){
    const T=TM();
    for(const id of T.ag.slice()){if(T.acts<1)break;const l=LAW(id);if(!l)continue;if(T.pc>=l.c)termTry(id,l.k==='B'?'p':(T.pc>=l.c+2?'push':'p'))}
    if(!T.nuke&&T.s[side()]>=50&&T.pc>=6)termNuke();
    termEndQ();while(TM().ev){tevChoose(0);afterQ()}
    if(TM().q>TM().qmax)break}};
  runHalf();out.laws1=TM().laws.length;out.pop1=Math.round(TM().pop);out.q=TM().q;
  showTermEnd();termToMid();out.mid=G.mode==='mid'&&!!G.chain&&G.inc===side();
  SIM=true;G.phase='play';for(let i=0;i<60&&G.phase!=='over';i++){if(G.phase==='event'){const e=EVENTS.find(q=>q.id===G.ev.id);A.choose({i:0});A.evnext()}else endWeek()}SIM=false;
  out.over=G.phase==='over'&&!!G.res;
  chainNext();out.half2=G.phase==='term'&&TM().half===2&&TM().qmax===4;
  runHalf();out.laws2=TM().laws.length;
  termToReel();out.reel=!!G.reel&&G.mode==='pres'&&G.phase==='vp'&&!!G.cand;
  out.envOK=isFinite(G.env);
  return out});
const ok=r.phase==='term'&&r.ren&&r.laws1>=1&&r.mid&&r.over&&r.half2&&r.reel&&r.envOK&&!errs.length;if(!ok)bad++;
console.log(ok?'ok  ':'FAIL',lang,JSON.stringify(r),errs);await p.close()}
await b.close();process.exit(bad?1:0)})();
