/* ---------- Scénarios historiques ---------- */
// Real state margins (src/data/history.json, recentered on the game's baseline); everything else is fictional.
// env: national tilt in D points added to the neutral environment; econ/sal: starting economy and issue salience;
// third: independent candidate (side = party hurt). start/end = [month0,day] of week 1 and of election day.
const SCN={
 '2016':{y:2016,inc:'D',env:.9,econ:.3,winner:'R',sal:{imm:1.1,com:.75,eco:.95},third:{side:'D',wk:2,p:1},start:[7,15],end:[10,8],
  head:B('Août 2016','August 2016','Agosto de 2016'),
  tag:B('Siège ouvert, campagne très clivante, indépendants influents','Open seat, a deeply divisive campaign, influential independents','Escaño abierto, campaña muy polarizada, independientes con peso'),
  blurb:B('Scénario historique : la carte reprend les marges réelles de 2016. Le président sortant ne se représente pas, l’immigration et le commerce dominent, et un candidat indépendant va peser.','Historical scenario: the map uses the real 2016 margins. The incumbent is not running, immigration and trade dominate, and an independent candidate will matter.','Escenario histórico: el mapa usa los márgenes reales de 2016. El presidente en ejercicio no se presenta, dominan la inmigración y el comercio, y un candidato independiente pesará.')},
 '2020':{y:2020,inc:'R',env:3.2,econ:-1.0,winner:'D',sal:{san:1.0,sec:.8,eco:.9},third:{side:'D',wk:4,p:.25},start:[7,10],end:[10,3],
  head:B('Août 2020','August 2020','Agosto de 2020'),
  tag:B('Pandémie, récession, vote anticipé massif','Pandemic, recession, record early voting','Pandemia, recesión, voto anticipado masivo'),
  blurb:B('Scénario historique : la carte reprend les marges réelles de 2020. Une pandémie pèse sur l’économie, la santé et la sécurité dominent le débat et le vote anticipé sera massif.','Historical scenario: the map uses the real 2020 margins. A pandemic weighs on the economy, health care and public safety dominate the debate, and early voting will be massive.','Escenario histórico: el mapa usa los márgenes reales de 2020. Una pandemia pesa sobre la economía, la salud y la seguridad dominan el debate y el voto anticipado será masivo.')},
 '2024':{y:2024,inc:'D',env:.1,econ:.4,winner:'R',sal:{eco:1.35,imm:1.1,avo:.8},third:{side:'D',wk:3,p:.6},start:[7,12],end:[10,5],
  head:B('Août 2024','August 2024','Agosto de 2024'),
  tag:B('Inflation, immigration, campagne raccourcie','Inflation, immigration, a shortened campaign','Inflación, inmigración, campaña acortada'),
  blurb:B('Scénario historique : la carte reprend les marges réelles de 2024. L’inflation et l’immigration dominent, le parti sortant est en difficulté et la campagne est courte.','Historical scenario: the map uses the real 2024 margins. Inflation and immigration dominate, the incumbent party is struggling and the campaign is short.','Escenario histórico: el mapa usa los márgenes reales de 2024. Dominan la inflación y la inmigración, el partido en el poder está en apuros y la campaña es corta.')}
};
function applyScn(G0,scn){
  const S=SCN[scn],H=scn==='2024'?null:HIST[scn];
  if(H)G0.states.forEach(s=>{if(H[s.ab]!=null)s.lean=H[s.ab]});
  G0.scn=scn;G0.inc=S.inc;G0.econ=clamp(S.econ+randn()*.3,-2,2);
  G0.sal0=S0.slice();ISSUES.forEach((q,i)=>{if(S.sal[q.id]!=null)G0.sal0[i]=S.sal[q.id]});G0.sal=G0.sal0.slice();
  const T=S.third;G0.third=rnd()<T.p?{name:G0.third?G0.third.name:genNamePick([]),side:T.side,pow:0,on:false,wk:T.wk}:null;
}
const scnBase=()=>{const S=G&&G.scn&&SCN[G.scn];return S?{y:S.y,s:S.start,e:S.end}:G&&G.mode==='mid'?{y:2030,s:[7,12],e:[10,5]}:{y:2028,s:[7,14],e:[10,7]}};
