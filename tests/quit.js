const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['fr','en','es']){
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.clear();localStorage.setItem('cap270.lang',l);localStorage.setItem('cap270.tuto','1');localStorage.setItem('cap270.tips','["cand","prim","term"]')}catch(e){}},lang);
await p.goto('file://'+path.resolve('index.html'));
const o={};
await p.evaluate(()=>{newGame(1,1,5,null,'pres');render()});            // choix du candidat
o.cand=await p.evaluate(()=>!!document.querySelector('#hudTop [data-act="quit"]'));
await p.evaluate(()=>{G.cand=G.cands[0];pickVP&&0;G.phase='vp';pickVP(0);hideModal();render()});  // en jeu
o.hud=await p.evaluate(()=>!!document.querySelector('#hudTop [data-act="quit"]'));
await p.evaluate(()=>{G.phase='play';nextEvent();showEvent()});          // événement : fenêtre modale
o.modal=await p.evaluate(()=>!!document.querySelector('#modal .sheet [data-act="quit"]'));
await p.click('#modal [data-act="quit"]');
o.ask=await p.evaluate(()=>!!document.querySelector('#modal [data-act="quityes"]'));
await p.click('#modal [data-act="closeHelp"]');
o.stay=await p.evaluate(()=>G&&!$('#game').hidden&&!!document.querySelector('#modal .ch'));
await p.click('#modal [data-act="quit"]');await p.click('#modal [data-act="quityes"]');
o.home=await p.evaluate(()=>!$('#title').hidden&&$('#game').hidden&&!!loadSaves().length);
const ok=Object.values(o).every(v=>v)&&!errs.length;if(!ok)bad++;console.log(ok?'ok  ':'FAIL',lang,JSON.stringify(o),errs);await p.close()}
await b.close();process.exit(bad?1:0)})();
