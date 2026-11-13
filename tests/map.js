const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['fr','en','es']){
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.clear();localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tuto.mid','1');localStorage.setItem('cap270.tips','["cand","prim","term"]')}catch(e){}},lang);
await p.goto('file://'+path.resolve('index.html'));
const r=await p.evaluate(()=>{const o={};
 // districts ME/NE
 newGame(1,1,7,null,'pres');pickVP(0);hideModal();G.cash=50;UI.sel='NE';UI.tab='map';render();
 o.distBtn=/data-act="dist"/.test(document.querySelector('#main').innerHTML);
 const a0=G.ap;distCampaign('NE-2');const s=ST('NE');o.dist=G.ap===a0-1&&s.ds&&s.ds['NE-2']>0;
 o.distShow=/NE-2/.test(document.querySelector('#main').innerHTML);
 // midterms : puces par district + redécoupage
 newGame(1,1,8,null,'mid');G.phase='play';G.cash=50;snap();
 const st=G.states.find(q=>q.hs>=15);UI.sel=st.ab;UI.tab='map';render();o.chips=document.querySelectorAll('#main i[style*="width:11px"]').length>=st.hs;
 o.seeded=G.states.some(q=>q.gm);
 UI.tab='actions';render();o.redistPanel=!!document.querySelector('#pRedist');
 const cand=G.states.filter(rdOk).sort((a,b)=>b.hs-a.hs);o.rdCand=cand.length>0;
 const y0=projMid().youH;let ok=false,n=0;for(const q of cand.slice(0,6)){G.ap=3;G.cash=50;redraw(q.ab);if(q.gm&&q.gmMine){ok=true;if(++n>=2)break}}
 o.redraw=ok&&projMid().youH>y0&&G.rd>=1;
 // événements par année
 for(const m of ['h2008','h2012','h2016','h2020','h2024','m2010','m2018','m2022']){newGame(1,1,9,null,m);const ids=YEV[yk()];o[m]=ids.every(i=>G.deck.slice(0,9).includes(i))}
 newGame(1,1,9,null,'pres');o.noYear=!Object.values(YEV).flat().some(i=>G.deck.includes(i));
 return o});
const ok=Object.values(r).every(v=>v)&&!errs.length;if(!ok)bad++;
console.log(ok?'ok  ':'FAIL',lang,JSON.stringify(r),errs);await p.close()}
await b.close();process.exit(bad?1:0)})();
