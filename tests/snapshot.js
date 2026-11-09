// Regression snapshot: fixed seeds + an idle bot (only events answered) give exact outcomes; any rule/balance change shows up as a diff.
// node tests/snapshot.js          -> compare with tests/snapshot.json
// node tests/snapshot.js --update -> accept the new numbers (commit them with the change that caused them)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const F=path.join(__dirname,'snapshot.json');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.join(__dirname,'..','index.html'));
 const out=await p.evaluate(()=>{SIM=true;const res={};
  const run=(mode,seed,me)=>{newGame(me,1,seed,null,mode);
   if(G.phase==='cand'){G.cand=G.cands[0];initPrim();G.phase='prim';for(let r=0;r<8&&G.phase==='prim';r++){primAct('ads');endRound()}}
   if(G.phase==='vp')pickVP(0);if(mode==='mid')G.phase='play';
   for(let w=1;w<=12&&G.phase!=='over';w++){endWeek();if(G.phase==='event'){A.choose({i:0});A.evnext()}}
   if(mode==='mid'){const R=G.res;return[R.hCtl,R.sCtl].join('')}
   let d=0;G.states.forEach(s=>comps(s).forEach((k,i)=>{if(s.final+(s.dn?s.dn[i]:0)>0)d+=k[0]}));return d};
  for(const mode of ['pres','mid','h2016','h2020','h2024'])res[mode]=[11,22,33,44,55,66].map((sd,i)=>run(mode,sd,i%2?-1:1));
  return res});
 await b.close();
 if(errs.length){console.log('JS errors',errs);process.exit(1)}
 if(process.argv.includes('--update')||!fs.existsSync(F)){fs.writeFileSync(F,JSON.stringify(out,null,1)+'\n');console.log('snapshot written');process.exit(0)}
 const old=JSON.parse(fs.readFileSync(F,'utf8'));let bad=0;
 for(const k in out)if(JSON.stringify(out[k])!==JSON.stringify(old[k])){bad++;console.log('DIFF',k,'\n  was',JSON.stringify(old[k]),'\n  now',JSON.stringify(out[k]))}
 console.log(bad?'snapshot differs (run with --update if intended)':'snapshot ok');process.exit(bad?1:0);
})();
