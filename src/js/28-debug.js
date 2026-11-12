/* ---------- Mode debug (caché, pour tester vite) ----------
   Activation : ouvrir la page avec ?debug=1 (ou ?debug=0 pour couper), ou toucher 5 fois le titre.
   Les parties lancées depuis ici ne comptent pas dans les statistiques. */
const DBG=()=>{try{return localStorage.getItem('cap270.debug')==='1'}catch(e){return false}};
(function(){try{const m=/[?&]debug=([01])/.exec(location.search);if(m)localStorage.setItem('cap270.debug',m[1])}catch(e){}})();
function dbgRow(k,l){return`<button class="btn alt sm" style="margin:3px 3px 0 0" data-act="dbg" data-k="${k}">${l}</button>`}
function dbgPanel(){
  const inG=!!G,ph=inG?G.phase:'';
  let h=`<h2>🛠 Debug</h2><p class="muted" style="font-size:13px">${t('Les parties lancées ici ne comptent pas dans vos statistiques.','Games started here do not count in your stats.','Las partidas iniciadas aquí no cuentan en tus estadísticas.')}</p>`;
  h+=`<p style="margin:8px 0 2px"><b>${t('Lancer directement','Jump straight to','Ir directamente a')}</b></p>${dbgRow('term','Mandat')}${dbgRow('mid','Midterms')}${dbgRow('reel','Réélection')}${dbgRow('play','Campagne (sans primaires)')}`;
  if(inG&&ph==='term')h+=`<p style="margin:8px 0 2px"><b>Mandat</b></p>${dbgRow('t_pc','Capital 12 ◆')}${dbgRow('t_popu','Pop +10')}${dbgRow('t_popd','Pop −10')}${dbgRow('t_maj','Congrès : majorité nette')}${dbgRow('t_min','Congrès : minorité')}${dbgRow('t_end','Aller à la fin du mandat')}${dbgRow('t_ev','Forcer un événement')}${dbgRow('t_ag','Nouvel agenda')}`;
  if(inG&&ph==='play')h+=`<p style="margin:8px 0 2px"><b>Campagne</b></p>${dbgRow('cash','+50 M$')}${dbgRow('ap','+3 actions')}${dbgRow('win','Forcer la victoire → soirée')}${dbgRow('lose','Forcer la défaite → soirée')}${dbgRow('skip','Passer à la semaine 12')}`;
  h+=`<div class="irow" style="margin-top:12px"><button class="btn alt" data-act="dbg" data-k="off">${t('Désactiver le debug','Turn debug off','Desactivar el debug')}</button><button class="btn" data-act="closeHelp">${t('Fermer','Close','Cerrar')}</button></div>`;
  showModal(h,'dbg');
}
function dbgNew(mode){
  const me=typeof pickedSide!=='undefined'?pickedSide:1,df=typeof pickedDiff!=='undefined'?pickedDiff:1;
  newGame(me,df,null,null,mode);G.dbg=true;
}
function dbgRun(k){
  const T=G&&G.term;
  if(k==='off'){try{localStorage.setItem('cap270.debug','0')}catch(e){}hideModal();const b=$('#dbgBtn');if(b)b.remove();return}
  if(k==='term'||k==='reel'){dbgNew('pres');G.cand=G.cands[0];G.natM=(G.me||1)*2.5;const nt=newTerm({dbg:true});if(k==='term'){hideModal();mkShell(nt,G);G.dbg=true;render();return}
    nt.pop=52;nt.midWon=true;hideModal();mkShell(nt,G);G.dbg=true;termToReel();G.dbg=true;return}
  if(k==='mid'){dbgNew('mid');UI.tutoPending=false;hideModal();render();showBrief();return}
  if(k==='play'){dbgNew('pres');G.cand=G.cands[0];applyCand(G.cand,true);applyCand(G.opp,false);G.phase='vp';G.dbg=true;hideModal();render();showBrief();return}
  if(!G)return;
  if(k==='cash'){G.cash+=50}
  else if(k==='ap'){G.ap+=3}
  else if(k==='skip'){G.wk=12}
  else if(k==='win'||k==='lose'){const s=k==='win'?G.me:-G.me;G.states.forEach(q=>{q.final=s*(4+Math.abs(q.lean)*.1);});hideModal();G.wk=13;G.phase='play';endWeek();return}
  else if(T){
    if(k==='t_pc')T.pc=12;
    else if(k==='t_popu')adjT(T,{pop:10});
    else if(k==='t_popd')adjT(T,{pop:-10});
    else if(k==='t_maj'){const m=side(),o=oside();T.h[m]=250;T.h[o]=185;T.s[m]=60;T.s[o]=40}
    else if(k==='t_min'){const m=side(),o=oside();T.h[m]=205;T.h[o]=230;T.s[m]=46;T.s[o]=54}
    else if(k==='t_end'){T.q=T.qmax+1;save();render();showTermEnd();return}
    else if(k==='t_ev'){const e=TEVENTS[Math.floor(rnd()*TEVENTS.length)];T.ev=e.id;T.evRes=null;save();render();showTev();return}
    else if(k==='t_ag')newAgenda();
  }
  save();hideModal();render();
}
function dbgInstall(){
  if(!DBG()||$('#dbgBtn'))return;
  const b=document.createElement('button');b.id='dbgBtn';b.textContent='🛠';b.setAttribute('aria-label','Debug');
  b.style.cssText='position:fixed;right:8px;top:8px;z-index:50;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:var(--surface);opacity:.75;font-size:16px;padding:0';
  b.onclick=dbgPanel;document.body.appendChild(b);
}
let _dbgTaps=0,_dbgT=0;
document.addEventListener('click',e=>{
  if(e.target.closest&&e.target.closest('#title h1')){const n=Date.now();_dbgTaps=n-_dbgT<1500?_dbgTaps+1:1;_dbgT=n;
    if(_dbgTaps>=5){_dbgTaps=0;try{localStorage.setItem('cap270.debug',DBG()?'0':'1')}catch(x){}const b=$('#dbgBtn');if(b)b.remove();dbgInstall();toast(DBG()?'Debug ON':'Debug OFF')}}
});
if(document.readyState!=='loading')dbgInstall();else document.addEventListener('DOMContentLoaded',dbgInstall);
