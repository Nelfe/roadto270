// Undo, fast-forward, animation class, settings toggles.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('cap270.lang','en');localStorage.setItem('cap270.tuto','1')});
 await p.goto('file://'+(process.env.GAME_FILE||path.join(__dirname,'..','index.html')));
 const r=await p.evaluate(()=>{const o={};
  newGame(1,1,5,null,'h2024');pickVP(0);hideModal();render();
  const ap0=G.ap,cash0=G.cash;UI.sel='PA';A.visit();A.ads({n:1});o.moved=G.ap<ap0&&G.cash<cash0;o.undoBtn=!!document.querySelector('[data-act=undo]');
  A.undo();A.undo();o.undone=G.ap===ap0&&G.cash===cash0;o.undoEmpty=UNDO.st.length===0;
  A.auto({n:1});o.wk2=G.wk===2;
  A.autogo({n:3});o.wk5=G.wk===5;
  A.autogo({n:12});o.over=G.phase==='over';
  SET.snd=0;SET.mus=0;SND.play('win');SND.sync();o.silent=true;
  return o});
 console.log(JSON.stringify(r),errs.join('|'));
 const ok=Object.values(r).every(Boolean)&&!errs.length;await b.close();process.exit(ok?0:1)})();
