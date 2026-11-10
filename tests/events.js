// Every random event: text exists in 3 languages, every choice runs without error and returns a bilingual result.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.join(__dirname,'..','index.html'));
 const r=await p.evaluate(()=>{const out=[];let n=0;
  const ok=v=>v&&typeof v==='object'&&v.fr&&v.en&&v.es&&!/undefined|NaN|\[object/.test(v.fr+v.en+v.es);
  for(const mode of ['pres','mid','h2020'])for(const me of [1,-1])for(const diff of [0,2]){
   newGame(me,diff,99,null,mode);if(G.phase!=='play'){G.cand=G.cand||G.cands[0];G.phase='play'}
   for(const e of EVENTS){if(['debate','vpdebate','third'].includes(e.id))continue;
    e.ch.forEach((c,i)=>{try{newGame(me,diff,99+i,null,mode);G.phase='play';G.wk=6;G.ev={id:e.id,res:null};e.pre&&e.pre();
      for(const lg of ['fr','en','es']){LANG=lg;const x=e.x();if(!x||/undefined|NaN/.test(x))out.push(e.id+' x '+lg)}
      const res=c.fx();n++;if(!ok(res))out.push(e.id+'#'+i+' bad result '+JSON.stringify(res).slice(0,60));
      for(const lg of ['fr','en','es']){LANG=lg;if(!t(e.t)||!t(c.t)||!t(c.d))out.push(e.id+'#'+i+' label '+lg)}
      if(!isFinite(G.cash)||!isFinite(G.img)||!isFinite(G.env))out.push(e.id+' NaN state')}catch(err){out.push(e.id+'#'+i+' threw '+err.message)}})}
  }
  LANG='en';newGame(1,1,5,null,'pres');return{n,ids:EVENTS.length,deck:G.deck.length,out:[...new Set(out)].slice(0,10)}});
 console.log(JSON.stringify(r));await b.close();process.exit(r.out.length||errs.length?1:0)})();
