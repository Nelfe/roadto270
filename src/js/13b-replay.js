/* ---------- Rejouabilité : défi de la semaine, saga / dynastie, archétypes à débloquer ---------- */
// --- Défi de la semaine ---
const weekId=()=>{const d=new Date(),t0=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),n=t0.getUTCDay()||7;t0.setUTCDate(t0.getUTCDate()+4-n);const y0=new Date(Date.UTC(t0.getUTCFullYear(),0,1));return t0.getUTCFullYear()+'-W'+String(Math.ceil(((t0-y0)/864e5+1)/7)).padStart(2,'0')};
const WMODS=[
 {id:'broke',n:B('Caisse presque vide','Nearly broke','Caja casi vacía'),d:B('Vous démarrez avec 45 % de fonds en moins.','You start with 45% less money.','Empiezas con un 45 % menos de fondos.'),f:()=>{G.cash*=.55}},
 {id:'headwind',n:B('Vent contraire','Headwind','Viento en contra'),d:B('Le climat national penche de 1,8 point contre vous.','The national climate leans 1.8 points against you.','El clima nacional se inclina 1,8 puntos en tu contra.'),f:()=>{G.env-=G.me*1.8}},
 {id:'fog',n:B('Brouillard sur les sondages','Polling fog','Niebla en las encuestas'),d:B('Les sondages se trompent beaucoup plus.','Polls are far less reliable.','Las encuestas fallan mucho más.'),f:()=>{G.pbNat*=2.2;G.states.forEach(s=>{s.pb*=1.6})}},
 {id:'rival',n:B('Rival richissime','Deep-pocketed rival','Rival adinerado'),d:B('L’adversaire démarre avec 14 M$ de plus et se finance par de gros donateurs.','The opponent starts with $14M more and runs on big donors.','El rival empieza con 14 M$ más y se financia con grandes donantes.'),f:()=>{G.cashO+=14;if(G.opp)G.opp.pf='moneyed'}},
 {id:'short',n:B('Campagne éclair','Lightning campaign','Campaña relámpago'),d:B('Il ne reste que 8 semaines avant le scrutin.','Only 8 weeks remain before the vote.','Solo quedan 8 semanas para la votación.'),f:()=>{G.wk=5}}
];
const wmodOf=w=>WMODS[hashStr('wmod-'+w)%WMODS.length];
function startWeekly(){
  const w=weekId(),m=wmodOf(w);
  newGame(pickedSide,pickedDiff,hashStr('weekly-'+w),null,'pres');
  G.weekly=w;G.wmod=m.id;m.f();save();render();
  showModal(`<h2>${t('Défi de la semaine','Weekly challenge','Desafío semanal')} · ${w}</h2><p><b>${t(m.n.fr,m.n.en,m.n.es)}</b></p><p>${t(m.d.fr,m.d.en,m.d.es)}</p><p class="muted" style="font-size:13px">${t('Tout le monde joue la même partie cette semaine : comparez vos résultats avec le code de partie.','Everyone plays the same game this week: compare results using the game code.','Todos juegan la misma partida esta semana: compara tus resultados con el código de partida.')}</p><button class="btn full" data-act="closeHelp">${t('C’est parti','Let’s go','Vamos')}</button>`,'weekly');
}
// --- Saga / dynastie ---
function sagaAdd(T,pts,fr,en,es){if(!T||!T.saga)return;T.saga.pts+=pts;T.saga.log.push([pts,fr,en,es||en])}
function sagaTermEnd(T){
  if(!T.saga)return;const k=kept(T).length;
  sagaAdd(T,T.laws.length*5,`${T.laws.length} lois en vigueur`,`${T.laws.length} laws in force`,`${T.laws.length} leyes en vigor`);
  if(k)sagaAdd(T,k*10,`${k} promesse(s) tenue(s)`,`${k} promise(s) kept`,`${k} promesa(s) cumplida(s)`);
  if(T.pop>=50)sagaAdd(T,15,'Popularité au-dessus de 50 %','Approval above 50%','Aprobación por encima del 50 %');
  if(T.debt<100)sagaAdd(T,10,'Dette maîtrisée','Debt under control','Deuda controlada');
}
function sagaHTML(S){
  if(!S)return'';
  return`<div class="res"><b>${t('Saga','Saga','Saga')} : ${S.pts} ${t('points','points','puntos')} · ${S.cycles} ${t(S.cycles>1?'cycles':'cycle',S.cycles>1?'cycles':'cycle',S.cycles>1?'ciclos':'ciclo')}</b><br>${S.log.slice(-8).map(l=>`+${l[0]} ${t(l[1],l[2],l[3])}`).join('<br>')}</div>`;
}
function sagaFinish(win){
  const s=G.saga;if(!s||G.sagaDone||G.dbg)return;G.sagaDone=true;
  const S=getStats();S.saga=(S.saga||0)+(G.reel&&win?1:0);S.sagaBest=Math.max(S.sagaBest||0,s.pts);S.sagaN=(S.sagaN||0)+1;
  try{localStorage.setItem(STK,JSON.stringify(S))}catch(e){}
}
function termToNext(){ // dynastie : un nouveau cycle, nouvelle campagne pour votre parti
  const T=G.term||G.reelT,me=G.me,diff=G.diff,slot=G.slot,seed=G.seed,dbg=G.dbg,saga=G.saga||{pts:0,cycles:1,log:[]};
  saga.cycles++;saga.log.push([0,'Passage de relais : nouveau cycle','Handing over: a new cycle','Relevo: nuevo ciclo']);
  newGame(me,diff,(seed|0)+303,null,'pres');
  G.dbg=dbg;G.slot=slot;G.saga=saga;G.dyn=saga.cycles;G.carry={debt:T.debt};
  G.inc=side();G.econ=T.econ;
  G.env=PARAM.neutral+me*((T.pop-45)*.07+T.econ*.3-.8+randn()*.9)+me*({0:1.2,1:0,2:-1.2}[diff])*.5;
  save();hideModal();render();
  showModal(`<h2>${t('Nouveau cycle','New cycle','Nuevo ciclo')} ${saga.cycles}</h2><p>${t('Le mandat s’achève. Votre parti doit choisir un nouveau candidat pour conserver la Maison-Blanche : le bilan de votre présidence pèse sur le climat de la campagne.','The term is over. Your party must pick a new candidate to keep the White House: your presidency’s record weighs on the campaign climate.','El mandato termina. Tu partido debe elegir un nuevo candidato para conservar la Casa Blanca: el balance de tu presidencia pesa en el clima de la campaña.')}</p>${sagaHTML(saga)}<button class="btn full" data-act="closeHelp">${t('Continuer','Continue','Continuar')}</button>`,'saga');
}
// --- Archétypes à débloquer ---
const ARCH=[
 {id:'pragm',n:B('Le gouverneur pragmatique','The pragmatic governor','El gobernador pragmático'),k:'gov',tr:['swing','org'],wk:'stiff',u:S=>S.w>=1,c:B('Gagner une partie','Win a game','Ganar una partida')},
 {id:'senior',n:B('Le sénateur chevronné','The seasoned senator','El senador veterano'),k:'sen',tr:['vet','debate'],wk:'unknown',u:S=>S.w>=3,c:B('Gagner 3 parties','Win 3 games','Ganar 3 partidas')},
 {id:'founder',n:B('L’entrepreneuse','The founder','La emprendedora'),k:'ceo',tr:['funds','media'],wk:'scandal',u:S=>!!(S.df&&S.df[2]&&S.df[2][1]>=1),c:B('Gagner en Difficile','Win on Hard','Ganar en Difícil')},
 {id:'general',n:B('Le général','The general','El general'),k:'gen',tr:['crisis','bridge'],wk:'gaffe',u:S=>!!S.sc&&Object.keys(S.sc).length>=1,c:B('Gagner un scénario historique','Win a historical scenario','Ganar un escenario histórico')},
 {id:'tribune',n:B('Le tribun du peuple','The people’s tribune','El tribuno del pueblo'),k:'may',tr:['charm','youth'],wk:'divisive',u:S=>(S.h||[]).some(h=>h.mid&&h.win),c:B('Gagner des midterms','Win a midterm','Ganar unas intermedias')},
 {id:'heir',n:B('L’héritière politique','The political heir','La heredera política'),k:'rep',tr:['home','frugal'],wk:'broke',u:S=>(S.saga||0)>=1,c:B('Être réélu(e) en mode saga','Win re-election in saga mode','Ser reelegido/a en modo saga')}
];
function archCands(sd,used){
  const S=getStats(),sg=sd==='D'?1:-1,okSt=ST_RAW.filter(r=>r[3]*sg>-12&&r[0]!=='DC').map(r=>r[0]);
  return ARCH.filter(a=>a.u(S)).map(a=>{
    const g=rnd()<.5?'f':'m';let n;do{n=pickR(FIRSTN[g])+' '+pickR(LASTN)}while(used.includes(n));used.push(n);
    let hs,city=null;if(a.k==='may'){const m=pickR(MAYORS.filter(q=>okSt.includes(q[1])||sd==='D'));city=m[0];hs=m[1]}else hs=pickR(okSt);
    return{n,g,k:a.k,hs,city,tr:a.tr.slice(),wk:a.wk,arch:a.id};
  });
}
function archNext(){const S=getStats(),a=ARCH.find(x=>!x.u(S));return a?`<p class="muted" style="font-size:13px;margin:6px 0 0">★ ${t('Prochain archétype à débloquer','Next archetype to unlock','Próximo arquetipo por desbloquear')} : ${t(a.n.fr,a.n.en,a.n.es)} (${t(a.c.fr,a.c.en,a.c.es)})</p>`:''}
