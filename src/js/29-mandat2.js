/* ---------- Mandat approfondi : promesses, budget et dette, sénateurs, gouvernement, ailes du parti ---------- */
const TAGS={eco:B('Économie','Economy','Economía'),soc:B('Social','Social','Social'),sec:B('Sécurité','Security','Seguridad'),env:B('Énergie et climat','Energy and climate','Energía y clima'),def:B('Défense','Defense','Defensa')};
const TAGK=Object.keys(TAGS);
// étiquette thématique, coût budgétaire, enjeu (pour les promesses)
const LX={infra:['eco',5,null],vets:['def',2,null],relance:['eco',7,null],permis:['env',0,null],
 sante:['soc',6,'san'],clima:['env',4,'cli'],dreamers:['soc',1,'imm'],avortD:['soc',0,'avo'],dette:['soc',5,'edu'],smic:['eco',-1,'eco'],armes:['sec',0,'sec'],ia:['eco',0,'ai'],
 impots:['eco',4,'eco'],mur:['sec',3,'imm'],santeR:['soc',-2,'san'],forage:['env',0,'cli'],ecole:['soc',1,'edu'],avortR:['soc',0,'avo'],defense:['def',4,'def'],police:['sec',2,'sec']};
const lawTag=l=>(LX[l.id]||['eco'])[0],lawSp=l=>(LX[l.id]||[0,0])[1];
const CABR=[{k:'tre',n:B('Trésor','Treasury','Tesoro'),e:B('Soutient la croissance','Supports growth','Apoya el crecimiento')},{k:'jus',n:B('Justice','Justice','Justicia'),e:B('Amortit les scandales','Cushions scandals','Amortigua los escándalos')},{k:'def',n:B('Défense','Defense','Defensa'),e:B('Aide en crise','Helps in a crisis','Ayuda en una crisis')},{k:'ae',n:B('Affaires étrangères','State','Exteriores'),e:B('Aide en crise','Helps in a crisis','Ayuda en una crisis')}];
const CABP={expert:{n:B('Expert reconnu','Respected expert','Experto reconocido'),e:1,c:1},loyal:{n:B('Fidèle du président','Presidential loyalist','Leal al presidente'),e:.7,c:-2},bip:{n:B('Consensuel','Consensus pick','De consenso'),e:.5,c:9}};
function m2Init(){
  const my=side(),used=[],sen=[];
  for(let i=0;i<6;i++){const a=TAGK.slice(),l=a.splice(Math.floor(rnd()*a.length),1)[0],d=a.splice(Math.floor(rnd()*a.length),1)[0];
    sen.push({n:genNamePick(used),own:i<3,likes:[l],dis:[d],fav:0})}
  // promesses : enjeux les plus saillants de la campagne
  const sal=G.sal||S0,cand=LAWS.filter(l=>l.k===my&&LX[l.id]&&LX[l.id][2]).map(l=>({l,s:(sal[ISSUES.findIndex(i=>i.id===LX[l.id][2])]||0)+rnd()*.15})).sort((a,b)=>b.s-a.s);
  const prom=[];cand.forEach(c=>{if(prom.length<3&&!prom.some(id=>LX[id][2]===LX[c.l.id][2]))prom.push(c.l.id)});
  return{prom,debt:100,hard:55,mod:55,sen,cab:{tre:null,jus:null,def:null,ae:null},co:{},m2:1};
}
function m2Ensure(T){if(!T.m2)Object.assign(T,m2Init())}
const cabE=(T,k)=>{m2Ensure(T);const c=T.cab[k];return c?CABP[c.pf].e:0};
const kept=T=>T.prom.filter(id=>T.laws.includes(id));
function m2Def(T,l){ // défections dans son propre camp si une aile est mécontente
  const w=l.k==='B'?T.hard:T.mod;return Math.max(0,(35-w)/150);
}
function m2Sen(T,l){
  const tg=lawTag(l);let v=0;
  T.sen.forEach(s=>{const lk=s.likes.includes(tg),ds=s.dis.includes(tg);
    if(s.own){if(ds&&s.fav<2)v-=1.5;else if(ds)v-=.5}
    else{if(lk)v+=1.5;else if(!ds&&s.fav>=2)v+=1;if(s.fav>=3&&ds)v+=1}});
  return v;
}
function m2Pass(T,l,k){
  const my=side();m2Ensure(T);
  T.debt+=lawSp(l)*k;
  if(l.k==='B'){adjT(T,{mod:9*k,hard:-2*k})}else if(l.k===my){adjT(T,{hard:10*k,mod:-6*k})}
  if(T.prom.includes(l.id)){adjT(T,{pop:1.5*k,base:.5*k});tLog(T,()=>t('Promesse tenue !','Promise kept!','¡Promesa cumplida!'))}
}
function m2Quarter(T){
  m2Ensure(T);
  T.hard+=(55-T.hard)*.15;T.mod+=(55-T.mod)*.15;
  T.debt+=.5-T.econ*.8;
  adjT(T,{econ:(T.debt>115?-.12:T.debt<95?.05:0)+.12*cabE(T,'tre')});
  if(T.cab.jus||T.cab.tre||T.cab.def||T.cab.ae){/* effets passifs appliqués ci-dessus et via m2Post */}
}
function m2Post(T,e,p0){
  if(e.id==='scand'&&T.pop<p0)T.pop=clamp(T.pop+(p0-T.pop)*.45*cabE(T,'jus'),25,75);
  if(e.id==='crise')T.pop=clamp(T.pop+.7*(cabE(T,'def')+cabE(T,'ae')),25,75);
}
function m2Shift(T){
  m2Ensure(T);const k=kept(T).length,u=T.prom.length-k,pw=T.half===1?.12:.25;
  return k*.3-u*pw+(Math.min(T.hard,T.mod)>55?.25:0)-(T.debt>120?.4:T.debt>112?.15:0);
}
const m2Chal=T=>{m2Ensure(T);return Math.min(T.hard,T.mod)<30};
// événements supplémentaires
TEVENTS.push(
 {id:'budget',n:B('Le budget de l’année','The annual budget','El presupuesto del año'),x:B('Il faut arrêter le cap budgétaire. La dette pèse sur l’économie, mais les dépenses soutiennent la popularité.','Time to set the fiscal course. Debt weighs on the economy, but spending supports popularity.','Hay que fijar el rumbo presupuestario. La deuda pesa sobre la economía, pero el gasto sostiene la popularidad.'),ch:[
  {l:B('Rigueur','Austerity','Austeridad'),f:T=>{adjT(T,{debt:-6,pop:-1.5,econ:-.1,mod:3});return B('Le déficit se réduit, la grogne monte.','The deficit shrinks, grumbling grows.','El déficit se reduce, crece el malestar.')}},
  {l:B('Statu quo','Hold steady','Statu quo'),f:T=>B('Rien ne change.','Nothing changes.','Nada cambia.')},
  {l:B('Dépenser plus','Spend more','Gastar más'),f:T=>{adjT(T,{debt:6,pop:1.5,econ:.2,hard:3});return B('L’économie s’en trouve stimulée, la dette grimpe.','The economy gets a boost, debt climbs.','La economía recibe un impulso, la deuda sube.')}}]},
 {id:'plafond',req:T=>(T.debt||0)>112,n:B('Plafond de la dette','Debt ceiling','Techo de la deuda'),x:B('Le Trésor atteint le plafond de la dette : sans accord, le pays risque le défaut.','Treasury hits the debt ceiling: without a deal, the country risks default.','El Tesoro alcanza el techo de la deuda: sin acuerdo, el país corre riesgo de impago.'),ch:[
  {l:B('Relever le plafond','Raise the ceiling','Subir el techo'),f:T=>{adjT(T,{pop:-1,base:-.5,hard:-2});return B('Voté dans la douleur.','Passed reluctantly.','Aprobado a regañadientes.')}},
  {l:B('Imposer des coupes','Force spending cuts','Imponer recortes'),f:T=>{adjT(T,{debt:-8,pop:-3,econ:-.3});return B('Accord trouvé au prix de coupes.','A deal at the cost of cuts.','Acuerdo a costa de recortes.')}},
  {l:B('Bras de fer','Brinkmanship','Pulso político'),f:T=>{if(rnd()<.5){adjT(T,{pop:2,base:.5});return B('L’opposition cède au dernier moment.','The opposition folds at the last minute.','La oposición cede en el último momento.')}adjT(T,{pop:-5,econ:-.6});return B('Les marchés paniquent avant l’accord.','Markets panic before a deal.','Los mercados entran en pánico antes del acuerdo.')}}]},
 {id:'minis',req:T=>['tre','jus','def','ae'].some(k=>T.cab&&T.cab[k]&&T.cab[k].pf==='loyal'),n:B('Un ministre dans la tourmente','A cabinet member in trouble','Un ministro en apuros'),x:B('Un de vos fidèles est cloué au pilori pour des pratiques douteuses.','One of your loyalists is under fire for dubious practices.','Uno de tus leales está en la picota por prácticas dudosas.'),ch:[
  {l:B('Le démettre','Dismiss them','Cesarlo'),f:T=>{const k=['tre','jus','def','ae'].find(k=>T.cab[k]&&T.cab[k].pf==='loyal');if(k)T.cab[k]=null;adjT(T,{pop:-1,base:-.3});return B('Poste vacant : à pourvoir.','The post is vacant: fill it.','Puesto vacante: hay que cubrirlo.')}},
  {l:B('Le défendre','Defend them','Defenderlo'),f:T=>{adjT(T,{pop:rnd()<.4?-5:-3});return B('Vous encaissez le coup.','You absorb the blow.','Encajas el golpe.')}}]}
);
// l'événement « fronde » agit désormais sur les ailes du parti
{const e=TEVENTS.find(q=>q.id==='aile');if(e){e.ch[0].f=T=>{adjT(T,{pc:-2,base:1,hard:12,mod:-4});return B('La base est apaisée.','The base is appeased.','La base se calma.')};e.ch[1].f=T=>{adjT(T,{pc:1,base:-1,hard:-6});return B('Vous gagnez en autorité, mais perdez des soutiens militants.','You gain authority but lose activist support.','Ganas autoridad pero pierdes apoyos militantes.')};}}
// ---- actions ----
function courtSen(i){const T=TM(),s=T.sen[i];if(!s||T.pc<1||s.fav>=3||T.ev)return;T.pc--;s.fav++;save();render()}
function cabOpen(k){
  const T=TM();m2Ensure(T);if(T.cab[k]||T.ev)return;
  if(!T.co[k]){const used=[];T.co[k]=['expert','loyal','bip'].map(pf=>({n:genNamePick(used),pf}))}
  const r=CABR.find(x=>x.k===k),sm=T.s[side()];
  showModal(`<h2>${t(r.n.fr,r.n.en,r.n.es)}</h2><p class="muted" style="font-size:13px">${t(r.e.fr,r.e.en,r.e.es)}. ${t('Coût : 1 ◆. La confirmation dépend du Sénat.','Cost: 1 ◆. Confirmation depends on the Senate.','Coste: 1 ◆. La confirmación depende del Senado.')}</p>${T.co[k].map((c,i)=>{const p=PHI((sm+CABP[c.pf].c*.5-49.5)/2.5);return`<button class="ch" data-act="cabpick" data-k="${k}" data-i="${i}"><b>${c.n} — ${t(CABP[c.pf].n.fr,CABP[c.pf].n.en,CABP[c.pf].n.es)}</b><small>${t('Confirmation','Confirmation','Confirmación')} ${Math.round(p*100)} %${c.pf==='loyal'?' · '+t('+base, risque de scandale','+base, scandal risk','+base, riesgo de escándalo'):c.pf==='bip'?' · '+t('effet réduit, rassure les modérés','reduced effect, reassures moderates','efecto reducido, tranquiliza a los moderados'):' · '+t('effet complet','full effect','efecto completo')}</small></button>`}).join('')}<button class="btn alt full" style="margin-top:8px" data-act="closeHelp">${t('Annuler','Cancel','Cancelar')}</button>`,'cab');
}
function cabPick(k,i){
  const T=TM(),c=T.co[k]&&T.co[k][i];if(!c||T.pc<1)return;
  T.pc--;const sm=T.s[side()],p=PHI((sm+CABP[c.pf].c*.5-49.5)/2.5),r=CABR.find(x=>x.k===k);
  if(rnd()<p){T.cab[k]={n:c.n,pf:c.pf};if(c.pf==='loyal')adjT(T,{base:.3});if(c.pf==='bip')adjT(T,{mod:4});delete T.co[k];
    tLog(T,()=>t(`${c.n} est confirmé(e) : ${r.n.fr}.`,`${c.n} confirmed: ${r.n.en}.`,`${c.n} es confirmado/a: ${r.n.es}.`))}
  else{adjT(T,{pop:-1});T.co[k]=T.co[k].filter((_,j)=>j!==i);tLog(T,()=>t(`Le Sénat rejette ${c.n} (${r.n.fr}).`,`The Senate rejects ${c.n} (${r.n.en}).`,`El Senado rechaza a ${c.n} (${r.n.es}).`))}
  save();hideModal();render();
}
// ---- affichage ----
const bar2=(lab,v,max,col,extra)=>`<div class="pbar"><span class="nm">${lab}</span><span class="tr"><i style="width:${clamp(v/max*100,0,100).toFixed(1)}%;background:${col}"></i></span><span class="v">${extra||Math.round(v)}</span></div>`;
function tabAg(T){
  const my=side(),ho=T.h[my],sm=T.s[my];
  const bar=(lab,v,max,lines)=>`<div class="pbar you"><span class="nm">${lab}</span><span class="tr"><i style="width:${(v/max*100).toFixed(1)}%;background:${myC()}"></i>${lines.map(x=>`<b style="position:absolute;left:${(x/max*100).toFixed(1)}%;top:0;bottom:0;border-left:2px solid var(--ink)"></b>`).join('')}</span><span class="v">${v}</span></div>`;
  const cards=T.ag.map(id=>{const l=LAW(id),o=lawOdds(l,false),oo=lawOdds(l,true),disabled=T.acts<1||T.ev,done=T.laws.includes(id),pr=T.prom.includes(id);
    const can=c=>T.pc>=c&&!disabled&&!done;
    return`<div class="card" style="display:block"><div><h3>${pr?'★ ':''}${t(l.n.fr,l.n.en,l.n.es)}</h3><p>${t(l.d.fr,l.d.en,l.d.es)}</p><p class="muted" style="font-size:13px">${pr?t('Promesse de campagne · ','Campaign promise · ','Promesa de campaña · '):''}${t(TAGS[lawTag(l)].fr,TAGS[lawTag(l)].en,TAGS[lawTag(l)].es)} · ${t('Coût','Cost','Coste')} ${l.c} ◆ · ${t('Soutien public','Public support','Apoyo público')} ${Math.round(l.ap*100)} % · ${t('Chances','Odds','Probabilidad')} <b>${Math.round(o.p*100)} %</b>${l.fil&&!T.nuke?` · ${t('filibuster','filibuster','filibusterismo')}`:''}</p></div>
    <div class="irow"><button class="btn sm" data-act="tprop" data-id="${id}" ${can(l.c)?'':'disabled'}>${t('Proposer','Propose','Proponer')}</button><button class="btn sm alt" data-act="tpush" data-id="${id}" ${can(l.c+2)?'':'disabled'}>${t('Pousser fort','Push hard','Presionar')} (${l.c+2} ◆ · ${Math.round(oo.p*100)} %)</button>${l.k!=='B'?`<button class="btn sm alt" data-act="tord" data-id="${id}" ${can(Math.max(1,l.c-2))?'':'disabled'}>${t('Décret','Order','Decreto')} (${Math.max(1,l.c-2)} ◆)</button>`:''}</div></div>`}).join('');
  return`<div class="panel"><h3 style="font-size:20px">${t('Le Congrès','Congress','El Congreso')}</h3>${bar(t('Chambre','House','Cámara'),ho,435,[218])}${bar(t('Sénat','Senate','Senado'),sm,100,T.nuke?[50]:[50,60])}
   <p class="muted" style="font-size:13px;margin:4px 0 0">${ho>=218?t('Vous avez la majorité à la Chambre.','You hold the House majority.','Tienes la mayoría en la Cámara.'):t('L’opposition tient la Chambre.','The opposition holds the House.','La oposición controla la Cámara.')} ${sm>=60?t('Vous avez 60 sièges : le filibuster ne vous bloque pas.','You have 60 seats: the filibuster cannot stop you.','Tienes 60 escaños: el filibusterismo no te frena.'):sm>=50?t('Majorité au Sénat grâce à la vice-présidence (50 suffisent) ; 60 voix requises pour passer le filibuster.','Senate majority via the vice-presidency (50 suffice); 60 votes needed to beat the filibuster.','Mayoría en el Senado gracias a la vicepresidencia (bastan 50); hacen falta 60 votos para superar el filibusterismo.'):t('L’opposition tient le Sénat.','The opposition holds the Senate.','La oposición controla el Senado.')}</p>
   ${!T.nuke&&sm>=50?`<div class="irow" style="margin-top:8px"><button class="btn sm alt" data-act="tnuke" ${T.pc>=4&&!T.ev?'':'disabled'}>${t('Supprimer le filibuster (4 ◆, impopulaire)','Scrap the filibuster (4 ◆, unpopular)','Eliminar el filibusterismo (4 ◆, impopular)')}</button></div>`:''}</div>
  <h3 class="sect" style="font-size:18px">${t('Agenda législatif','Legislative agenda','Agenda legislativo')}</h3>${cards||`<p class="muted">${t('Plus aucun texte à proposer.','Nothing left to propose.','No queda ningún texto por proponer.')}</p>`}`;
}
function tabPro(T){
  const rows=T.prom.map(id=>{const l=LAW(id),ok=T.laws.includes(id);return`<div class="card" style="display:block"><div><h3>${ok?'✔':'⏳'} ${t(l.n.fr,l.n.en,l.n.es)}</h3><p>${ok?t('Promesse tenue : crédibilité et base renforcées.','Promise kept: credibility and base strengthened.','Promesa cumplida: credibilidad y base reforzadas.'):t('Pas encore adoptée. Les électeurs vous jugeront sur ce point.','Not passed yet. Voters will judge you on it.','Aún no aprobada. Los votantes te juzgarán por ello.')}</p></div></div>`}).join('');
  return`<h3 class="sect" style="font-size:18px">${t('Promesses de campagne','Campaign promises','Promesas de campaña')}</h3><p class="muted" style="font-size:13px">${t('Ce sont les enjeux que vous avez mis en avant pendant la campagne. Chaque promesse tenue rapporte ; chaque promesse oubliée pèse aux midterms puis à la réélection.','These are the issues you pushed during the campaign. Each promise kept pays off; each one forgotten weighs on the midterms and then re-election.','Son los temas que destacaste en la campaña. Cada promesa cumplida suma; cada una olvidada pesa en las intermedias y luego en la reelección.')}</p>${rows}`;
}
function tabSen(T){
  const rows=T.sen.map((s,i)=>`<div class="card" style="display:block"><div><h3>${s.n}</h3><p>${s.own?t('Votre camp','Your side','Tu bando'):t('Opposition modérée','Moderate opposition','Oposición moderada')} · ${t('aime','likes','le gusta')} <b>${t(TAGS[s.likes[0]].fr,TAGS[s.likes[0]].en,TAGS[s.likes[0]].es)}</b> · ${t('réticent sur','wary on','reticente en')} <b>${t(TAGS[s.dis[0]].fr,TAGS[s.dis[0]].en,TAGS[s.dis[0]].es)}</b></p><p class="muted" style="font-size:13px">${t('Faveurs','Favors','Favores')} ${'●'.repeat(s.fav)}${'○'.repeat(3-s.fav)}</p></div><div class="irow"><button class="btn sm alt" data-act="courtsen" data-i="${i}" ${T.pc>=1&&s.fav<3&&!T.ev?'':'disabled'}>${t('Courtiser (1 ◆)','Court (1 ◆)','Cortejar (1 ◆)')}</button></div></div>`).join('');
  return`<h3 class="sect" style="font-size:18px">${t('Sénateurs clés','Key senators','Senadores clave')}</h3><p class="muted" style="font-size:13px">${t('Six voix qui font basculer les votes. Chez vous, ils peuvent s’opposer à un texte sur un thème qu’ils n’aiment pas ; dans l’opposition, les modérés peuvent traverser l’allée sur un thème qu’ils aiment. Les courtiser les rend plus coopératifs.','Six votes that swing outcomes. In your camp they may defect on a theme they dislike; among the opposition, moderates may cross the aisle on a theme they like. Courting them makes them more cooperative.','Seis votos que inclinan el resultado. En tu bando pueden rebelarse en un tema que no les gusta; en la oposición, los moderados pueden cruzar el pasillo en un tema que les gusta. Cortejarlos los hace más cooperativos.')}</p>${rows}`;
}
function tabCab(T){
  const rows=CABR.map(r=>{const c=T.cab[r.k];return`<div class="card" style="display:block"><div><h3>${t(r.n.fr,r.n.en,r.n.es)}</h3><p>${c?`${c.n} — ${t(CABP[c.pf].n.fr,CABP[c.pf].n.en,CABP[c.pf].n.es)}`:t('Poste vacant','Vacant post','Puesto vacante')} · ${t(r.e.fr,r.e.en,r.e.es)}</p></div>${c?'':`<div class="irow"><button class="btn sm" data-act="cabopen" data-k="${r.k}" ${T.pc>=1&&!T.ev?'':'disabled'}>${t('Nommer (1 ◆)','Appoint (1 ◆)','Nombrar (1 ◆)')}</button></div>`}</div>`}).join('');
  return`<h3 class="sect" style="font-size:18px">${t('Gouvernement','Cabinet','Gobierno')}</h3><p class="muted" style="font-size:13px">${t('Les ministres sont soumis à la confirmation du Sénat. Un expert apporte le plus ; un fidèle plaît à la base mais peut devenir un risque ; un profil consensuel passe presque toujours.','Cabinet members need Senate confirmation. An expert brings the most; a loyalist pleases the base but can become a liability; a consensus pick almost always passes.','Los ministros necesitan la confirmación del Senado. Un experto aporta más; un leal gusta a la base pero puede ser un riesgo; un perfil de consenso casi siempre pasa.')}</p>${rows}`;
}
function tabBil(T){
  const w=Math.min(T.hard,T.mod);
  return`<div class="panel"><h3 style="font-size:20px">${t('Bilan','Record','Balance')}</h3>${recordSummary(T)}
   ${bar2(t('Dette','Debt','Deuda'),T.debt-60,100,T.debt>115?'var(--rep,#b33)':myC(),Math.round(T.debt)+' %')}
   <p class="muted" style="font-size:13px;margin:2px 0 6px">${T.debt>115?t('Dette élevée : l’économie en souffre.','High debt: the economy suffers.','Deuda alta: la economía sufre.'):T.debt<95?t('Dette maîtrisée : un atout.','Debt under control: an asset.','Deuda controlada: una ventaja.'):t('Dette sous contrôle.','Debt under control.','Deuda bajo control.')}</p>
   ${bar2(t('Aile dure','Hard-liners','Ala dura'),T.hard,100,myC())}${bar2(t('Modérés','Moderates','Moderados'),T.mod,100,myC())}
   <p class="muted" style="font-size:13px;margin:2px 0 0">${w<30?t('Fracture en vue : votre parti pourrait vous opposer un challenger à la réélection.','A split looms: your party could field a challenger against you at re-election.','Se avecina una fractura: tu partido podría plantarte un rival en la reelección.'):w<40?t('Une aile commence à rechigner à voter vos textes.','A wing is starting to balk at your bills.','Un ala empieza a resistirse a votar tus textos.'):t('Le parti est uni.','The party is united.','El partido está unido.')}</p></div>
   ${T.log.length?`<div class="panel"><p class="muted" style="font-size:13px;margin:0">${T.log.map(l=>t(l.fr,l.en,l.es)).join('<br>')}</p></div>`:''}`;
}
function renderTerm(){
  const T=TM();m2Ensure(T);
  $('#dock').hidden=true;$('#coach').hidden=true;document.body.classList.remove('tuto');
  const tabs=[['tAg',t('Agenda','Agenda','Agenda')],['tPro',t('Promesses','Promises','Promesas')],['tSen',t('Sénat','Senate','Senado')],['tCab',t('Cabinet','Cabinet','Gabinete')],['tBil',t('Bilan','Record','Balance')]];
  if(!tabs.some(x=>x[0]===UI.tab))UI.tab='tAg';
  const nav=$('#tabsNav');nav.hidden=false;nav.dataset.t='1';
  nav.innerHTML=tabs.map(([k,l])=>`<button role="tab" data-act="tab" data-tab="${k}" aria-selected="${UI.tab===k}">${l}</button>`).join('');
  const yr=Math.ceil(Math.min(T.q,T.qmax)/4)+(T.half===2?2:0);
  $('#hudTop').innerHTML=`<div class="row"><span class="wk">${t('Mandat','Term','Mandato')} · ${t('Trim.','Qtr','Trim.')} ${Math.min(T.q,T.qmax)}/${T.qmax} <span class="muted" style="font-size:14px;font-family:var(--f-body);text-transform:none;letter-spacing:0">${t('Année','Year','Año')} ${yr}</span></span><span class="rt">${homeBtn()}<button class="help" data-act="help" aria-label="${t('Ouvrir le manuel','Open the manual','Abrir el manual')}">?</button></span></div>`;
  const fn={tAg:tabAg,tPro:tabPro,tSen:tabSen,tCab:tabCab,tBil:tabBil}[UI.tab];
  $('#main').innerHTML=`<div class="panel"><div class="irow" style="justify-content:space-between"><span><b>${t('Popularité','Approval','Aprobación')}</b> ${Math.round(T.pop)} %</span><span><b>${t('Capital','Capital','Capital')}</b> ${T.pc} ◆</span><span><b>${t('Actions','Actions','Acciones')}</b> ${T.acts}/2</span></div></div>${fn(T)}
  <button class="btn full" style="margin-top:8px" data-act="tend" ${T.ev?'disabled':''}>${t('Fin du trimestre','End the quarter','Fin del trimestre')}</button>
  <div class="irow" style="margin-top:10px"><button class="btn alt sm" data-act="restart">${t('Menu (partie sauvegardée)','Menu (game saved)','Menú (partida guardada)')}</button></div>`;
  window.scrollTo(0,0);
}
