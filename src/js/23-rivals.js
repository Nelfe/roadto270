/* ---------- Profils de rival ---------- */
// Each rival has one playing style, shown from the start (brief + Actions tab). Effects are small and roughly balanced.
const RIVALS={
 attack:{n:B('Attaquant','Attack dog','Atacante'),d:B('Lance des publicités d’attaque qui entament votre image, mais dépense moins sur le terrain.','Runs attack ads that dent your image, but spends less on the ground.','Lanza anuncios de ataque que dañan tu imagen, pero gasta menos sobre el terreno.')},
 careful:{n:B('Prudent','Cautious','Prudente'),d:B('Garde son argent et frappe fort en fin de campagne ; ajuste rarement ses positions.','Hoards cash and spends heavily late; rarely shifts its positions.','Ahorra y gasta mucho al final; rara vez cambia de posición.')},
 centrist:{n:B('Centriste','Centrist','Centrista'),d:B('Se repositionne vite vers les États serrés et réagit à vos changements de position.','Repositions fast toward close states and reacts to your position changes.','Se reposiciona rápido hacia los estados reñidos y reacciona a tus cambios de posición.')},
 populist:{n:B('Populiste','Populist','Populista'),d:B('Enchaîne les meetings, mais commet des gaffes qui vous profitent.','Piles on rallies, but makes gaffes that help you.','Encadena mítines, pero comete deslices que te benefician.')},
 moneyed:{n:B('Bien financé','Well-funded','Bien financiado'),d:B('Reçoit plus d’argent chaque semaine, mais ouvre moins de bureaux.','Gets more money every week, but opens fewer offices.','Recibe más dinero cada semana, pero abre menos oficinas.')},
 digital:{n:B('Numérique','Digital-first','Digital'),d:B('Multiplie les offensives en ligne, qui font monter la rumeur dans plusieurs États.','Launches online offensives that stir buzz in several states.','Multiplica las ofensivas en línea, que generan rumor en varios estados.')}
};
const pfO=()=>G&&G.opp&&G.opp.pf||null;
const rivalLine=()=>{const k=pfO();return k?`<b>${t(RIVALS[k].n)}</b> : ${t(RIVALS[k].d)}`:''};
function rivalPanel(){
  if(!G.opp||G.mode==='mid'||!pfO())return'';
  return`<div class="panel"><h3 style="font-size:20px">${t('Votre adversaire','Your opponent','Tu rival')}</h3><p style="margin:6px 0 2px"><b>${G.opp.n}</b> · ${roleTxt(G.opp)}</p><p class="muted" style="margin:0;font-size:14px">${rivalLine()}</p></div>`;
}
// rival-specific weekly behaviour (called from oppTurn); pub = log lines
function rivalWeek(pub,top){
  const k=pfO();if(!k)return 0;let extra=0;
  if(k==='attack'&&rnd()<.35){H.img(-.12);extra+=.8;pub.push(B('L’adversaire diffuse une publicité d’attaque contre vous.','Your opponent airs an attack ad against you.','El rival emite un anuncio de ataque contra ti.'))}
  if(k==='populist'&&rnd()<.15){H.img(.12);pub.push(B('L’adversaire commet une gaffe en meeting.','Your opponent makes a gaffe at a rally.','El rival comete un desliz en un mitin.'))}
  if(k==='digital'){top.slice(2,5).sort(()=>rnd()-.5).slice(0,2).forEach(x=>{x.s.buzzO=Math.min(2.4,x.s.buzzO+.8);extra+=.3});if(rnd()<.4)pub.push(B('Offensive en ligne de l’adversaire.','Online offensive by your opponent.','Ofensiva en línea del rival.'))}
  return extra;
}
