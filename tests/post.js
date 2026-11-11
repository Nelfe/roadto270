// Post-election: force a razor-thin decisive state and walk through recount / court / electors.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('cap270.lang','en');localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tuto.mid','1');localStorage.setItem('cap270.tips','["cand","prim"]')});
 await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
 const out=await p.evaluate(()=>{
  const o={steps:[],err:null};
  newGame(1,1,+(window.__seed||11),null,'h2020');pickVP(0);hideModal();
  // build a map where D has exactly 270+ev(PA)-... : D wins all states with lean>0 by 5, R rest; then make the tipping state razor thin
  const ord=[...G.states].sort((x,y)=>y.lean-x.lean);let d=0,cand=null;
  ord.forEach(s=>{s.dn=null;if(cand){s.final=-5;return}
    if(!DIST[s.ab]&&d<270&&d+s.ev>=270){cand=s;s.final=.25;d+=s.ev}else{s.final=5;d+=s.ev}});
  G.order=G.states.map(s=>s.ab);G.phase='over';G.me=1;o.tipping=cand.ab;
  UI.night={idx:G.order.length};nightTick();
  let guard=0;
  while(G.post&&!G.post.fin&&guard++<8){const c=G.post.cur;if(!c)break;o.steps.push(c.k);
    A.postch({i:1});A.postnext()}
  o.log=G.post.log.length;o.done=!!G.post.fin;o.fin=document.getElementById('modal').innerText.slice(0,60);
  return o});
 console.log(JSON.stringify(out),errs.join('|'));
 await b.close();process.exit(out.steps.length>0&&out.done&&!errs.length?0:1)})();
