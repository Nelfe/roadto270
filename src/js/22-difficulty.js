/* ---------- Difficulté : réglages fins, conseils et États à cibler (mode Facile) ---------- */
// index = G.diff (0 easy, 1 normal, 2 hard)
const DM={cash:[3,0,-3],noise:[.7,1,1.3],nat:[.7,1,1.25],neg:[.75,1,1.3],undo:[99,99,3]};
const hintsOn=()=>G&&G.diff===0&&!SET.nohint&&(G.phase==='play'||G.phase==='event');
// States within reach: the player trails slightly or is close; weighted by size. Based on the poll average (what the player sees).
function hintStates(n=4){
  const mid=G.mode==='mid';
  return G.states.map(s=>{const p=G.me*pollOf(s),w=mid?(s.hs||0)+(s.sen?3:0):s.ev;
    return{ab:s.ab,p,sc:(p>-4&&p<1.4&&w>=(mid?3:6))?w*(1-Math.abs(p+1.2)/5):0}}).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,n);
}
function tipsList(){
  const out=[],hs=hintStates(3);
  if(G.viral&&!G.viral.resp)out.push(t('Une tempête virale attend votre réponse (onglet Actions) : agir vite limite les dégâts.','A viral storm awaits your response (Actions tab): acting fast limits the damage.','Una tormenta viral espera tu respuesta (pestaña Acciones): actuar rápido limita el daño.'));
  if(G.mode!=='mid'){const nd=[5,9].find(w=>w>=G.wk);if(nd&&nd-G.wk<=2&&G.prep<2)out.push(t(`Débat à la semaine ${nd} : préparez-vous (${G.prep}/3).`,`Debate in week ${nd}: get ready (${G.prep}/3).`,`Debate en la semana ${nd}: prepárate (${G.prep}/3).`))}
  if(G.cash<6)out.push(t('Caisse presque vide : une collecte de fonds s’impose avant de dépenser davantage.','Cash is nearly out: fundraise before spending more.','La caja está casi vacía: haz una recaudación antes de gastar más.'));
  if(hs.length){const s=ST(hs[0].ab);out.push(t(`Cible facile : ${sn(s)} (${fD(pollOf(s))}). Un peu de publicité ou un bureau peut la faire basculer.`,`Easy target: ${sn(s)} (${fD(pollOf(s))}). A little advertising or an office could flip it.`,`Objetivo fácil: ${sn(s)} (${fD(pollOf(s))}). Un poco de publicidad o una oficina puede cambiarlo.`))}
  const si=ISSUES.map((q,i)=>({q,i,v:G.sal[i]*(G.me*q.own>0?1:0)})).sort((a,b)=>b.v-a.v)[0];
  if(si&&si.v>.8)out.push(t(`« ${t(si.q.n)} » compte beaucoup et vous y avez l’avantage : mettez-le à l’agenda.`,`“${t(si.q.n)}” matters a lot and you have the edge: push it onto the agenda.`,`“${t(si.q.n)}” pesa mucho y tienes ventaja: ponlo en la agenda.`));
  if(G.wk<=3)out.push(t('Les bureaux de terrain rapportent sur la durée : ouvrez-en tôt dans les États clés.','Field offices pay off over time: open them early in the key states.','Las oficinas de campo rinden con el tiempo: abre pronto en los estados clave.'));
  if(G.ap>=3&&G.wk>1)out.push(t('Vous avez toutes vos actions : une visite dans un État clé est rarement perdue.','You have all your actions: a visit to a key state is rarely wasted.','Tienes todas tus acciones: una visita a un estado clave rara vez se pierde.'));
  return out.slice(0,3);
}
function tipsHTML(){
  if(!hintsOn())return'';const l=tipsList();if(!l.length)return'';
  return`<div class="tips"><b>${t('Conseils du directeur de campagne','Campaign manager tips','Consejos del director de campaña')}</b>${l.map(x=>`<p>${x}</p>`).join('')}</div>`;
}
