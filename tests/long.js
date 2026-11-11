// Long campaign: 8 primary rounds, primary debates, convention, VP debate.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('cap270.lang','en');localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tuto.mid','1');localStorage.setItem('cap270.tips','["cand","prim"]')});
 await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
 const o=await p.evaluate(()=>{const o={};
  newGame(1,1,21,null,'long');o.long=G.long===true&&G.mode==='pres';
  G.cand=G.cands[0];initPrim();G.phase='prim';render();
  let debs=0,rounds=0;
  while(G.phase==='prim'&&rounds++<12){
   primAct('ads');primAct('tour');endRound();
   if(G.pr&&G.pr.deb){debs++;for(let q=0;q<3;q++)A.pans({i:q%4});A.pdebend()}
  }
  o.rounds=rounds;o.debs=debs;o.phase=G.phase;
  if(G.phase==='vp'){pickVP(0);o.conv=G.phase==='conv';A.convplat({i:0});A.convspeech({i:1});o.afterConv=G.phase==='play'&&G.convDone}
  else{o.lost=G.phase}
  if(G.phase==='play'){let vp=false;for(let w=1;w<=12&&G.phase!=='over';w++){endWeek();if(G.phase==='event'){if(G.ev.id==='vpdebate')vp=true;autoEvent()}}o.vpdebate=vp;o.over=G.phase==='over'}
  return o});
 console.log(JSON.stringify(o),errs.join('|'));
 const ok=o.long&&o.rounds===8&&o.debs===2&&(o.lost||(o.conv&&o.afterConv&&o.vpdebate&&o.over))&&!errs.length;await b.close();process.exit(ok?0:1)})();
