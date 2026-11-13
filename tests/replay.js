const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['fr','en','es']){
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.clear();localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tuto.mid','1');localStorage.setItem('cap270.tips','["cand","prim","term"]')}catch(e){}},lang);
await p.goto('file://'+path.resolve('index.html'));
const r=await p.evaluate(()=>{const o={};
 // 1. scénarios 2008 / 2012 et midterms historiques
 for(const m of ['h2008','h2012','m2010','m2018','m2022']){newGame(1,1,5,null,m);o[m]=(m[0]==='h'?G.scn===m.slice(1):G.mscn===m.slice(1));SIM=true;G.phase=G.mode==='mid'?'play':'vp';if(G.phase==='vp')pickVP(0);G.phase='play';snap();for(let w=0;w<60&&G.phase!=='over';w++){if(G.phase==='event'){A.choose({i:0});A.evnext()}else endWeek()}o[m]=o[m]&&G.phase==='over';SIM=false}
 // 2. défi de la semaine
 newGame(1,1,5,null,'pres');startWeekly();o.weekly=G.weekly===weekId()&&!!G.wmod;
 // 3. archétypes : verrouillés puis débloqués par les stats
 const S=getStats();S.w=0;localStorage.setItem(STK,JSON.stringify(S));newGame(1,1,6,null,'pres');o.arch0=G.cands.length===3;
 S.w=5;S.df[2][1]=1;S.sc={'2016':1};localStorage.setItem(STK,JSON.stringify(S));newGame(1,1,6,null,'pres');o.arch1=G.cands.length===3+4&&G.cands.slice(3).every(c=>c.arch);
 G.phase='cand';render();o.archUI=!!document.querySelector('#main')&&/★/.test(document.querySelector('#main').innerHTML);
 // 4. saga : mandat -> midterms -> réélection -> dynastie
 newGame(1,1,11,null,'pres');pickVP(0);hideModal();G.natM=3;G.cand=G.cands[0];termStart();o.saga0=TM().saga.pts===100;
 const half=()=>{let g=0;while(TM().q<=TM().qmax&&g++<40){termEndQ();while(TM().ev){tevChoose(0);afterQ()}}};
 half();showTermEnd();termToMid();SIM=true;G.phase='play';for(let i=0;i<60&&G.phase!=='over';i++){if(G.phase==='event'){A.choose({i:0});A.evnext()}else endWeek()}SIM=false;
 chainNext();half();showTermEnd();o.sagaPts=TM().saga.pts>100;termToReel();o.sagaReel=!!G.saga&&!!G.reelT;
 termToNext();o.dyn=G.dyn===2&&G.phase==='cand'&&G.saga.cycles===2&&isFinite(G.env);
 G.cand=G.cands[0];G.dbg=false;termStart();o.dynTerm=TM().saga.pts>200||TM().saga.pts>100;
 return o});
const ok=Object.values(r).every(v=>v)&&!errs.length;if(!ok)bad++;
console.log(ok?'ok  ':'FAIL',lang,JSON.stringify(r),errs);await p.close()}
await b.close();process.exit(bad?1:0)})();
