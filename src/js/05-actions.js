/* ---------- Actions ---------- */
const can=()=>G.phase==='play';
function needAP(n){if(G.ap<n){toast(t('Plus assez d’actions cette semaine.','Not enough actions this week.'));return false}G.ap-=n;return true}
function needCash(c){if(G.cash<c-1e-9){toast(t('Fonds insuffisants.','Not enough funds.'));return false}G.cash-=c;G.spentP+=c;return true}
const noAP=()=>toast(t('Plus assez d’actions.','Not enough actions.'));
const A={
 sel(d){UI.sel=d.ab;render()},
 tab(d){UI.tab=d.tab;if(d.tab==='log')G.seen=G.log.length;render();window.scrollTo(0,0)},
 ads(d){if(!can())return;const s=ST(UI.sel),ch=UI.ch||'tv',n=+d.n,c=adCost(s)*n*CHC[ch];if(!needCash(c))return;const u=adCost(s)*n*chPow(s,ch)*(ch==='tv'&&trP().includes('media')?1.15:1);if(ch==='tv')s.tvP+=u;else if(ch==='dig')s.dgP+=u;else s.raP+=u;s.adsP=s.tvP+s.dgP+s.raP;s.spP+=c;save();render()},
 ch(d){UI.ch=d.c;render()},
 early(){if(!can())return;const s=ST(UI.sel);if(G.wk<8){toast(t('Le vote anticipé s’ouvre à la semaine 8.','Early voting opens in week 8.'));return}if(s.ebP>=3){toast(t('Maximum atteint.','Maximum reached.'));return}if(G.ap<1){noAP();return}if(!needCash(2))return;G.ap--;s.ebP++;s.spP+=2;L('you',both(()=>t(`Opération vote anticipé en ${sn(s)}.`,`Early-vote drive in ${sn(s)}.`)));save();render()},
 hire(d){if(!can())return;const o=G.offers[d.r][+d.i];if(G.cash<o.sal){toast(t('Fonds insuffisants.','Not enough funds.'));return}G.cash-=o.sal;G.staff[d.r]=o;const r=STAFF.find(q=>q.id===d.r);L('you',both(()=>t(`Recrutement : ${o.n} (${r.n.fr}, niveau ${SKN[o.sk]}).`,`Hired ${o.n} (${r.n.en}, level ${SKN[o.sk]}).`)));save();render()},
 fire(d){if(!can())return;delete G.staff[d.r];save();render()},
 viral(){if(!can()||!G.viral||G.viral.resp)return;if(G.ap<1){noAP();return}G.ap--;G.viral.resp=true;save();render()},
 usefulvote(){if(!can()||!G.third)return;if(G.ap<1){noAP();return}G.ap--;G.third.pow=Math.max(0,G.third.pow-.4);L('you',B('Appel au vote utile : l’indépendant perd du terrain.','Strategic-voting appeal: the independent loses ground.'));save();render()},
 field(){if(!can())return;const s=ST(UI.sel);if(s.fieldP>=3){toast(t('Maximum de 3 bureaux.','Maximum of 3 offices.'));return}if(G.ap<1){noAP();return}if(!needCash(fcost(s,true)))return;G.ap--;s.fieldP++;s.spP+=fcost(s,true);L('you',both(()=>t(`Bureau de campagne ouvert en ${sn(s)}.`,`Campaign office opened in ${sn(s)}.`)));save();render()},
 visit(){if(!can())return;const s=ST(UI.sel);if(G.ap<1){noAP();return}if(!needCash(.3))return;G.ap--;s.buzzP=Math.min(2.4,s.buzzP+1.3);L('you',both(()=>t(`Visite en ${sn(s)}.`,`Visit to ${sn(s)}.`)));save();render()},
 poll(){if(!can())return;const s=ST(UI.sel);if(s.internal!==null)return;if(!needCash(pollCost()))return;s.internal=margin(s)+randn()*.4;save();render()},
 pos(d){if(!can())return;const i=+d.i,sd=side(),np=clamp(G.pos[sd][i]+ +d.d,-2,2);if(np===G.pos[sd][i])return;if(!needAP(1))return;G.pos[sd][i]=np;G.posMoves=(G.posMoves||0)+1;const nm=ISSUES[i].n;L('you',B(`Nouvelle position sur « ${nm.fr} ».`,`New position on “${nm.en}”.`));save();render()},
 agenda(d){if(!can())return;const i=+d.i;if(!needAP(1))return;G.sal[i]=clamp(G.sal[i]+.14,.1,1.6);G.sal=G.sal.map((v,k)=>k===i?v:Math.max(.1,v-.02));const nm=ISSUES[i].n;L('you',B(`Vous mettez « ${nm.fr} » à l’agenda.`,`You put “${nm.en}” on the agenda.`));save();render()},
 fund(){if(!can()||!needAP(1))return;const r=4+rnd()*3+Math.max(0,G.me*G.img)*1.5+.5*sk('fin');G.cash+=r;L('you',both(()=>t(`Collecte de fonds : ${fM(r)}.`,`Fundraising: ${fM(r)}.`)));save();render()},
 media(){if(!can()||!needAP(1))return;const r=rnd(),gf=wkP()==='gaffe';if(r<(gf?.45:.6)+.04*sk('com')){H.img(.25);L('you',B('Grande interview : bien reçue.','Major interview: well received.'))}else if(r<(gf?.7:.85)+.03*sk('com'))L('you',B('Grande interview : sans effet notable.','Major interview: no notable effect.'));else{H.img(-.5);L('you',B('Grande interview : un dérapage fait polémique.','Major interview: a slip sparks controversy.'))}save();render()},
 prep(){if(!can())return;if(G.prep>=3){toast(t('Préparation au maximum.','Preparation already at maximum.'));return}if(!needAP(1))return;G.prep++;L('you',B(`Préparation du débat (${G.prep}/3).`,`Debate prep (${G.prep}/3).`));save();render()},
 end(){endWeek()},
 choose(d){const e=EVENTS.find(q=>q.id===G.ev.id);const r=e.ch[+d.i].fx();G.ev.res=r;if(e.id==='debate'||e.id==='vpdebate'){save();showEvent();return}L('news',B(`${e.t.fr} : ${r.fr}`,`${e.t.en}: ${r.en}`,`${e.t.es||e.t.en}: ${r.es||r.en}`));save();showEvent()},
 evnext(){G.ev=null;G.phase='play';hideModal();save();render()},
 analyst(){G.analyst=!G.analyst;save();render()},
 target(d){if(!can())return;const i=+d.i;if(G.ap<1){noAP();return}if(!needCash(1.5*(1-.1*sk('mgr'))))return;G.ap--;G.tgtP[i]=Math.min(2,G.tgtP[i]+1);const nm=GROUPS[i].n;L('you',B(`Campagne ciblée auprès des ${nm.fr.toLowerCase()}.`,`Targeted outreach to ${nm.en.toLowerCase()}.`));save();render()},
 vp(d){pickVP(+d.i)},
 skip(){UI.night.idx=G.order.length;nightTick()},
 help(){showModal(helpHTML(!!G&&G.phase==='play'),'help')},
 settings(){showModal(settingsHTML(),'set')},
 stats(){showModal(statsHTML(),'stats')},
 set(d){SET[d.k]=+d.v;try{localStorage.setItem('cap270.set',JSON.stringify(SET))}catch(e){}applySet();SND.sync();showModal(settingsHTML(),'set');if(G&&!$('#game').hidden)render()},
 daily(){newGame(pickedSide,pickedDiff,hashStr('daily-'+dayStr()+pickedMode),dayStr(),pickedMode);render();if(G.mode==='mid')showBrief()},
 del(d){if(confirm(t('Supprimer cette partie ?','Delete this game?'))){dropSave(+d.slot);renderTitle()}},
 copycode(){copyText(codeOf(G.seed))},
 share(){if(navigator.share)navigator.share({text:UI.share}).catch(()=>{});else copyText(UI.share)},
 closeHelp(){hideModal();if(G){if(G.phase==='event')showEvent();else if(G.phase==='vp')showBrief()}},
 tutoNext(){if(UI.tuto>=TUTO.length-1){UI.tuto=null;tutoMark();render()}else tutoGo(UI.tuto+1)},
 tutoSkip(){UI.tuto=null;tutoMark();render()},
 tutoRestart(){hideModal();tutoGo(0)},
 lang(d){setLang(d.l)},
 midstart(){G.phase='play';snap();hideModal();save();render()},
 pickc(d){G.cand=G.cands[+d.i];
  if(UI.skipPrim){G.pr=null;applyCand(G.cand,true);applyCand(G.opp,false);G.cash=clamp(PARAM.pcash+4+DM.cash[G.diff],16,46);G.phase='vp';L('news',both(()=>t(`${G.cand.n} est le candidat de votre parti (primaires sautées). L’adversaire : ${G.opp.n}.`,`${G.cand.n} is your party’s nominee (primaries skipped). The opponent: ${G.opp.n}.`,`${G.cand.n} es el candidato de tu partido (primarias omitidas). El rival: ${G.opp.n}.`)));save();render();showBrief();window.scrollTo(0,0);return}
  initPrim();G.phase='prim';save();render();window.scrollTo(0,0)},
 rerollc(){const used=[G.opp.n];G.cands=[0,1,2].map(()=>genCand(side(),used));save();render();window.scrollTo(0,0)},
 skipp(){UI.skipPrim=!UI.skipPrim;try{localStorage.setItem('cap270.skipPrim',UI.skipPrim?'1':'')}catch(e){}render()},
 pbase(){primAct('base')},pcenter(){primAct('center')},pads(){primAct('ads')},ptour(){primAct('tour')},pfund(){primAct('fund')},patk(d){primAct('attack',d)},pend(){endRound();window.scrollTo(0,0)},
 restart(){hideModal();G=null;UI.tuto=null;$('#game').hidden=true;$('#dock').hidden=true;$('#coach').hidden=true;document.body.classList.remove('tuto');renderTitle();$('#title').hidden=false}
};

function endWeek(){
  if(!can())return;
  G.cash+=PARAM.income+(trP().includes('funds')?1.5:0)+(trP().includes('frugal')?.5:0)-(wkP()==='broke'?1:0)+.3*sk('fin')-staffCost()-.08*G.states.reduce((a,s)=>a+s.fieldP*fieldCost(s),0);
  G.cash=Math.max(0,G.cash);
  oppTurn();
  G.states.forEach(s=>{s.tvP*=.85;s.dgP*=.72;s.raP*=.9;s.adsP=s.tvP+s.dgP+s.raP;s.adsO*=.85;s.buzzP*=.5;s.buzzO*=.5;s.noise=randn()*1.2*DM.noise[G.diff];s.internal=null;s.shock*=.88});
  G.tgtP=G.tgtP.map(v=>v*.75);G.tgtO=G.tgtO.map(v=>v*.75);
  G.econ=clamp(G.econ*.9+randn()*.18,-3,3);
  G.env+=randn()*.25;G.sal=G.sal.map((v,i)=>v+(((G.sal0||S0)[i])-v)*.12);
  applyViral();if(G.third&&G.third.on)G.third.pow*=(G.wk<8?.98:.88)*(trP().includes('bridge')?.96:1)*(wkP()==='divisive'?1.03:1);
  if(sk('pol')>=2)G.hint=G.me*G.pbNat+randn()*(1.1-.25*sk('pol'));
  G.wk++;
  if(G.wk>12){election();return}
  G.ap=Math.max(0,3+G.apNext);G.apNext=0;
  rollViral();nextEvent();snap();save();render();showEvent();
}
