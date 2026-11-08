// Automatic balance tests: seeded bots play full games; win rates must stay inside bands.
// usage: node tests/balance.js [N=120]
const {chromium}=require('playwright');const path=require('path');
const N=+process.argv[2]||120;
const SEED_JS=`(()=>{let a=12345;Math.random=()=>{a=(a+0x6D2B79F5)>>>0;let z=a;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296}})()`;
// [mode, difficulty, strategy, min, max]  (win rate of the bot)
const BANDS=[
 ['pres',1,'idle',0.00,0.25],['pres',1,'ads',0.12,0.55],['pres',1,'full',0.55,0.85],
 ['pres',2,'full',0.35,0.75],['pres',0,'full',0.72,0.98],
 ['mid',1,'idle',0.10,0.60],['mid',1,'full',0.50,0.85]
];
(async()=>{
 const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(SEED_JS);
 await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
 const res=await p.evaluate(([N,BANDS])=>{
 function playPres(me,diff,strat){
  SIM=true;
  for(let tries=0;tries<20;tries++){newGame(me,diff);G.cand=G.cands[0];initPrim();G.phase='prim';
   for(let r=0;r<4&&G.phase==='prim';r++){const pr=G.pr,tg=clamp(Math.round(pr.hint),-2,2);
    if(pr.x<tg)primAct('base');else if(pr.x>tg)primAct('center');
    ['ads','tour','ads'].forEach(a=>{if(pr.ap>0){if(a==='ads'&&pr.cash<4)primAct('fund');else primAct(a)}});endRound()}
   if(G.phase==='vp')break}
  pickVP(Math.floor(Math.random()*3));
  for(let w=1;w<=12&&G.phase!=='over';w++){
   if(strat!=='idle'){
    const sd=side();
    const sc=G.states.map(s=>({s,w:s.ev/(1+Math.pow(Math.max(0,Math.abs(G.me*pollOf(s))-1)/5,2))})).sort((a,b)=>b.w-a.w).slice(0,6),tw=sc.reduce((a,x)=>a+x.w,0);
    A.fund();
    if(strat.startsWith('full')){
      if(G.viral&&G.viral.v<0&&G.ap>0)A.viral();
      if(G.third&&G.third.on&&G.third.side===sd&&G.third.pow>.5&&G.ap>0)A.usefulvote();
      if(w>=8)for(let k=0;k<2&&G.ap>0;k++){UI.sel=sc[k].s.ab;A.early()}
    }
    if(strat.startsWith('full')){
      const F=(strat.split(':')[1]||'pos,tgt,fld,prep');
      if(F.includes('pos')&&w<=3){const bs=bestShift(sd);if(bs&&bs.g>.25&&G.ap>0)A.pos({i:bs.i,d:bs.np-G.pos[sd][bs.i]})}
      if(F.includes('tgt')&&w%2===0&&G.ap>0)A.target({i:bestGroup(sd,false)});
      if(F.includes('prep')&&[3,4,7,8].includes(w)&&G.ap>0&&G.prep<3)A.prep();
      G.__F=F;
    }
    for(let k=0;k<2&&G.ap>0;k++){const x=sc[k];UI.sel=x.s.ab;if(w<=6&&x.s.fieldP<2&&strat.startsWith('full')&&(G.__F||'').includes('fld'))A.field();else A.visit()}
    const bud=Math.min(G.cash,G.cash/(13-w)*1.25);
    sc.forEach(x=>{const n=bud*x.w/tw/adCost(x.s);if(n>.3){UI.sel=x.s.ab;const c=adCost(x.s)*n;if(G.cash>=c){G.cash-=c;x.s.tvP+=c;x.s.adsP=x.s.tvP+x.s.dgP+x.s.raP;x.s.spP+=c}}});
   }
   endWeek();
   if(G.phase==='event'){const e=EVENTS.find(q=>q.id===G.ev.id);A.choose({i:Math.floor(Math.random()*e.ch.length)});A.evnext()}
  }
  let d=0;G.states.forEach(s=>comps(s).forEach((k,i)=>{if(s.final+(s.dn?s.dn[i]:0)>0)d+=k[0]}));return me===1?d:538-d;
 }

 function playMid(me,diff,strat){
  SIM=true;newGame(me,diff,null,null,'mid');G.phase='play';snap();
  for(let w=1;w<=12&&G.phase!=='over';w++){
   if(strat!=='idle'){
    const sd=side();
    const sc=G.states.map(s=>({s,w:s.ev/(1+Math.pow(Math.max(0,Math.abs(G.me*pollOf(s))-1)/5,2))})).sort((a,b)=>b.w-a.w).slice(0,6),tw=sc.reduce((a,x)=>a+x.w,0);
    A.fund();
    if(strat.startsWith('full')){
      if(G.viral&&G.viral.v<0&&G.ap>0)A.viral();
      if(G.third&&G.third.on&&G.third.side===sd&&G.third.pow>.5&&G.ap>0)A.usefulvote();
      if(w>=8)for(let k=0;k<2&&G.ap>0;k++){UI.sel=sc[k].s.ab;A.early()}
    }
    if(strat.startsWith('full')){
      const F=(strat.split(':')[1]||'pos,tgt,fld,prep');
      if(F.includes('pos')&&w<=3){const bs=bestShift(sd);if(bs&&bs.g>.25&&G.ap>0)A.pos({i:bs.i,d:bs.np-G.pos[sd][bs.i]})}
      if(F.includes('tgt')&&w%2===0&&G.ap>0)A.target({i:bestGroup(sd,false)});
      
      G.__F=F;
    }
    for(let k=0;k<2&&G.ap>0;k++){const x=sc[k];UI.sel=x.s.ab;if(w<=6&&x.s.fieldP<2&&strat.startsWith('full')&&(G.__F||'').includes('fld'))A.field();else A.visit()}
    const bud=Math.min(G.cash,G.cash/(13-w)*1.25);
    sc.forEach(x=>{const n=bud*x.w/tw/adCost(x.s);if(n>.3){UI.sel=x.s.ab;const c=adCost(x.s)*n;if(G.cash>=c){G.cash-=c;x.s.tvP+=c;x.s.adsP=x.s.tvP+x.s.dgP+x.s.raP;x.s.spP+=c}}});
   }
   endWeek();
   if(G.phase==='event'){const e=EVENTS.find(q=>q.id===G.ev.id);A.choose({i:Math.floor(Math.random()*e.ch.length)});A.evnext()}
  }
  const R=G.res,sd0=me===1?'D':'R';return (R.hCtl===sd0?10:0)+(R.sCtl===sd0?1:0);
 }

  const out=[];
  for(const [mode,diff,strat] of BANDS.map(x=>x)){
   let w=0;
   for(let i=0;i<N;i++){const me=i%2?1:-1;const r=mode==='pres'?playPres(me,diff,strat):playMid(me,diff,strat);w+=(mode==='pres'?r>=270:r>=10)?1:0}
   out.push([mode,diff,strat,w/N]);
  }
  return out},[N,BANDS.map(x=>x.slice(0,3))]);
 let bad=0;
 res.forEach((r,i)=>{const [mn,mx]=[BANDS[i][3],BANDS[i][4]];const ok=r[3]>=mn&&r[3]<=mx;if(!ok)bad++;console.log((ok?'ok  ':'FAIL')+' '+r.slice(0,3).join('/')+' win='+r[3].toFixed(2)+' band=['+mn+','+mx+']')});
 if(errs.length){console.log('JS errors',errs);bad++}
 await b.close();process.exit(bad?1:0);
})();
