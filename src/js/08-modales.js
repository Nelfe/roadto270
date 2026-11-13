/* ---------- Modales ---------- */
function showModal(h,k){if(SIM)return;const m=$('#modal'),same=!!k&&!m.hidden&&UI.mk===k,old=same&&m.querySelector('.sheet'),st=old?old.scrollTop:0;UI.mk=k||null;m.innerHTML=`<div class="sheet${same?' noanim':''}">${h}</div>`;m.hidden=false;if(same){const s=m.querySelector('.sheet');if(s)s.scrollTop=st}}
function hideModal(){UI.mk=null;$('#modal').hidden=true}
function showEvent(){
  if(SIM)return;
  if(!G.ev||G.phase!=='event'){hideModal();return}
  const e=EVENTS.find(q=>q.id===G.ev.id);
  const title=e.id==='debate'?(G.wk===5?t('Premier débat','First debate'):t('Second débat','Second debate')):t(e.t);
  if(e.id==='debate'||e.id==='vpdebate'){showDebate();return}
  if(G.ev.res===null)showModal(`<h2>${title}</h2><p>${e.x()}</p>${e.ch.map((c,i)=>`<button class="ch" data-act="choose" data-i="${i}"><b>${t(c.t)}</b><small>${t(c.d)}</small></button>`).join('')}`);
  else showModal(`<h2>${title}</h2><div class="res">${t(G.ev.res)}</div><button class="btn full" data-act="evnext">${t('Continuer','Continue')}</button>`);
}
function showBrief(){
  if(G.mode==='mid'){midstartBrief();return}
  const o=G.me*(G.env-PARAM.neutral),mood=o>1?t('plutôt porteuse pour votre camp','rather favorable to your side'):o<-1?t('plutôt difficile pour votre camp','rather difficult for your side'):t('incertaine','uncertain');
  const ec=G.econ>.6?t('tourne bien','is doing well'):G.econ<-.6?t('ralentit','is slowing'):t('est stable','is stable');
  showModal(`<h2>${G.scn?t(SCN[G.scn].head):t('Novembre 2028','November 2028')}</h2>${G.scn?`<p><b>${t(SCN[G.scn].tag)}</b></p><p>${t(SCN[G.scn].blurb)}</p>`:''}${G.chal?`<p><b>${t('Fracture dans votre parti : un challenger se présente contre vous. Vous partez avec moins d’argent et un climat plus difficile.','A split in your party: a challenger runs against you. You start with less money and a tougher climate.','Fractura en tu partido: un rival se presenta contra ti. Empiezas con menos dinero y un clima más difícil.')}</b></p>`:''}${G.pr&&G.pr.won?`<p><b>${t('Investiture remportée','Nomination won')}</b> : ${G.cand.n}, ${Math.round(G.pr.final.you*100)} % ${t('des délégués','of delegates')}.</p>`:''}<p>${t(`Le parti ${incName()} tient la Maison-Blanche. L’humeur du pays est ${mood}. L’économie ${ec}. Vous avez ${fm0(G.cash)} en caisse et 12 semaines devant vous.`,`The ${incName()} party holds the White House. The national mood is ${mood}. The economy ${ec}. You have ${fm0(G.cash)} in the bank and 12 weeks ahead.`)}</p>${G.opp&&G.opp.pf?`<p>${t('Votre adversaire','Your opponent','Tu rival')} : <b>${G.opp.n}</b>. ${rivalLine()}</p>`:''}${G.seed!=null?`<p class="muted" style="font-size:13px">${G.daily?t('Défi du jour','Daily challenge')+' · ':''}${t('Code de partie','Game code')} : <span class="mono">${codeOf(G.seed)}</span></p>`:''}<p><b>${t('Choisissez votre colistier.','Choose your running mate.')}</b></p>${VPS[side()].map((v,i)=>`<button class="ch" data-act="vp" data-i="${i}"><b>${v.n}</b><small>${t(v.r)}. ${t(v.d)}.</small></button>`).join('')}`);
}
function election(){
  G.phase='over';const eN=randn()*1.5;
  G.states.forEach(s=>{s.final=margin(s)+eN+((G.regSh||{})[s.reg]||0)+(G.tur||0)*((s.tl||.42)-.42)*6+randn()*1.4;s.dn=comps(s).map((k,i)=>i?k[1]+randn()*1.5:0)});
  G.order=G.states.slice().sort((a,b)=>(Math.abs(b.final)+randn()*6)-(Math.abs(a.final)+randn()*6)).map(s=>s.ab);
  if(G.mode==='mid'){G.states.forEach(s=>{s.hD=s.dz.filter(z=>s.final+G.HK+z>0).length;s.sD=s.sen?(s.final+senAdj(s)>0?'D':'R'):null});G.res=midResult()}
  if(SIM)return;
  UI.night={idx:0};save();render();nightTick(true);
}

function nightMid(first){
  const n=UI.night,rev=new Set(G.order.slice(0,n.idx)),done=n.idx>=G.order.length;
  let hD=0,hR=0,sD=HOLD.D,sR=HOLD.R;
  rev.forEach(a=>{const q=ST(a);hD+=q.hD;hR+=q.hs-q.hD;if(q.sen){if(q.sD==='D')sD++;else sR++}});
  const m1=G.me===1,hM=m1?hD:hR,hO=m1?hR:hD,sM=m1?sD:sR,sO=m1?sR:sD;
  const col=(v,c,l)=>`<div class="big" style="color:${c}">${v}</div><span class="muted">${l}</span>`;
  let body=`<h2>${t('Soirée électorale','Election night')}</h2><div class="score"><div><span class="muted">${t('Vous','You')}</span>${col(hM,myC(),t('Chambre (218)','House (218)'))}${col(sM,myC(),t('Sénat (51)','Senate (51)'))}</div><div style="text-align:right"><span class="muted">${t('Adversaire','Opponent')}</span>${col(hO,opC(),t('Chambre','House'))}${col(sO,opC(),t('Sénat','Senate'))}</div></div>${mapHTML('final',rev)}`;
  if(!done)body+=`<button class="btn alt full" data-act="skip">${t('Passer au résultat','Skip to the result')}</button>`;
  else{
    const R=G.res,sw=side(),hw=R.hCtl===sw,sc=R.sCtl===sw,won=(hw?1:0)+(sc?1:0);
    const win=G.win!=null?G.win:(G.win=hw),newA=G.rec?(G.newA||[]):finishMid(win,won,hM,sM);
    const head=won===2?t('Victoire totale : vous contrôlez les deux chambres du Congrès.','Total victory: you control both chambers of Congress.'):hw?t('Victoire : vous prenez la Chambre, mais pas le Sénat.','Victory: you win the House, but not the Senate.'):sc?t('Défaite : vous tenez le Sénat mais perdez la Chambre.','Defeat: you hold the Senate but lose the House.'):t('Défaite : vous ne contrôlez aucune chambre.','Defeat: you control neither chamber.');
    const flips=G.states.filter(q=>q.sen&&q.sD!==q.sen).map(q=>`${q.ab} (→${q.sD})`).join(', ');
    body+=`<div class="res"><b>${head}</b><br>${t('Chambre','House')} : ${hM}–${hO}. ${t('Sénat','Senate')} : ${sM}–${sO}${R.sD===50?` (${t('égalité : la vice-présidence tranche','tie: the vice-presidency decides')})`:''}. ${flips?`${t('Sièges du Sénat qui changent de camp','Senate seats that flip')} : ${flips}.`:t('Aucun siège du Sénat ne change de camp.','No Senate seat flips.')}</div>${recapHTML(hM,{lo:140,hi:300,thr:218})}${achHTML(newA)}${G.chain?`<button class="btn full" style="margin-top:12px" data-act="chainnext">${t('Poursuivre le mandat','Continue the term','Continuar el mandato')}</button>`:''}<div class="irow" style="margin-top:12px"><button class="btn alt" data-act="share">${t('Partager','Share')}</button><button class="btn" data-act="restart">${t('Nouvelle partie','New game')}</button></div>`;
    if(G.chain)save();else dropSave(G.slot);
  }
  showModal(body,'night');
  if(!done){clearTimeout(nightTick.h);nightTick.h=setTimeout(()=>{n.idx++;nightTick()},first?700:130)}
}
function finishMid(win,won,hM,sM){
  if(G.dbg){G.rec=true;G.newA=[];return[]}
  const S=getStats(),sd=side();
  S.g++;if(win)S.w++;S.sd[sd][0]++;if(win)S.sd[sd][1]++;S.df[G.diff][0]++;if(win)S.df[G.diff][1]++;
  S.st=win?S.st+1:0;S.bst=Math.max(S.bst,S.st);
  if(G.daily){S.dl=S.dl||{};S.dl[G.daily]=win?1:0}
  const c={win,mine:0,diff:G.diff,flips:0,cash:G.cash,mn:999,daily:!!G.daily,S,pres:false,mid:{won,sw:G.res.sCtl===sd}},got=[];
  ACH.forEach(a=>{if(!S.ach[a.id]&&a.ck(c)){S.ach[a.id]=Date.now();got.push(a.id)}});
  TEL.send('end',{mode:'mid',diff:G.diff,side:G.me,win:+!!win});
  S.h.unshift({t:Date.now(),me:G.me,df:G.diff,win,ev:0,op:0,mid:1,hM,sM,seed:G.seed,daily:G.daily});S.h=S.h.slice(0,30);
  try{localStorage.setItem(STK,JSON.stringify(S))}catch(e){}
  G.rec=true;G.newA=got;
  UI.share=`Road to 270 · ${t('Midterms','Midterms')} · ${win?t('Victoire','Victory'):t('Défaite','Defeat')} · ${t('Chambre','House')} ${hM} · ${t('Sénat','Senate')} ${sM} (${sd==='D'?t('Démocrate','Democrat'):t('Républicain','Republican')}, ${DIFFN()[G.diff]})${G.seed!=null?' · '+t('code','code')+' '+codeOf(G.seed):''}`+(/^https?:/.test(location.protocol)?'\n'+location.origin+location.pathname:'');
  return got;
}
function midstartBrief(){
  const o=G.me*(G.env-PARAM.neutral),mood=o>1?t('plutôt porteuse pour votre camp','rather favorable to your side'):o<-1?t('plutôt difficile pour votre camp','rather difficult for your side'):t('incertaine','uncertain');
  const ec=G.econ>.6?t('tourne bien','is doing well'):G.econ<-.6?t('ralentit','is slowing'):t('est stable','is stable');
  showModal(`<h2>${G.mscn?t(MSCN[G.mscn].head):t('Midterms 2030','Midterms 2030')}</h2>${G.mscn?`<p><b>${t(MSCN[G.mscn].tag)}</b></p><p>${t(MSCN[G.mscn].blurb)}</p>`:''}<p>${t(`Le parti ${incName()} tient la Maison-Blanche. L’humeur du pays est ${mood}. L’économie ${ec}. Vous dirigez la campagne nationale de votre parti, avec ${fm0(G.cash)} en caisse et 12 semaines devant vous.`,`The ${incName()} party holds the White House. The national mood is ${mood}. The economy ${ec}. You run your party’s national campaign, with ${fm0(G.cash)} in the bank and 12 weeks ahead.`)}</p>
  <p><b>${t('Objectif','Goal')}</b> : ${t('conquérir la Chambre (218 sièges sur 435) pour gagner ; prendre aussi le Sénat (51 sièges sur 100 ; 50 suffisent pour le parti du président, grâce à la vice-présidence) est une victoire totale. Le parti du président perd en général du terrain lors des élections de mi-mandat. Les 35 sièges du Sénat en jeu sont marqués d’une ★ sur la carte.','win the House (218 of 435 seats) to win the game; taking the Senate too (51 of 100; 50 is enough for the president’s party, thanks to the vice-presidency) is a total victory. The president’s party usually loses ground in midterms. The 35 Senate seats up for election are marked with a ★ on the map.')}</p>
  ${G.seed!=null?`<p class="muted" style="font-size:13px">${G.daily?t('Défi du jour','Daily challenge')+' · ':''}${t('Code de partie','Game code')} : <span class="mono">${codeOf(G.seed)}</span></p>`:''}
  <button class="btn full" data-act="midstart">${t('Commencer la campagne','Start the campaign')}</button>`);
}
function nightTick(first){
  if(G.mode==='mid')return nightMid(first);
  const n=UI.night;let dEV=0,rEV=0;const rev=new Set(G.order.slice(0,n.idx));
  rev.forEach(a=>{const s=ST(a);comps(s).forEach((k,i)=>{if(s.final+(s.dn?s.dn[i]:0)>0)dEV+=k[0];else rEV+=k[0]})});
  const done0=n.idx>=G.order.length;if(done0&&G.fl){dEV+=G.fl.d||0;rEV+=G.fl.r||0}
  const mine=G.me===1?dEV:rEV,theirs=G.me===1?rEV:dEV,done=done0;
  if(done&&!G.rec&&postPending()){showPost();return}
  let body=`<h2>${t('Soirée électorale','Election night')}</h2><div class="score"><div><span class="muted">${t('Vous','You')}</span><div class="big" style="color:${myC()}">${mine}</div></div><div style="text-align:right"><span class="muted">${t('Adversaire','Opponent')}</span><div class="big" style="color:${opC()}">${theirs}</div></div></div>${mapHTML('final',rev)}`;
  if(!done)body+=`<button class="btn alt full" data-act="skip">${t('Passer au résultat','Skip to the result')}</button>`;
  else{
    const tie=mine===269&&theirs===269,win=G.win!=null?G.win:(G.win=mine>=270||(tie&&rnd()<.5)),newA=G.rec?(G.newA||[]):finish(win,mine,theirs);
    const close=G.states.filter(s=>Math.abs(s.final)<1).map(s=>`${s.ab} (${s.final*G.me>0?t('vous','you'):t('adv.','opp.')})`).join(', ');
    const flips=G.states.filter(s=>Math.sign(s.final)!==Math.sign(s.lean)).map(s=>`${s.ab} (${s.final>0?'D':'R'})`).join(', ');
    const waste=G.states.filter(s=>G.me*s.final<-10&&s.spP>3).reduce((a,s)=>a+s.spP,0);
    let pop=0;G.states.forEach(s=>pop+=s.ev*s.final);pop/=538;G.natM=pop;G.natM=pop;
    const head=win?(tie?t('Égalité 269–269 : la Chambre des représentants vous donne la victoire.','Tie at 269–269: the House of Representatives gives you the victory.'):t('Victoire. Vous êtes élu(e) président(e).','Victory. You are elected president.')):(tie?t('Égalité 269–269 : la Chambre des représentants choisit l’adversaire.','Tie at 269–269: the House of Representatives chooses your opponent.'):t('Défaite. L’adversaire l’emporte.','Defeat. Your opponent wins.'));
    body+=`${G.post&&G.post.log.length?`<div class="muted" style="font-size:13px;margin-bottom:8px"><b>${t('Après le scrutin','After election night','Después del escrutinio')}</b><br>${G.post.log.map(l=>t(l)).join('<br>')}</div>`:''}<div class="res"><b>${head}</b><br>${t('Marge nationale approximative','Approximate national margin')} : ${fD(pop)}. ${close?`${t('États à moins d’un point','States within one point')} : ${close}.`:t('Aucun État à moins d’un point.','No state within one point.')} ${flips?`${t('Basculés par rapport à la tendance de fond','Flipped from the baseline')} : ${flips}.`:''} ${waste>0?`${t('Argent dépensé dans des États perdus de plus de 10 points','Money spent in states lost by more than 10 points')} : ${fM(waste)}.`:''}</div>${recapHTML(mine)}${achHTML(newA)}${win&&!G.scn&&!G.reel?`<button class="btn full" style="margin-top:12px" data-act="termstart">${t('Gouverner : commencer le mandat','Govern: start the term','Gobernar: empezar el mandato')}</button>`:''}${sagaNight(win)}<div class="irow" style="margin-top:12px"><button class="btn alt" data-act="share">${t('Partager','Share')}</button><button class="btn" data-act="restart">${t('Nouvelle partie','New game')}</button></div>`;
    if(win&&!G.scn&&!G.reel)save();else dropSave(G.slot);
  }
  showModal(body,'night');
  if(!done){clearTimeout(nightTick.h);nightTick.h=setTimeout(()=>{n.idx++;nightTick()},first?700:130)}
}

function sagaNight(win){
  if(!G.saga)return win&&G.reel?`<p><b>${t('Vous êtes réélu(e) : fin de la saga.','You are re-elected: end of the saga.','Has sido reelegido/a: fin de la saga.')}</b></p>`:'';
  if(!G.sagaPts){G.sagaPts=1;if(win&&G.reel)sagaAdd(G.saga,120,'Réélection','Re-election','Reelección');if(!win||G.reel)sagaFinish(win)}
  return sagaHTML(G.saga)+(win&&G.reel?`<button class="btn full" style="margin-top:8px" data-act="termnext">${t('Passer le relais : nouveau cycle','Hand over: new cycle','Pasar el relevo: nuevo ciclo')}</button>`:'');
}
