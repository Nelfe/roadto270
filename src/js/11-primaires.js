/* ---------- Primaires ---------- */
const PRD=[{n:B('Premiers États','Early states'),m:B('févr.','Feb'),w:.2},{n:B('Super Tuesday','Super Tuesday'),m:B('mars','Mar'),w:.35},{n:B('Primaires du printemps','Spring primaries'),m:B('avr.-mai','Apr–May'),w:.25},{n:B('Dernières primaires','Final primaries'),m:B('juin','Jun'),w:.2}];
const PRDL=[{n:B('Iowa et New Hampshire','Iowa and New Hampshire','Iowa y Nuevo Hampshire'),m:B('janv.','Jan','ene'),w:.06},{n:B('Caroline du Sud et Nevada','South Carolina and Nevada','Carolina del Sur y Nevada'),m:B('févr.','Feb','feb'),w:.07},{n:B('Mini-Tuesday','Mini-Tuesday','Mini Martes'),m:B('mars','Mar','mar'),w:.1},{n:B('Super Tuesday','Super Tuesday','Super Martes'),m:B('mars','Mar','mar'),w:.25},{n:B('Primaires du Midwest','Midwest primaries','Primarias del Medio Oeste'),m:B('avr.','Apr','abr'),w:.12},{n:B('Côte Est','East Coast','Costa Este'),m:B('avr.','Apr','abr'),w:.13},{n:B('Primaires de mai','May primaries','Primarias de mayo'),m:B('mai','May','may'),w:.12},{n:B('Dernières primaires','Final primaries','Últimas primarias'),m:B('juin','Jun','jun'),w:.15}];
const NR=()=>G.long?8:4,PRDS=()=>G.long?PRDL:PRD;
const RIVC=['hsl(30 16% 52%)','hsl(200 14% 52%)'];
function initPrim(){
  const used=[G.cand.n,G.opp.n,...G.cands.map(c=>c.n)],sd=side();
  G.pr={r:0,ap:2,x:0,e:clamp(.3+randn()*.5,-1,1),mom:0,sh:[],cash:26,negs:0,out:null,log:[],
    riv:[2,-1].map(x=>({c:genCand(sd,used),x,b:randn()*.35+(G.diff-1)*.15,mom:0,out:false}))};
  G.pr.hint=2*G.pr.e+randn()*.45;G.pr.pn=newPn();
}
function newPn(){const o={you:randn()*.15};G.pr&&G.pr.riv.forEach((q,i)=>o[i]=randn()*.15);return o}
const primBase=()=>(trP().includes('charm')?.35:0)+(trP().includes('org')?.2:0)+(trP().includes('funds')?.15:0)-(wkP()==='unknown'?.4:0)-(wkP()==='gaffe'?.1:0)+(trP().includes('vet')?.15:0)+(trP().includes('bridge')?.1:0)-(wkP()==='stiff'?.15:0);
const pcands=()=>[{k:'you',x:G.pr.x,b:primBase(),mom:G.pr.mom},...G.pr.riv.map((q,i)=>({k:i,x:q.x,b:q.b,mom:q.mom,out:q.out}))].filter(q=>!q.out);
function prShares(nz){
  const xs=2*G.pr.e,L=pcands().map(q=>({k:q.k,v:Math.exp(PARAM.pk*(q.b+q.mom-.5*Math.abs(q.x-xs)+(nz?nz[q.k]||0:0)))})),T=L.reduce((a,q)=>a+q.v,0),o={};
  L.forEach(q=>o[q.k]=q.v/T);return o;
}
function cumShares(upto){
  const tot={you:0,0:0,1:0};let w=0;
  G.pr.sh.slice(0,upto).forEach((r,i)=>{w+=PRDS()[i].w;['you',0,1].forEach(k=>tot[k]+=PRDS()[i].w*(r[k]||0))});
  if(w)['you',0,1].forEach(k=>tot[k]/=w);return tot;
}
function shiftPos(sd,x){
  if(!x)return;const dir=(x>0?1:-1)*(sd==='D'?1:-1);let n=Math.abs(x);
  ISSUES.map((I,i)=>i).sort((a,b)=>ISSUES[b].s0-ISSUES[a].s0).forEach(i=>{
    if(n<=0)return;const np=clamp(G.pos[sd][i]+dir,-2,2);if(np!==G.pos[sd][i]){G.pos[sd][i]=np;n--}});
}
const rivName=i=>G.pr.riv[i].c.n;
function moodLabel(h){return h>1.3?t('très marqués à la base du parti','strongly rooted in the party base'):h>.5?t('plutôt attachés à la base','leaning toward the base'):h>-.3?t('partagés','divided'):t('plutôt tournés vers le centre','leaning toward the center')}
function primAct(k,d){
  const pr=G.pr;if(G.phase!=='prim')return;
  if(pr.ap<1){toast(t('Plus d’actions ce tour.','No actions left this round.'));return}
  if(k==='base'){if(pr.x>=2){toast(t('Déjà au maximum.','Already at the maximum.'));return}pr.x++;pr.mom+=.1}
  else if(k==='center'){if(pr.x<=-2){toast(t('Déjà au maximum.','Already at the maximum.'));return}pr.x--;pr.mom+=.1}
  else if(k==='ads'){if(pr.cash<4){toast(t('Fonds insuffisants.','Not enough funds.'));return}pr.cash-=4;pr.mom+=pr.mom>.7?PARAM.adG2:PARAM.adG}
  else if(k==='fund'){pr.cash+=5+rnd()*2+(trP().includes('funds')?2:0)}
  else if(k==='tour'){pr.mom+=.25+(trP().includes('org')?.15:0)}
  else if(k==='attack'){const q=pr.riv[+d.i];if(q.out)return;q.mom-=.4;pr.negs++}
  pr.ap--;save();render();
}
function endRound(){
  const pr=G.pr;if(G.phase!=='prim')return;
  const nz={};pcands().forEach(q=>nz[q.k]=randn()*.22);
  const sh=prShares(nz);pr.sh.push(sh);
  pr.mom*=PARAM.dec;pr.riv.forEach(q=>{if(!q.out){q.mom=q.mom*PARAM.dec+PARAM.rivM+rnd()*PARAM.rivR}});
  if(rnd()<.3&&pr.riv.some(q=>!q.out))pr.mom-=.25;
  pr.r++;pr.ap=2;
  if(pr.r===(G.long?3:2)){
    const cs=cumShares(pr.r);const lead=Math.max(cs.you,cs[0],cs[1]);
    pr.riv.forEach((q,i)=>{if(!q.out&&!pr.riv.some(z=>z.out)&&cs[i]<.16&&cs[i]<lead){q.out=true;
      const rest=[{k:'you',x:pr.x},...pr.riv.map((z,j)=>({k:j,x:z.x,o:z.out}))].filter(z=>!z.o&&z.k!==i).sort((a,b)=>Math.abs(a.x-q.x)-Math.abs(b.x-q.x))[0];
      if(rest.k==='you')pr.mom+=.3;else pr.riv[rest.k].mom+=.3;pr.out={n:q.c.n,to:rest.k==='you'?G.cand.n:pr.riv[rest.k].c.n,you:rest.k==='you'}}});
  }
  pr.pn=newPn();
  if(pr.r>=NR()){finishPrim();return}
  if(G.long&&(pr.r===3||pr.r===6)&&!SIM)pdebStart(pr.r===3?1:2);
  save();render();
}
function finishPrim(){
  const pr=G.pr,cs=cumShares(NR()),order=[{k:'you',v:cs.you},{k:0,v:cs[0]},{k:1,v:cs[1]}].sort((a,b)=>b.v-a.v);
  pr.final=cs;
  if(order[0].k!=='you'){primLoss(order);return}
  const tot=cs.you,gap=tot-order[1].v;
  shiftPos(side(),pr.x);
  if(pr.negs)H.img(-Math.min(.6,.15*pr.negs));
  if(gap>.18)H.img(.25);else if(gap<.05)H.img(-.25);
  G.cash=clamp(PARAM.pcash+pr.cash+DM.cash[G.diff],16,46);
  applyCand(G.cand,true);applyCand(G.opp,false);
  shiftPos(oside(),(rnd()<.5?1:-1)*(rnd()<.5?1:2));
  G.phase='vp';pr.won=true;
  L('news',both(()=>t(`${G.cand.n} remporte l’investiture avec ${Math.round(tot*100)} % des délégués. L’adversaire : ${G.opp.n}.`,`${G.cand.n} wins the nomination with ${Math.round(tot*100)}% of delegates. The opponent: ${G.opp.n}.`)));
  save();render();showBrief();
}
function primLoss(order){
  const S=getStats(),sd=side();
  S.g++;S.sd[sd][0]++;S.df[G.diff][0]++;S.st=0;if(G.daily){S.dl=S.dl||{};S.dl[G.daily]=0}
  TEL.send('end',{mode:'pres',diff:G.diff,side:G.me,win:0,ev:0,stage:'primary'});
  S.h.unshift({t:Date.now(),me:G.me,df:G.diff,win:false,ev:0,op:0,pr:1,seed:G.seed,daily:G.daily});S.h=S.h.slice(0,30);
  try{localStorage.setItem(STK,JSON.stringify(S))}catch(e){}
  const w=order[0].k===0||order[0].k===1?G.pr.riv[order[0].k].c.n:'';
  G.phase='over';G.rec=true;dropSave(G.slot);
  showModal(`<h2>${t('Investiture perdue','Nomination lost')}</h2><div class="res">${t(`${w} remporte l’investiture avec ${Math.round(order[0].v*100)} % des délégués. Vous en avez ${Math.round(G.pr.final.you*100)} %. La campagne s’arrête ici.`,`${w} wins the nomination with ${Math.round(order[0].v*100)}% of delegates. You got ${Math.round(G.pr.final.you*100)}%. Your campaign ends here.`)}</div><p class="muted" style="font-size:13px">${t('Conseil : positionnez-vous près de l’humeur des électeurs de primaire, et ne négligez ni la publicité ni les tournées.','Tip: position yourself close to the mood of primary voters, and do not neglect ads or tours.')}</p><button class="btn full" data-act="restart">${t('Nouvelle partie','New game')}</button>`);
}
function renderPrim(){
  $('#tabsNav').hidden=true;$('#dock').hidden=true;$('#coach').hidden=true;document.body.classList.remove('tuto');
  const m=$('#main');
  if(G.phase==='cand'){
    $('#hudTop').innerHTML=`<div class="row"><span class="wk">${t('Votre candidat','Your candidate')}</span><span class="rt"><button class="help" data-act="help" aria-label="${t('Ouvrir le manuel','Open the manual')}">?</button></span></div>`;
    m.innerHTML=`<p class="muted" style="margin:14px 0 4px">${t('Trois profils tirés au hasard. Chaque candidat a deux atouts et une faiblesse qui pèsent sur la campagne, primaires comprises.','Three randomly drawn profiles. Each candidate has two strengths and one weakness that shape the campaign, primaries included.')}</p>`+G.cands.map((c,i)=>candCard(c,i)).join('')+`<div class="panel" style="padding-top:6px;padding-bottom:6px">${archNext()||`<p class="muted" style="font-size:13px;margin:0">★ ${t('Tous les archétypes sont débloqués.','All archetypes unlocked.','Todos los arquetipos están desbloqueados.')}</p>`}</div>`+`<div class="panel"><button class="btn alt full" data-act="rerollc">${t('Tirer trois autres candidats','Draw three other candidates','Sortear otros tres candidatos')}</button><label style="display:flex;gap:10px;align-items:flex-start;margin-top:12px;cursor:pointer"><input type="checkbox" data-act="skipp" ${UI.skipPrim?'checked':''} style="margin-top:3px"><span><b>${t('Passer les primaires','Skip the primaries','Omitir las primarias')}</b><br><span class="muted" style="font-size:13px">${t('Votre choix devient le candidat du parti et la campagne générale commence directement.','Your pick becomes the party nominee and the general election starts right away.','Tu elección es el candidato del partido y la campaña general empieza directamente.')}</span></span></label></div>`;
    return;
  }
  const pr=G.pr,r=Math.min(pr.r,NR()-1),rd=PRDS()[r],myCol=myC();
  setTimeout(()=>{if(G&&G.pr&&G.pr.deb&&G.phase==='prim')showPDeb()},0);
  $('#hudTop').innerHTML=`<div class="row"><span class="wk">${t('Primaires','Primaries')} ${r+1}/${NR()} <span class="muted" style="font-size:14px;font-family:var(--f-body);text-transform:none;letter-spacing:0">${t(rd.n)} · ${t(rd.m)}</span></span><span class="rt"><span class="cash">${fM(pr.cash)}</span><button class="help" data-act="help" aria-label="${t('Ouvrir le manuel','Open the manual')}">?</button></span></div>
  <div class="aps" style="display:flex;gap:6px;align-items:center;margin-top:6px">${[0,1].map(i=>`<i class="${i<pr.ap?'on':''}" style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--gold);${i<pr.ap?'background:var(--gold)':''}"></i>`).join('')}<span class="muted" style="font-size:13px">${pr.ap} ${t('action(s) ce tour','action(s) this round')}</span></div>`;
  const nz=pr.pn,sh=prShares(nz),rows=[{k:'you',n:G.cand.n,col:myCol,you:true},...pr.riv.map((q,i)=>({k:i,n:q.c.n,col:RIVC[i],out:q.out}))];
  const cs=cumShares(pr.r);
  const bars=rows.map(q=>`<div class="pbar${q.you?' you':''}"><span class="nm">${q.n}${q.out?' ✗':''}</span><span class="tr"><i style="width:${q.out?0:(sh[q.k]*100).toFixed(1)}%;background:${q.col}"></i></span><span class="v">${q.out?'—':Math.round(sh[q.k]*100)+'%'}</span></div>`).join('');
  const hist=pr.sh.length?`<table class="hs" style="margin-top:6px"><tr><td></td>${rows.map(q=>`<td class="muted">${q.n.split(' ').pop()}</td>`).join('')}</tr>${pr.sh.map((x,i)=>`<tr><td>${t(PRDS()[i].n)}</td>${rows.map(q=>`<td class="mono">${x[q.k]!=null?Math.round(x[q.k]*100)+'%':'—'}</td>`).join('')}</tr>`).join('')}<tr><td><b>${t('Délégués','Delegates')}</b></td>${rows.map(q=>`<td class="mono"><b>${Math.round((cs[q.k]||0)*100)}%</b></td>`).join('')}</tr></table>`:'';
  const st=[-2,-1,0,1,2].map(v=>`<div class="${v===pr.x?'on':''}">${v===-2?t('Centre','Center'):v===2?t('Base','Base'):''}${v===pr.x?'●':''}</div>`).join('');
  const out=pr.out?`<div class="res" style="margin-top:10px">${pr.out.n} ${t('se retire et apporte son soutien à','drops out and endorses')} <b>${pr.out.to}</b>${pr.out.you?t(' : vous en profitez.',': you benefit.'):'.'}</div>`:'';
  const rivBtn=pr.riv.map((q,i)=>q.out?'':`<button class="btn sm alt" data-act="patk" data-i="${i}"><b>${t('Attaquer','Attack')} ${q.c.n.split(' ').pop()}</b><small>${t('Adversaire −, image de fin −','Rival −, general image −')}</small></button>`).join('');
  m.innerHTML=`${pr.r===0&&G.long?`<div class="hint" style="margin-top:14px">${t('Campagne longue : huit scrutins de janvier à juin, deux débats de primaire (après les tours 3 et 6), puis la convention où vous réglez la plateforme et prononcez votre discours.','Long campaign: eight contests from January to June, two primary debates (after rounds 3 and 6), then the convention where you settle the platform and give your speech.','Campaña larga: ocho contiendas de enero a junio, dos debates de primarias (tras las rondas 3 y 6) y la convención, donde fijas la plataforma y pronuncias tu discurso.')}</div>`:''}${pr.r===0?`<div class="hint" style="margin-top:14px">${t('Pour gagner l’investiture, devancez vos deux rivaux sur l’ensemble des quatre scrutins (le Super Tuesday pèse le plus). Les électeurs de primaire ont une humeur : se placer près d’elle aide, mais ce positionnement vous suivra face à l’adversaire en novembre. Vous avez 2 actions par tour.','To win the nomination, beat your two rivals across the four contests (Super Tuesday counts the most). Primary voters have a mood: positioning near it helps, but that stance follows you into the general election. You have 2 actions per round.')}</div>`:''}
  <h2 class="sect">${t('Sondages de primaire','Primary polls')}</h2><div class="panel">${bars}<p class="muted" style="font-size:13px;margin:8px 0 0">${t('Les électeurs de primaire semblent','Primary voters seem')} <b>${moodLabel(pr.hint)}</b>. ${t('Poids de ce scrutin','Weight of this contest')} : ${Math.round(rd.w*100)} %.</p>${hist}${out}</div>
  <h3 class="sect" style="font-size:18px">${t('Votre positionnement','Your positioning')}</h3><div class="panel"><div class="stance">${st}</div><p class="muted" style="font-size:13px;margin:4px 0 0">${t('Aller vers la base conforte la ligne du parti ; aller vers le centre aide en novembre mais déplace vos positions sur les enjeux au moment de l’investiture.','Moving toward the base reinforces the party line; moving to the center helps in November but shifts your issue positions once you are nominated.')}</p></div>
  <h3 class="sect" style="font-size:18px">${t('Actions','Actions')}</h3><div class="pg">
   <button class="btn sm" data-act="pcenter"><b>${t('Viser le centre','Court the center')}</b><small>${t('Positionnement −1','Positioning −1')}</small></button>
   <button class="btn sm" data-act="pbase"><b>${t('Mobiliser la base','Rally the base')}</b><small>${t('Positionnement +1','Positioning +1')}</small></button>
   <button class="btn sm" data-act="pads"><b>${t('Publicité','Ads')}</b><small>${fm0(4)}</small></button>
   <button class="btn sm" data-act="ptour"><b>${t('Tournée de terrain','Barnstorm')}</b><small>${t('Gratuit','Free')}</small></button>
   <button class="btn sm" data-act="pfund"><b>${t('Collecte de fonds','Fundraise')}</b><small>${t('+5 à 7 M$','+$5M to $7M')}</small></button>
   ${rivBtn}</div>
  <div style="height:14px"></div><button class="btn full" data-act="pend">${r>=NR()-1?t('Clore la dernière primaire','Close the final primary'):t('Terminer le tour','End the round')}</button>
  <p class="muted" style="font-size:12px;margin:10px 0 0">${candLine(G.cand)}</p>`;
}
