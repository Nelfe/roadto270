/* ---------- Confort : annuler, accélérer, animations, sons ---------- */
// ---- Annuler (jusqu'à 5 coups dans la semaine en cours)
const UNDO={st:[],max:5,
  snap(){G.rs=_s;return JSON.stringify(G)},
  clear(){UNDO.st=[]},
  wrap(k){const f=A[k];A[k]=function(...a){
    if(SIM||!G||G.phase!=='play')return f.apply(this,a);
    const before=UNDO.snap(),ui=UI.sel;f.apply(this,a);
    if(G&&G.phase==='play'&&UNDO.snap()!==before){UNDO.st.push({s:before,ui});if(UNDO.st.length>UNDO.max)UNDO.st.shift();if(UI&&!$('#game').hidden)render()}
  }}};
['ads','early','hire','fire','viral','usefulvote','field','visit','poll','pos','agenda','fund','media','prep','target','analyst'].forEach(k=>{if(A[k])UNDO.wrap(k)});
{const f=A.end;A.end=function(...a){UNDO.clear();return f.apply(this,a)}}
A.undo=function(){
  if(!UNDO.st.length||!G||G.phase!=='play')return;
  const u=UNDO.st.pop();G=JSON.parse(u.s);if(G.rs)_s=G.rs>>>0;UI.sel=u.ui;SND.play('undo');save();render();toast(t('Dernier coup annulé.','Last move undone.','Última acción deshecha.'));
};
const undoBtn=()=>UNDO.st.length&&G&&G.phase==='play'?`<button class="help" data-act="undo" aria-label="${t('Annuler le dernier coup','Undo last move','Deshacer la última acción')}" style="margin-right:6px">↶</button>`:'';

// ---- Simulation accélérée : fait avancer les semaines en résolvant les événements au plus prudent
function autoEvent(){
  const e=EVENTS.find(q=>q.id===G.ev.id);let r;
  if(e.id==='debate'||e.id==='vpdebate'){debAuto(2);r=G.ev.res}
  else{let i=e.ch.findIndex(c=>c.d===FREE);if(i<0)i=e.ch.length-1;r=e.ch[i].fx();G.ev.res=r;L('news',B(`${e.t.fr} : ${r.fr}`,`${e.t.en}: ${r.en}`,`${e.t.es||e.t.en}: ${r.es||r.en}`))}
  A.evnext();
}
function runAuto(n){
  for(let i=0;i<n&&G&&G.phase==='play';i++){
    endWeek();
    let guard=0;while(G&&G.phase==='event'&&guard++<4)autoEvent();
  }
  UNDO.clear();save();render();
}
A.auto=function(d){
  if(!can())return;const n=+d.n,left=13-G.wk;
  if(n===1)return runAuto(1);
  const k=Math.min(n,left);
  showModal(`<h2>${t('Simulation accélérée','Fast-forward','Avance rápida')}</h2><p>${t(`Passer ${k>=left?'jusqu’à l’élection':k+' semaines'} sans agir : vos ressources restent en banque et les événements sont résolus de la façon la plus prudente. L’adversaire, lui, continue.`,`Skip ${k>=left?'to election day':k+' weeks'} without acting: your resources stay in the bank and events are settled the safest way. Your opponent keeps going.`,`Avanzar ${k>=left?'hasta el día de las elecciones':k+' semanas'} sin actuar: tus recursos se quedan en el banco y los eventos se resuelven de la forma más prudente. Tu rival sigue adelante.`)}</p><button class="btn full" data-act="autogo" data-n="${k}">${t('Confirmer','Confirm','Confirmar')}</button><button class="btn alt full" style="margin-top:8px" data-act="closeHelp">${t('Annuler','Cancel','Cancelar')}</button>`);
};
A.autogo=function(d){hideModal();runAuto(+d.n)};
const autoHTML=()=>`<div class="card"><div><h3>${t('Simulation accélérée','Fast-forward','Avance rápida')}</h3><p>${t('Passez des semaines sans agir (les événements sont réglés au plus prudent).','Skip weeks without acting (events are settled the safest way).','Avanza semanas sin actuar (los eventos se resuelven de la forma más prudente).')}</p></div><div class="irow"><button class="btn sm alt" data-act="auto" data-n="1">+1</button><button class="btn sm alt" data-act="auto" data-n="3">+3</button><button class="btn sm alt" data-act="auto" data-n="12">${t('Fin','End','Fin')}</button></div></div>`;

// ---- Animations de carte : une tuile qui change de couleur pulse
let _tilePrev=null,_tileKey='';
function animTiles(){
  if(SIM||!SET.anim)return;
  const tiles=[...document.querySelectorAll('.map .tile')];if(!tiles.length){_tilePrev=null;return}
  const sig=tiles.map(b=>b.style.background),key=(G&&G.seed)+'|'+(UI&&UI.night?'n':'p');
  if(_tilePrev&&_tileKey===key&&_tilePrev.length===sig.length)sig.forEach((v,i)=>{if(v!==_tilePrev[i])tiles[i].classList.add('pulse')});
  _tilePrev=sig;_tileKey=key;
}
{const r0=render;render=function(){r0();animTiles()}}

// ---- Sons et musique (synthétisés, aucun fichier ; désactivables dans les réglages)
const SND=(()=>{
  let ctx=null,master=null,musTimer=null,step=0;
  const ok=()=>{try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ctx=new C();master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume();return true}catch(e){return false}};
  const tone=(f,d,type='sine',v=.12,at=0,to=null)=>{const t0=ctx.currentTime+at,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(to)o.frequency.exponentialRampToValueAtTime(to,t0+d);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(master);o.start(t0);o.stop(t0+d+.05)};
  const FX={
    click(){tone(720,.06,'triangle',.07)},
    coin(){tone(988,.08,'square',.05);tone(1319,.16,'square',.05,.07)},
    tick(){tone(520,.04,'triangle',.05)},
    undo(){tone(600,.12,'sine',.08,0,300)},
    end(){tone(300,.3,'sawtooth',.04,0,90)},
    alert(){tone(660,.12,'triangle',.09);tone(880,.2,'triangle',.09,.12)},
    win(){[523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.1,i*.14))},
    lose(){[392,349,311,262].forEach((f,i)=>tone(f,.45,'sine',.1,i*.2))}
  };
  const CH=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];
  const music=()=>{const c=CH[Math.floor(step/8)%4],i=step%8;
    if(i===0)c.forEach(f=>tone(f/2,3.2,'triangle',.035));
    if(i%2===0)tone(c[(i/2)%3]*2,.9,'sine',.03);step++};
  return{
    play(n){if(SIM||!SET.snd||!FX[n]||!ok())return;try{FX[n]()}catch(e){}},
    sync(){
      if(SIM)return;
      if(SET.mus&&ok()){if(!musTimer)musTimer=setInterval(()=>{if(!document.hidden&&SET.mus)music()},420)}
      else if(musTimer){clearInterval(musTimer);musTimer=null}
    }
  };
})();
// sounds attached to actions, events and election night
const _sfx={ads:'coin',fund:'coin',field:'coin',visit:'click',poll:'click',pos:'click',agenda:'click',media:'click',prep:'click',target:'click',early:'click',hire:'click',fire:'click',end:'end',choose:'click',dans:'click',dstart:'click',vp:'click',tab:'click',sel:'tick'};
Object.keys(_sfx).forEach(k=>{const f=A[k];if(!f)return;A[k]=function(...a){SND.play(_sfx[k]);return f.apply(this,a)}});
{const se=showEvent;showEvent=function(){const fresh=G&&G.phase==='event'&&G.ev&&G.ev.res===null&&!G.ev.deb;se();if(fresh)SND.play('alert')}}
{const nt=nightTick;nightTick=function(first){nt(first);if(UI.night&&G){if(UI.night.idx<G.order.length)SND.play('tick');else if(!G.sndDone&&G.win!=null){G.sndDone=1;SND.play(G.win?'win':'lose')}}}}
document.addEventListener('click',()=>SND.sync(),{once:false});
