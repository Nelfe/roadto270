/* ---------- Rendu ---------- */
const isDark=()=>{const th=document.documentElement.dataset.theme;return th==='dark'||(th!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)};
function tileStyle(m){
  const dk=isDark(),k=clamp(Math.abs(m)/18,0,1);
  if(Math.abs(m)<1.5)return{bg:dk?'#3a4354':'#c9ccd3',fg:dk?'#e7ebf3':'#14213a',tu:true};
  const l=dk?32+k*22:88-k*50;
  return{bg:`hsl(${m>=0?218:(SET.cb?28:4)} ${dk?52:62}% ${l}%)`,fg:(dk||l<62)?'#fff':'#14213a',tu:false};
}
function proj(){let ys=0,yl=0,c=0,ol=0,os=0;
  G.states.forEach(s=>comps(s).forEach(k=>{const p=G.me*(pollOf(s)+k[1]),e=k[0];if(p>=4)ys+=e;else if(p>=1.5)yl+=e;else if(p>-1.5)c+=e;else if(p>-4)ol+=e;else os+=e}));
  return{ys,yl,c,ol,os,you:ys+yl,opp:os+ol}}
const myC=()=>G.me===1?'var(--dem)':'var(--rep)', opC=()=>G.me===1?'var(--rep)':'var(--dem)';
const ratingOf=p=>p>=8?t('Acquis','Locked'):p>=4?t('Probable','Likely'):p>=1.5?t('Avantage','Leaning'):p>-1.5?t('Incertain','Toss-up'):p>-4?t('Désavantage','Trailing'):p>-8?t('Improbable','Unlikely'):t('Perdu','Lost');
const MONTHS_FR=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],MONTHS_ES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function wkLabel(w){const b=scnBase(),d=new Date(Date.UTC(b.y,b.s[0],b.s[1]+7*(w-1)));return LANG==='es'?d.getUTCDate()+' '+MONTHS_ES[d.getUTCMonth()]:FR()?d.getUTCDate()+' '+MONTHS_FR[d.getUTCMonth()]:MONTHS_EN[d.getUTCMonth()]+' '+d.getUTCDate()}
function daysLeft(w){const b=scnBase();return Math.round((Date.UTC(b.y,b.e[0],b.e[1])-Date.UTC(b.y,b.s[0],b.s[1]+7*(w-1)))/864e5)}

function tabsHTML(){return [['map',t('Carte','Map')],['issues',t('Enjeux','Issues')],['groups',t('Groupes','Groups')],['team',t('Équipe','Team')],['actions',t('Actions','Actions','Acciones')],['log',t('Journal','Log')]]
  .map(([k,l])=>`<button role="tab" data-act="tab" data-tab="${k}" aria-selected="false">${l}${k==='log'?'<span class="bdg" id="bdg" hidden></span>':''}${k==='actions'?'<span class="bdg" id="bdgA" hidden>!</span>':''}</button>`).join('')}
function applyStatic(){
  document.documentElement.lang=LANG;document.title=t('Cap sur 270','Road to 270');
  $('#tabsNav').innerHTML=tabsHTML();$('#tabsNav').setAttribute('aria-label',t('Sections du jeu','Game sections'));
  $('#endBtn').textContent=t('Fin de semaine','End week');$('#coach').setAttribute('aria-label',t('Tutoriel','Tutorial'));
}
function setLang(l){
  LANG=l==='fr'?'fr':l==='es'?'es':'en';try{localStorage.setItem('cap270.lang',LANG)}catch(e){}
  applyStatic();
  if(!$('#modal').hidden){if(UI.mk==='help')showModal(helpHTML(!!G&&G.phase==='play'),'help');else if(UI.mk==='set')showModal(settingsHTML(),'set');else if(UI.mk==='stats')showModal(statsHTML(),'stats')}
  if(G&&!$('#game').hidden)render();else renderTitle();
}


const evLbl=s=>G.mode==='mid'?`${s.hs} ${t('sièges à la Chambre','House seats')}${s.sen?` · ${t('Sénat','Senate')} ★`:''}`:`${s.ev} ${t('grands électeurs','electoral votes')}`;
function barMid(c,tot){const pc=v=>(v/tot*100)+'%';return`<div class="evbar" role="img"><i style="width:${pc(c[0])};background:${myC()}"></i><i style="width:${pc(c[1])};background:${myC()};opacity:.55"></i><i style="width:${pc(c[2])};background:var(--tu)"></i><i style="width:${pc(c[3])};background:${opC()};opacity:.55"></i><i style="width:${pc(c[4])};background:${opC()}"></i><span class="mark"></span></div>`}
function hudMidHTML(){
  const P=projMid(),dl=daysLeft(G.wk),ch=(c)=>c[0]+c[1],oh=(c)=>c[3]+c[4];
  const leg=(lab,c,tot)=>`<div class="evleg"><span style="color:${myC()}"><b>${lab} ${ch(c)}</b></span><span class="muted">${t('Incertain','Toss-up')} ${c[2]}</span><span style="color:${opC()}"><b>${t('Adv.','Opp.')} ${oh(c)}</b></span></div>`;
  return`<div class="row"><span class="wk">${t('Semaine','Week')} ${Math.min(G.wk,12)}/12 <span class="muted" style="font-size:14px;white-space:nowrap;font-family:var(--f-body);text-transform:none;letter-spacing:0">${wkLabel(G.wk)} · ${t(`J−${dl}`,`${dl} days left`)}</span></span><span class="rt"><span class="cash">${fM(G.cash)}</span>${undoBtn()}<button class="help" data-act="help" aria-label="${t('Ouvrir le manuel','Open the manual')}">?</button></span></div>
  <div class="muted" style="font-size:12px;margin-top:4px">${t('Chambre des représentants (218 pour la majorité)','House of Representatives (218 for a majority)')}</div>${barMid(P.H,435)}${leg(t('Chambre','House'),P.H,435)}
  <div class="muted" style="font-size:12px;margin-top:4px">${t('Sénat (51 pour la majorité)','Senate (51 for a majority)')}</div>${barMid(P.S,100)}${leg(t('Sénat','Senate'),P.S,100)}`;
}
function renderHud(){
  const p=proj();let nat=0;G.states.forEach(s=>nat+=s.ev*pollOf(s));nat/=538;
  const pc=v=>(v/538*100)+'%',dl=daysLeft(G.wk);
  $('#hudTop').innerHTML=`<div class="row"><span class="wk">${t('Semaine','Week')} ${Math.min(G.wk,12)}/12 <span class="muted" style="font-size:14px;white-space:nowrap;font-family:var(--f-body);text-transform:none;letter-spacing:0">${wkLabel(G.wk)} · ${t(`J−${dl}`,`${dl} days left`)}</span></span><span class="rt"><span class="cash">${fM(G.cash)}</span>${undoBtn()}<button class="help" data-act="help" aria-label="${t('Ouvrir le manuel','Open the manual')}">?</button></span></div>
  <div class="evbar" role="img" aria-label="${t('Projection','Projection')} : ${t('vous','you')} ${p.you}, ${t('incertain','toss-up')} ${p.c}, ${t('adversaire','opponent')} ${p.opp}">
   <i style="width:${pc(p.ys)};background:${myC()}"></i><i style="width:${pc(p.yl)};background:${myC()};opacity:.55"></i><i style="width:${pc(p.c)};background:var(--tu)"></i><i style="width:${pc(p.ol)};background:${opC()};opacity:.55"></i><i style="width:${pc(p.os)};background:${opC()}"></i><span class="mark"></span></div>
  <div class="evleg"><span style="color:${myC()}"><b>${t('Vous','You')} ${p.you}</b></span><span class="muted">${t('Incertain','Toss-up')} ${p.c} · ${t('national','national')} ${fD(nat)}</span><span style="color:${opC()}"><b>${t('Adv.','Opp.')} ${p.opp}</b></span></div>`;
  if(G.mode==='mid')$('#hudTop').innerHTML=hudMidHTML();
  $('#aps').innerHTML=Array.from({length:3},(_,i)=>`<i class="${i<G.ap?'on':''}"></i>`).join('')+`<span>${G.ap} ${LANG==='es'?(G.ap>1?'acciones':'acción'):'action'+(G.ap>1?'s':'')}</span>`;
  $('#endBtn').disabled=!can();
  document.querySelectorAll('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===UI.tab));
  const ba=$('#bdgA');if(ba)ba.hidden=!(G.viral&&!G.viral.resp&&UI.tab!=='actions');
  const n=Math.min(9,G.log.length-(G.seen||0)),bd=$('#bdg');bd.hidden=n<=0||UI.tab==='log';bd.textContent=n;
}
function mapHTML(mode,rev){
  const HS=mode==='poll'&&hintsOn()?new Set(hintStates().map(x=>x.ab)):null;
  const grid=Array.from({length:8},()=>Array(11).fill(null));G.states.forEach(s=>grid[s.r][s.c]=s);
  let h='<div class="map">';
  for(let r=0;r<8;r++)for(let c=0;c<11;c++){const s=grid[r][c];if(!s){h+='<span></span>';continue}
    const fin=mode==='final',shown=!fin||rev.has(s.ab),m=fin?s.final:pollOf(s);
    const ts=shown?tileStyle(m):{bg:isDark()?'#232b3a':'#dde1e9',fg:'var(--muted)',tu:false};
    h+=`<button class="tile${!fin&&UI.sel===s.ab?' sel':''}${ts.tu?' tu':''}${HS&&HS.has(s.ab)?' hint':''}" ${fin?'tabindex="-1"':`data-act="sel" data-ab="${s.ab}"`} style="background:${ts.bg};color:${ts.fg}" aria-label="${sn(s)}, ${evLbl(s)}${shown?', '+fD(m):''}"><b>${s.ab}</b><small>${G.mode==='mid'?(s.hs||'–')+(s.sen?'★':''):s.ev}</small>${!fin&&s.fieldP?'<i class="pip"></i>':''}</button>`}
  return h+'</div>';
}
function statePanel(){
  const s=ST(UI.sel);if(!s)return`<div class="hint">${t('Touchez un État pour voir le détail, acheter de la publicité, ouvrir un bureau ou y faire campagne.','Tap a state to see details, buy ads, open an office or campaign there.')}</div>`;
  const pl=pollOf(s),p=G.me*pl,show=G.analyst||s.internal!==null,ok=can();
  const chip=p>1.5?'gd':p<-1.5?'bd':'you';
  let tb='';
  if(show)tb=`<table class="bd">${parts(s).map(x=>{const v=G.me*x[1];return`<tr><td>${t(x[0])}</td><td class="${Math.abs(v)<.05?'':v>0?'pos':'neg'}">${x[0]===PL.base?fD(x[1]):fS(v)}</td></tr>`}).join('')}<tr><td><b>${t('Marge réelle du modèle','True model margin')}</b></td><td><b>${fD(margin(s))}</b></td></tr></table>`;
  return`<div class="panel"><div class="top"><div><h2>${sn(s)}</h2><span class="muted">${evLbl(s)} · ${t('fond','baseline')} ${fD(s.lean)}${hintsOn()&&hintStates().some(x=>x.ab===s.ab)?` · <b style="color:var(--gold)">★ ${t('Cible facile','Easy target','Objetivo fácil')}</b>`:''}</span></div><span class="chip ${chip}">${ratingOf(p)}</span></div>
  <p style="margin:8px 0 0">${t('Moyenne des sondages','Poll average')} : <b class="mono">${fD(pl)}</b>${s.internal!==null?` · ${t('sondage interne','internal poll')} : <b class="mono">${fD(s.internal)}</b>`:''}</p>
  <div class="mixbar" role="img" aria-label="${t('Composition de l’électorat','Electorate makeup')}">${s.mix.map((v,i)=>`<i style="width:${v*100}%;background:${GCOL[i]}"></i>`).join('')}</div>
  <div class="mixleg">${s.mix.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).slice(0,4).map(([v,i])=>`<span style="--c:${GCOL[i]}">${t(GROUPS[i].n)} ${pct(String(Math.round(v*100)))}</span>`).join('')}</div>
  <p class="muted" style="margin:8px 0 0;font-size:13px">${t('Économie','Economy')} : ${sectorOf(s)} · ${t('chômage','unemployment')} ${pct(f1(unemp(s)))}</p>
  ${G.mode==='mid'?`<p class="muted" style="margin:2px 0 0;font-size:13px">${t('Chambre','House')} : ${s.dz.reduce((a,z)=>a+PHI(G.me*(pl+G.HK+z)/3.5),0).toFixed(1)}/${s.hs} ${t('pour vous','for you')}${s.sen?` · ${t('Sénat','Senate')} : ${fD(pl+senAdj(s))} (${t('siège tenu par','seat held by')} ${s.sen})`:''}</p>`:''}
  ${DIST[s.ab]&&G.mode!=='mid'?`<p class="muted" style="margin:2px 0 0;font-size:13px">${t('Districts','Districts')} : ${comps(s).slice(1).map(c=>`${c[2]} ${fD(pl+c[1])}`).join(' · ')}</p>`:''}
  <p class="muted" style="margin:2px 0 0;font-size:13px">${t('Publicité','Ads')} ${f1(s.adsP)} · ${t('bureaux','offices')} ${s.fieldP}/3 · buzz ${f1(s.buzzP)} · ${t('vote anticipé','early vote')} ${s.ebP}/3 · ${t('investi','invested')} ${fM(s.spP)}</p>
  <div class="acts">
   <div class="seg" role="group" aria-label="${t('Canal de publicité','Ad channel')}">${[['tv',t('TV','TV')],['dig',t('Numérique','Digital')],['rad',t('Radio locale','Local radio')]].map(([c,l])=>`<button data-act="ch" data-c="${c}" aria-pressed="${(UI.ch||'tv')===c}">${l}${c==='dig'?' ×'+f1(chPow(s,'dig')):c==='rad'?' ×'+f1(chPow(s,'rad')/.55):''}</button>`).join('')}</div>
   <button class="btn sm" data-act="ads" data-n="1" ${ok?'':'disabled'}>${t('Publicité','Ads')} ×1<small>${fM(adCost(s)*CHC[UI.ch||'tv'])}</small></button>
   <button class="btn sm" data-act="ads" data-n="3" ${ok?'':'disabled'}>${t('Publicité','Ads')} ×3<small>${fM(adCost(s)*3*CHC[UI.ch||'tv'])}</small></button>
   <button class="btn sm" data-act="field" ${ok&&s.fieldP<3?'':'disabled'}>${t('Bureau de terrain','Field office')}<small>${ONEA()} · ${fM(fcost(s,true))}</small></button>
   <button class="btn sm" data-act="visit" ${ok?'':'disabled'}>${t('Visite','Visit')}<small>${ONEA()} · ${fm0(.3)}</small></button>
   <button class="btn sm" data-act="early" ${ok&&G.wk>=8&&s.ebP<3?'':'disabled'} style="grid-column:1/-1">${t('Opération vote anticipé','Early-vote drive')}<small>${G.wk<8?t('dès la semaine 8 · ','from week 8 · '):''}1 action · ${fm0(2)}</small></button>
   <button class="btn sm alt" data-act="poll" ${ok&&s.internal===null?'':'disabled'} style="grid-column:1/-1">${t('Sondage interne','Internal poll')} · ${fm0(pollCost())}</button>
  </div>${tb}</div>`;
}
function renderMain(){
  const m=$('#main');let h='';
  if(UI.tab==='map'){
    h=tipsHTML()+mapHTML('poll')+`<div class="legend"><span style="--c:hsl(218 62% 40%)">${t('Démocrate','Democrat')}</span><span style="--c:hsl(${SET.cb?28:4} 62% 40%)">${t('Républicain','Republican')}</span><span style="--c:#c9ccd3">${t('Incertain (moins de 1,5)','Toss-up (under 1.5)')}</span></div>`+statePanel();
  }else if(UI.tab==='issues'){
    const sd=side(),os=oside(),ok=can();
    h=`<p class="muted" style="margin:14px 0 10px">${t('Chaque changement de position ou mise à l’agenda coûte 1 action. Le point plein est votre position, le cercle celle de l’adversaire.','Each position change or agenda push costs 1 action. The filled dot is your position, the ring is your opponent’s.')}</p>`+ISSUES.map((I,i)=>{
      const mine=G.pos[sd][i],opp=G.pos[os][i];
      const cells=[-2,-1,0,1,2].map(v=>`<div>${v===mine?'<span class="dot me"></span>':''}${v===opp?'<span class="dot op"></span>':''}</div>`).join('');
      const adv=I.own===0?t('Aucun camp n’a l’avantage','Neither side has the edge'):(I.own>0)===(G.me===1)?t('Avantage pour vous','Edge: you'):t('Avantage pour l’adversaire','Edge: your opponent');
      return`<div class="issue" style="--me:${myC()};--op:${opC()}"><h3>${t(I.n)}</h3><div class="meta"><span>${t('Importance','Importance')} ${f1(G.sal[i])}</span><span>${adv}</span></div>
      <div class="sal"><i style="width:${G.sal[i]/1.6*100}%"></i></div><div class="track">${cells}</div>
      <div class="ends"><span>${t(I.lo)}</span><span>${t(I.hi)}</span></div>
      <div class="irow"><button class="btn sm alt" data-act="pos" data-i="${i}" data-d="-1" ${ok&&mine>-2?'':'disabled'}>◀ ${t('Vers','Toward')} −</button><button class="btn sm alt" data-act="pos" data-i="${i}" data-d="1" ${ok&&mine<2?'':'disabled'}>${t('Vers','Toward')} + ▶</button><button class="btn sm" data-act="agenda" data-i="${i}" ${ok?'':'disabled'}>${t('Mettre à l’agenda','Put on agenda')}</button></div></div>`}).join('');
  }else if(UI.tab==='groups'){
    const sd=side(),ok=can();
    h=`<p class="muted" style="margin:14px 0 10px">${t('Part de chaque groupe dans l’électorat (pondérée par les grands électeurs), ses priorités et sa préférence actuelle. Cibler un groupe coûte 1 action et 1,5 M$, et pèse dans chaque État selon le poids local du groupe.','Each group’s share of the electorate (weighted by electoral votes), its priorities and its current preference. Targeting a group costs 1 action and $1.5M, and counts in each state according to the group’s local weight.')}</p>`+GROUPS.map((q,gi)=>{
      const share=G.states.reduce((a,x)=>a+x.ev*x.mix[gi],0)/538,pref=groupPref(gi,sd),pw=clamp(Math.abs(pref)/2.2,0,1)*100;
      const conc=q.w.map((w,i)=>[w*G.sal[i],i]).sort((a,b)=>b[0]-a[0]).slice(0,2).map(x=>t(ISSUES[x[1]].n)).join(' · ');
      const bar=pref>=0?`<i class="l" style="width:0"></i><i style="width:${pw}%;background:${myC()}"></i>`:`<i class="l" style="width:${pw}%;background:${opC()}"></i><i style="width:0"></i>`;
      return`<div class="issue grp"><h3>${t(q.n)} <span class="muted mono" style="font-size:13px;text-transform:none">${pct(String(Math.round(share*100)))}</span></h3><p class="muted" style="margin:2px 0 6px;font-size:13px">${t(q.d)}</p>
      <div class="kv"><span>${t('Vote anticipé','Early voting')}</span><span>${Math.round(EARLY[gi]*100)} %</span></div>
      <div class="kv"><span>${t('Priorités','Priorities')}</span><span style="font-family:var(--f-body)">${conc}</span></div>
      <div class="pref" role="img" aria-label="${t('Préférence du groupe','Group preference')}">${bar}</div><div class="ends"><span>${t('Préfère l’adversaire','Prefers your opponent')}</span><span>${t('Vous préfère','Prefers you')}</span></div>
      <div class="irow"><button class="btn sm" data-act="target" data-i="${gi}" ${ok?'':'disabled'}>${t('Cibler','Target')} · 1 action · ${fm0(1.5)}</button><span class="muted" style="align-self:center;font-size:12px">${t('Ciblage en cours','Current outreach')} : ${f1(G.tgtP[gi])}</span></div></div>`}).join('');
    const w=G.states.reduce((a,x)=>a+x.ev*unemp(x),0)/538;
    const lab=G.econ>1.2?t('Forte croissance','Booming'):G.econ>.4?t('Solide','Solid'):G.econ>-.4?t('Stable','Stable'):G.econ>-1.2?t('Fragile','Fragile'):t('Récession','Recession');
    h+=`<h2 class="sect">${t('Économie','Economy')}</h2><div class="panel"><div class="kv" style="border:0"><span>${t('Conjoncture nationale','National conditions')}</span><span>${lab} (${fS(G.econ)})</span></div><div class="kv"><span>${t('Chômage moyen','Average unemployment')}</span><span>${pct(f1(w))}</span></div><div class="kv"><span>${t('Parti sortant','Incumbent party')}</span><span>${G.inc==='D'?t('Démocrate','Democratic'):t('Républicain','Republican')}, ${G.inc===side()?t('votre camp','your side'):t('l’adversaire','your opponent')}</span></div><p class="muted" style="margin:8px 0 0;font-size:13px">${t('Une bonne conjoncture profite au parti sortant, une mauvaise à son challenger. L’effet varie selon les secteurs : énergie et industrie réagissent plus fort que les services.','Good conditions help the incumbent party, bad ones help its challenger. The effect varies by sector: energy and manufacturing react more strongly than services.')}</p></div>`;
    const bgs=G.states.filter(x=>Math.abs(pollOf(x))<8).sort((a,b)=>b.ev-a.ev).slice(0,10);
    h+=`<h3 class="sect" style="font-size:18px">${t('États clés','Key states')}</h3><div class="panel">`+bgs.map((x,k)=>{const e=G.me*econSign()*.8*ecoOf(x);return`<div class="kv" ${k?'':'style="border:0"'}><span>${sn(x)} · ${sectorOf(x)}</span><span>${pct(f1(unemp(x)))}${G.analyst?' · '+fS(e):''}</span></div>`}).join('')+`</div>`;
  }else if(UI.tab==='team'){
    h=teamHTML();
  }else if(UI.tab==='actions'){
    const ok=can(),nd=G.wk<=5?5:G.wk<=9?9:null;
    h=`<div style="height:14px"></div>
    <div class="card"><div><h3>${t('Collecte de fonds','Fundraising')}</h3><p>${t('Rapporte environ 4 à 7 M$, plus si votre image est bonne.','Raises about $4M to $7M, more with a good image.')}</p></div><button class="btn sm" data-act="fund" ${ok?'':'disabled'}>${ONEA()}</button></div>
    <div class="card"><div><h3>${t('Grande interview','Major interview')}</h3><p>${t('Probablement bénéfique pour votre image, avec un risque de dérapage.','Likely to help your image, with a risk of a slip.')}</p></div><button class="btn sm" data-act="media" ${ok?'':'disabled'}>${ONEA()}</button></div>
    <div class="card"${G.mode==='mid'?' hidden':''}><div><h3>${t('Préparer le débat','Debate prep')}</h3><p>${t('Préparation','Preparation')} ${G.prep}/3. ${nd?t(`Prochain débat : semaine ${nd}.`,`Next debate: week ${nd}.`):t('Les débats sont terminés.','The debates are over.')}</p></div><button class="btn sm" data-act="prep" ${ok&&nd?'':'disabled'}>${ONEA()}</button></div>
    ${mediaHTML()}${donorHTML()}${rivalPanel()}${viralHTML()}${thirdHTML()}${autoHTML()}${G.mode==='mid'?`<div class="panel"><h3 style="font-size:20px">${t('Votre mission','Your mission')}</h3><p style="margin:6px 0 0">${t('Contrôler la Chambre (218 sièges) pour gagner, et si possible le Sénat (51 sièges ; 50 suffisent pour le parti du président). Les États avec une ★ ont une élection au Sénat.','Control the House (218 seats) to win, and the Senate too if you can (51 seats; 50 is enough for the president’s party). States marked ★ have a Senate race.')}</p><p class="muted" style="margin:6px 0 0;font-size:13px">${t('Fonds adverses estimés','Estimated opponent funds')} : <span class="mono">${fM(G.cashO)}</span>${G.seed!=null?` · ${t('code de partie','game code')} : <span class="mono">${codeOf(G.seed)}</span>`:''}${G.hint!=null?` · ${t('biais des sondages estimé','estimated poll bias')} : <span class="mono">${fS(G.hint)}</span> ${t('pour vous','for you')}`:''}</p></div>`:''}<div class="panel"${G.mode==='mid'?' hidden':''}><h3 style="font-size:20px">${t('Votre ticket','Your ticket')}</h3><p style="margin:6px 0 0">${G.cand?G.cand.n:(side()==='D'?'Elena Marsh':'Jack Holloway')} ${t('et','and')} ${G.vpName||t('colistier à choisir','running mate to be chosen')}.</p>${G.cand?`<p class="muted" style="margin:4px 0 0;font-size:13px">${candLine(G.cand)}</p>`:''}${G.opp?`<p class="muted" style="margin:4px 0 0;font-size:13px">${t('Adversaire','Opponent')} : ${candLine(G.opp)}</p>`:''}<p class="muted" style="margin:6px 0 0;font-size:13px">${t('Image nette','Net image')} : <span class="mono">${fS(G.me*G.img)}</span> ${t('pour vous','for you')} · ${t('fonds adverses estimés','estimated opponent funds')} : <span class="mono">${fM(G.cashO)}</span>${G.seed!=null?` · ${t('code de partie','game code')} : <span class="mono">${codeOf(G.seed)}</span> <button class="btn sm alt" data-act="copycode" style="min-height:28px;padding:2px 8px">${t('Copier','Copy')}</button>`:''}${G.hint!=null?` · ${t('biais des sondages estimé','estimated poll bias')} : <span class="mono">${fS(G.hint)}</span> ${t('pour vous','for you')}`:''}</p></div>`;
  }else{
    h=`<div class="tog"><button class="btn sm alt" data-act="analyst">${G.analyst?t('Masquer les calculs détaillés','Hide detailed calculations'):t('Afficher les calculs détaillés','Show detailed calculations')}</button><span class="muted">${t('Mode analyste : décomposition de la marge de chaque État.','Analyst mode: breakdown of each state’s margin.')}</span></div><ul class="log">${G.log.map(e=>`<li class="${e.k}"><b>${t('S','W')}${e.w}</b><span>${t(e.t)}</span></li>`).join('')||`<li><b></b><span class="muted">${t('Rien à signaler pour l’instant.','Nothing to report yet.')}</span></li>`}</ul>`;
  }
  m.innerHTML=h;
}
function render(){if(!G||SIM)return;$('#title').hidden=true;$('#game').hidden=false;if(G.phase==='cand'||G.phase==='prim'){renderPrim();firstTip(G.phase);return}if(G.phase==='term'){renderTerm();return}if(UI.tutoPending&&G.phase==='play'&&$('#modal').hidden){UI.tutoPending=false;if(!tutoSeen()){tutoGo(0);return}}$('#tabsNav').hidden=false;$('#dock').hidden=false;renderHud();renderMain();renderCoach()}
