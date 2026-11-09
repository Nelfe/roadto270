/* ---------- Statistiques, succès, bilan ---------- */
const STK='cap270.stats';
function getStats(){const d={g:0,w:0,sd:{D:[0,0],R:[0,0]},df:[[0,0],[0,0],[0,0]],best:0,st:0,bst:0,ach:{},h:[],dl:{}};try{const o=JSON.parse(localStorage.getItem(STK));if(o)Object.assign(d,o)}catch(e){}return d}
const ACH=[
 {id:'first',n:B('Première victoire','First victory'),d:B('Remporter une partie.','Win a game.'),ck:c=>c.win},
 {id:'both',n:B('Les deux camps','Both sides'),d:B('Gagner côté démocrate et côté républicain.','Win as a Democrat and as a Republican.'),ck:c=>c.S.sd.D[1]>0&&c.S.sd.R[1]>0},
 {id:'hard',n:B('Contre vents et marées','Against the wind'),d:B('Gagner en difficulté Difficile.','Win on Hard.'),ck:c=>c.win&&c.diff===2},
 {id:'land',n:B('Raz-de-marée','Landslide'),d:B('Gagner avec au moins 350 grands électeurs.','Win with 350 or more electoral votes.'),ck:c=>c.pres!==false&&c.win&&c.mine>=350},
 {id:'hair',n:B('Au poil','By a hair'),d:B('Gagner avec 279 grands électeurs ou moins.','Win with 279 electoral votes or fewer.'),ck:c=>c.pres!==false&&c.win&&c.mine<=279},
 {id:'back',n:B('Remontada','Comeback'),d:B('Gagner après être passé sous 230 en projection (semaines 4 à 8).','Win after projecting under 230 (weeks 4 to 8).'),ck:c=>c.pres!==false&&c.win&&c.mn<230},
 {id:'cash',n:B('Cagnotte intacte','Spare change'),d:B('Gagner avec 10 M$ ou plus encore en caisse.','Win with $10M or more left unspent.'),ck:c=>c.win&&c.cash>=10},
 {id:'flip',n:B('Redessiner la carte','Map changer'),d:B('Gagner en faisant basculer au moins 5 États par rapport à leur tendance de fond.','Win while flipping 5 or more states from their baseline lean.'),ck:c=>c.win&&c.flips>=5},
 {id:'roll',n:B('Série gagnante','On a roll'),d:B('Gagner 3 parties d’affilée.','Win 3 games in a row.'),ck:c=>c.S.st>=3},
 {id:'wave',n:B('Vague sur le Congrès','Congressional wave'),d:B('Contrôler la Chambre et le Sénat aux midterms.','Control both the House and the Senate in the midterms.'),ck:c=>!!c.mid&&c.mid.won===2},
 {id:'sen',n:B('Conquête du Sénat','Senate takeover'),d:B('Contrôler le Sénat aux midterms.','Control the Senate in the midterms.'),ck:c=>!!c.mid&&c.mid.sw},
 {id:'rewrite',n:B('Réécrire l’histoire','Rewrite history'),d:B('Gagner un scénario historique avec le camp qui a perdu en réalité.','Win a historical scenario with the side that actually lost.'),ck:c=>c.win&&!!c.scn&&c.rw},
 {id:'histall',n:B('Mémoire des urnes','Ballot memory'),d:B('Gagner les scénarios 2016, 2020 et 2024.','Win the 2016, 2020 and 2024 scenarios.'),ck:c=>!!c.S.sc&&['2016','2020','2024'].every(y=>c.S.sc[y])},
 {id:'recount',n:B('Recomptage gagnant','Recount winner'),d:B('Gagner après un recomptage qui inverse le résultat.','Win after a recount that flips the result.'),ck:c=>c.win&&!!c.post&&!!c.post.wonRecount},
 {id:'court',n:B('Verdict favorable','Favorable verdict'),d:B('Gagner grâce à la Cour suprême.','Win thanks to the Supreme Court.'),ck:c=>c.win&&!!c.post&&!!c.post.wonCourt},
 {id:'daily',n:B('Gagnant du jour','Daily winner'),d:B('Gagner un défi du jour.','Win a daily challenge.'),ck:c=>c.win&&c.daily}
];
const DIFFN=()=>[t('Facile','Easy'),'Normal',t('Difficile','Hard')];
const fDate=ts=>new Date(ts||Date.now()).toLocaleDateString(FR()?'fr-FR':LANG==='es'?'es-ES':'en-US',{day:'numeric',month:'short'});
const slotLabel=sv=>`${sv.mode==='mid'?t('Midterms','Midterms')+' · ':sv.scn?sv.scn+' · ':''}${sv.me===1?t('Démocrate','Democrat'):t('Républicain','Republican')} · ${DIFFN()[sv.diff]} · ${sv.phase==='over'?t('Soirée électorale','Election night'):(sv.phase==='cand'||sv.phase==='prim')?t('Primaires','Primaries'):t('Semaine','Week')+' '+Math.min(sv.wk,12)+'/12'} · ${fDate(sv.t)}`;
function finish(win,mine,theirs){
  const S=getStats(),sd=side();
  S.g++;if(win)S.w++;S.sd[sd][0]++;if(win)S.sd[sd][1]++;S.df[G.diff][0]++;if(win)S.df[G.diff][1]++;
  S.best=Math.max(S.best,mine);S.st=win?S.st+1:0;S.bst=Math.max(S.bst,S.st);
  if(G.daily){S.dl=S.dl||{};S.dl[G.daily]=win?1:0}
  const flips=G.states.filter(q=>Math.sign(q.final)===G.me&&Math.sign(q.lean)!==G.me).length;
  const mn=Math.min(999,...(G.hist||[]).filter(h=>h.w>=4&&h.w<=8).map(h=>h.y));
  if(G.scn&&win){S.sc=S.sc||{};S.sc[G.scn]=1}
  const c={win,mine,diff:G.diff,flips,cash:G.cash,mn,daily:!!G.daily,S,post:G.post,scn:G.scn,rw:!!G.scn&&sd!==SCN[G.scn].winner},got=[];
  ACH.forEach(a=>{if(!S.ach[a.id]&&a.ck(c)){S.ach[a.id]=Date.now();got.push(a.id)}});
  TEL.send('end',{mode:G.scn?'h'+G.scn:'pres',diff:G.diff,side:G.me,win:+!!win,ev:mine});
  S.h.unshift({t:Date.now(),me:G.me,df:G.diff,win,ev:mine,op:theirs,seed:G.seed,daily:G.daily,scn:G.scn});S.h=S.h.slice(0,30);
  try{localStorage.setItem(STK,JSON.stringify(S))}catch(e){}
  G.rec=true;G.newA=got;
  UI.share=`Road to 270 · ${win?t('Victoire','Victory'):t('Défaite','Defeat')} ${mine}–${theirs} (${sd==='D'?t('Démocrate','Democrat'):t('Républicain','Republican')}, ${DIFFN()[G.diff]})${G.seed!=null?' · '+t('code','code')+' '+codeOf(G.seed):''}${G.daily?' · '+t('défi du jour','daily')+' '+G.daily:''}`+(/^https?:/.test(location.protocol)?'\n'+location.origin+location.pathname:'');
  return got;
}
function achHTML(ids){
  if(!ids.length)return'';
  return`<p style="margin:12px 0 0"><b>${ids.length>1?t('Succès débloqués','New achievements'):t('Succès débloqué','New achievement')}</b></p><ul class="ach">${ids.map(i=>{const a=ACH.find(q=>q.id===i);return`<li><b>${t(a.n)}</b>${t(a.d)}</li>`}).join('')}</ul>`;
}
function chartSVG(mine,cfg){
  cfg=cfg||{lo:90,hi:448,thr:270};
  const pts=(G.hist||[]).filter(h=>h.w<=12).map(h=>h.y).concat([mine]);
  if(pts.length<3)return'';
  const X=i=>18+i*(264/(pts.length-1)),Y=v=>104-clamp((v-cfg.lo)/(cfg.hi-cfg.lo),0,1)*96,n=pts.length;
  const poly=pts.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
  const tx=(i,l)=>`<text x="${X(i).toFixed(1)}" y="120" font-size="9" text-anchor="middle" style="fill:var(--muted)">${l}</text>`;
  return`<svg class="chart" viewBox="0 0 300 124" role="img" aria-label="${cfg.thr===218?t('Évolution de votre projection de sièges','Your projected seats over time'):t('Évolution de votre projection en grands électeurs','Your projected electoral votes over time')}"><line x1="18" x2="282" y1="${Y(cfg.thr).toFixed(1)}" y2="${Y(cfg.thr).toFixed(1)}" style="stroke:var(--muted)" stroke-dasharray="4 4"/><text x="284" y="${(Y(cfg.thr)+3).toFixed(1)}" font-size="9" style="fill:var(--muted)">${cfg.thr}</text><polyline fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:${myC()}" points="${poly}"/><circle cx="${X(n-1).toFixed(1)}" cy="${Y(mine).toFixed(1)}" r="4.5" style="fill:${myC()}"/>${tx(0,t('S','W')+'1')}${tx(n-2,t('S','W')+'12')}${tx(n-1,t('Vote','Vote'))}</svg>`;
}
function recapHTML(mine,cfg){
  const hs=(G.hist||[]).filter(h=>h.w<=12);let best=null;
  for(let i=1;i<hs.length;i++){const d=hs[i].y-hs[i-1].y;if(!best||Math.abs(d)>Math.abs(best.d))best={d,w:hs[i].w}}
  const top=G.states.slice().sort((a,b)=>b.spP-a.spP).filter(q=>q.spP>0).slice(0,3).map(q=>`${sn(q)} ${fM(q.spP)} (${G.me*q.final>0?t('gagné','won'):t('perdu','lost')})`).join(', ');
  return`<h3 class="sect" style="font-size:18px;margin-top:16px">${t('Bilan de campagne','Campaign recap')}</h3>${chartSVG(mine,cfg)}
  <p class="muted" style="margin:0;font-size:13px">${cfg?t('Projection de vos sièges à la Chambre, semaine par semaine, puis résultat du vote.','Your projected House seats, week by week, then the vote result.'):t('Projection de vos grands électeurs, semaine par semaine, puis résultat du vote.','Your projected electoral votes, week by week, then the vote result.')}</p>
  <div class="kv"><span>${t('Plus gros mouvement','Biggest swing')}</span><span>${best?`${t('semaine','week')} ${best.w} · ${best.d>0?'+':'−'}${Math.abs(best.d)}`:'—'}</span></div>
  <div class="kv"><span>${t('Budget dépensé','Money spent')}</span><span>${fM(G.spentP)} · ${t('adversaire','opponent')} ${fM(G.spentO)}</span></div>
  ${top?`<div class="kv"><span>${t('Principaux investissements','Biggest investments')}</span><span style="text-align:right">${top}</span></div>`:''}
  ${G.seed!=null?`<div class="kv"><span>${t('Code de partie','Game code')}</span><span class="mono">${codeOf(G.seed)}</span></div>`:''}`;
}
function statsHTML(){
  const S=getStats(),rate=S.g?Math.round(S.w/S.g*100):0,dn=DIFFN();
  const row=(a,b)=>`<div class="kv"><span>${a}</span><span>${b}</span></div>`;
  return`<div class="man"><div class="mhead"><h2>${t('Statistiques','Statistics')}</h2><button class="btn sm alt" data-act="closeHelp">${t('Fermer','Close')}</button></div>
  ${row(t('Parties jouées','Games played'),S.g)}${row(t('Victoires','Wins'),`${S.w} (${pct(String(rate))})`)}
  ${row(t('Démocrate','Democrat'),`${S.sd.D[1]}/${S.sd.D[0]}`)}${row(t('Républicain','Republican'),`${S.sd.R[1]}/${S.sd.R[0]}`)}
  ${dn.map((n,i)=>row(n,`${S.df[i][1]}/${S.df[i][0]}`)).join('')}
  ${row(t('Meilleur score','Best score'),`${S.best}`)}${row(t('Série en cours / record','Current / best streak'),`${S.st} / ${S.bst}`)}
  <h3 class="sect" style="font-size:18px;margin-top:16px">${t('Succès','Achievements')} · ${Object.keys(S.ach).length}/${ACH.length}</h3>
  <ul class="ach">${ACH.map(a=>`<li class="${S.ach[a.id]?'':'off'}"><b>${S.ach[a.id]?'✓ ':''}${t(a.n)}</b>${t(a.d)}</li>`).join('')}</ul>
  <h3 class="sect" style="font-size:18px;margin-top:16px">${t('Dernières parties','Recent games')}</h3>
  ${S.h.length?`<table class="hs">${S.h.slice(0,10).map(h=>`<tr><td>${fDate(h.t)}</td><td>${h.me===1?'D':'R'} · ${dn[h.df]}${h.daily?' ★':''}</td><td>${h.mid?`${h.win?t('Victoire','Win'):t('Défaite','Loss')} H${h.hM}·S${h.sM}`:h.pr?t('Primaires perdues','Lost primaries'):(h.win?t('Victoire','Win'):t('Défaite','Loss'))+' '+h.ev+'–'+h.op}</td><td class="mono">${h.seed!=null?codeOf(h.seed):''}</td></tr>`).join('')}</table>`:`<p class="muted">${t('Aucune partie terminée pour l’instant.','No finished games yet.')}</p>`}
  <div class="irow" style="margin-top:12px"><button class="btn" data-act="closeHelp">${t('Fermer','Close')}</button></div></div>`;
}
function settingsHTML(){
  const tg=(k,lab)=>`<div class="srow"><span>${lab}</span><button class="btn sm alt" data-act="set" data-k="${k}" data-v="${SET[k]?0:1}" aria-pressed="${!!SET[k]}">${SET[k]?t('Activé','On'):t('Désactivé','Off')}</button></div>`;
  return`<div class="man"><div class="mhead"><h2>${t('Réglages','Settings')}</h2><button class="btn sm alt" data-act="closeHelp">${t('Fermer','Close')}</button></div>${langSw()}
  ${tg('cb',t('Palette daltonienne (bleu et orange)','Color-blind palette (blue and orange)'))}
  <div class="srow"><span>${t('Taille du texte','Text size')}</span><div class="segm">${[t('Normal','Normal'),t('Grand','Large'),t('Très grand','Extra large')].map((l,i)=>`<button class="btn sm alt" data-act="set" data-k="txt" data-v="${i}" aria-pressed="${SET.txt===i}">${l}</button>`).join('')}</div></div>
  ${tg('vib',t('Vibrations légères (mobile)','Light vibrations (mobile)'))}
  ${tg('snd',t('Effets sonores','Sound effects','Efectos de sonido'))}
  ${tg('mus',t('Musique d’ambiance','Background music','Música de ambiente'))}
  ${tg('anim',t('Animations','Animations','Animaciones'))}
  ${CFG.telemetryUrl?tg('tel',t('Aide à améliorer le jeu (statistiques anonymes)','Help improve the game (anonymous stats)')):''}
  <div class="irow" style="margin-top:12px"><button class="btn" data-act="closeHelp">${t('Fermer','Close')}</button></div></div>`;
}
