/* ---------- Scénarios historiques ---------- */
// Real state margins (src/data/history.json, recentered on the game's baseline); everything else is fictional.
// env: national tilt in D points added to the neutral environment; econ/sal: starting economy and issue salience;
// third: independent candidate (side = party hurt). start/end = [month0,day] of week 1 and of election day.
const SCN={
 '2008':{y:2008,inc:'R',env:-3.5,econ:-1.7,winner:'D',sal:{eco:1.4,def:.9,san:.85},third:null,start:[7,12],end:[10,4],
  head:B('Août 2008','August 2008','Agosto de 2008'),
  tag:B('Crise financière, guerres, siège ouvert','Financial crisis, wars, open seat','Crisis financiera, guerras, escaño abierto'),
  blurb:B('Scénario historique : la carte reprend les marges réelles de 2008. Le président sortant ne se représente pas, la crise financière écrase l’économie et le parti sortant est très impopulaire.','Historical scenario: the map uses the real 2008 margins. The incumbent is not running, the financial crisis crushes the economy and the incumbent party is deeply unpopular.','Escenario histórico: el mapa usa los márgenes reales de 2008. El presidente saliente no se presenta, la crisis financiera hunde la economía y el partido en el poder es muy impopular.')},
 '2012':{y:2012,inc:'D',env:-2.2,econ:-.3,winner:'D',sal:{eco:1.25,san:.95,sec:.5},third:null,start:[7,14],end:[10,6],
  head:B('Août 2012','August 2012','Agosto de 2012'),
  tag:B('Reprise lente, réforme de santé, président sortant','Slow recovery, health-care reform, an incumbent president','Recuperación lenta, reforma sanitaria, presidente en ejercicio'),
  blurb:B('Scénario historique : la carte reprend les marges réelles de 2012. Un président sortant brigue un second mandat dans une reprise lente ; la santé et l’emploi dominent la campagne.','Historical scenario: the map uses the real 2012 margins. An incumbent president seeks a second term in a slow recovery; health care and jobs dominate the campaign.','Escenario histórico: el mapa usa los márgenes reales de 2012. Un presidente en ejercicio busca un segundo mandato en una recuperación lenta; la sanidad y el empleo dominan la campaña.')},
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
// Midterms historiques : le climat national, le parti sortant et l’économie viennent de l’année ; les marges de départ reprennent la présidentielle précédente.
const MSCN={
 '2010':{y:2010,inc:'D',env:-3.8,econ:-.7,prev:'2008',start:[7,10],end:[10,2],sal:{eco:1.35,san:1.1},
  head:B('Midterms 2010','2010 midterms','Intermedias de 2010'),tag:B('Vague adverse pour le parti du président','A wave against the president’s party','Ola adversa al partido del presidente'),
  blurb:B('Scénario historique : le chômage reste très élevé et la réforme de santé divise. Le parti du président affronte une vague contraire. Les marges de départ reprennent 2008 ; les effectifs de la Chambre et du Sénat sont ceux d’aujourd’hui.','Historical scenario: unemployment stays very high and the health-care reform divides the country. The president’s party faces a headwind. Starting margins use 2008; House and Senate sizes are today’s.','Escenario histórico: el desempleo sigue muy alto y la reforma sanitaria divide al país. El partido del presidente afronta un viento en contra. Los márgenes iniciales usan 2008; el tamaño de la Cámara y el Senado es el actual.')},
 '2018':{y:2018,inc:'R',env:3.0,econ:.8,prev:'2016',start:[7,14],end:[10,6],sal:{san:1.2,imm:1.2},
  head:B('Midterms 2018','2018 midterms','Intermedias de 2018'),tag:B('Vague de mobilisation contre le président','A mobilization wave against the president','Ola de movilización contra el presidente'),
  blurb:B('Scénario historique : économie solide, mais un électorat très mobilisé contre le parti du président, avec la santé et l’immigration en tête. Les marges de départ reprennent 2016.','Historical scenario: a solid economy, yet a heavily mobilized electorate against the president’s party, with health care and immigration up front. Starting margins use 2016.','Escenario histórico: economía sólida, pero un electorado muy movilizado contra el partido del presidente, con la sanidad y la inmigración en primer plano. Los márgenes iniciales usan 2016.')},
 '2022':{y:2022,inc:'D',env:-1.2,econ:-.6,prev:'2020',start:[7,16],end:[10,8],sal:{eco:1.3,avo:1.25,imm:1.0},
  head:B('Midterms 2022','2022 midterms','Intermedias de 2022'),tag:B('Inflation contre avortement : une vague qui ne vient pas','Inflation versus abortion: a wave that never comes','Inflación contra aborto: una ola que no llega'),
  blurb:B('Scénario historique : l’inflation pèse sur le parti du président, mais la question de l’avortement mobilise l’autre camp. Course très ouverte. Les marges de départ reprennent 2020.','Historical scenario: inflation weighs on the president’s party, but abortion mobilizes the other side. A wide-open race. Starting margins use 2020.','Escenario histórico: la inflación pesa sobre el partido del presidente, pero el aborto moviliza al otro bando. Carrera muy abierta. Los márgenes iniciales usan 2020.')}
};
function applyMScn(G0,k){
  const S=MSCN[k],H=HIST[S.prev];
  if(H)G0.states.forEach(s=>{if(H[s.ab]!=null)s.lean=H[s.ab]});
  G0.mscn=k;G0.inc=S.inc;G0.econ=clamp(S.econ+randn()*.3,-2,2);
  G0.sal0=S0.slice();ISSUES.forEach((q,i)=>{if(S.sal[q.id]!=null)G0.sal0[i]=S.sal[q.id]});G0.sal=G0.sal0.slice();
  G0.env=PARAM.neutral+S.env+G0.me*({0:1.2,1:0,2:-1.2}[G0.diff])+randn()*.5;
}
function applyScn(G0,scn){
  const S=SCN[scn],H=scn==='2024'?null:HIST[scn];
  if(H)G0.states.forEach(s=>{if(H[s.ab]!=null)s.lean=H[s.ab]});
  G0.scn=scn;G0.inc=S.inc;G0.econ=clamp(S.econ+randn()*.3,-2,2);
  G0.sal0=S0.slice();ISSUES.forEach((q,i)=>{if(S.sal[q.id]!=null)G0.sal0[i]=S.sal[q.id]});G0.sal=G0.sal0.slice();
  const T=S.third;G0.third=T&&rnd()<T.p?{name:G0.third?G0.third.name:genNamePick([]),side:T.side,pow:0,on:false,wk:T.wk}:null;
}
const scnBase=()=>{const M=G&&G.mscn&&MSCN[G.mscn];if(M)return{y:M.y,s:M.start,e:M.end};const S=G&&G.scn&&SCN[G.scn];return S?{y:S.y,s:S.start,e:S.end}:G&&G.mode==='mid'?{y:2030,s:[7,12],e:[10,5]}:{y:2028,s:[7,14],e:[10,7]}};
