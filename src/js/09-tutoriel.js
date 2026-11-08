/* ---------- Tutoriel et manuel ---------- */
const TUTO=[
 {tab:'map',hl:'#hudTop .evbar',t:B('Votre objectif','Your goal'),x:B('Il faut 270 grands électeurs sur 538 en 12 semaines. Cette barre projette le résultat d’après les sondages : votre couleur à gauche, l’adversaire à droite, le trait marque 270.','You need 270 of 538 electoral votes in 12 weeks. This bar projects the result from the polls: your color on the left, your opponent on the right, the line marks 270.')},
 {tab:'map',sel:'PA',hl:'.map',t:B('La carte','The map'),x:B('Chaque case est un État, colorée selon la moyenne des sondages. Les cases hachurées sont trop serrées pour trancher. Touchez un État : son détail s’affiche en dessous.','Each tile is a state, colored by its poll average. Hatched tiles are too close to call. Tap a state: its details appear below.')},
 {tab:'map',sel:'PA',hl:'.acts',t:B('Agir sur un État','Acting in a state'),x:B('La publicité coûte de l’argent, le bureau de terrain de l’argent et 1 action (effet durable), la visite 1 action (effet court). Le sondage interne coûte 1 M$ et révèle la vraie marge.','Ads cost money, a field office costs money and 1 action (lasting effect), a visit costs 1 action (short-lived effect). An internal poll costs $1M and reveals the true margin.')},
 {tab:'map',hl:'#aps',t:B('Votre temps','Your time'),x:B('Vous avez 3 actions par semaine (les pastilles). Votre budget est en haut à droite et se reconstitue chaque semaine. Les États serrés et riches en grands électeurs sont les plus rentables.','You have 3 actions per week (the dots). Your budget is at the top right and refills every week. Close states with many electoral votes are the best value.')},
 {tab:'issues',hl:'.issue',t:B('Les enjeux','The issues'),x:B('Votre position (point plein) face à celle de l’adversaire (cercle). Chaque État réagit selon sa population : se recentrer gagne des États serrés mais en fait perdre dans vos bastions. Chaque changement coûte 1 action.','Your position (filled dot) against your opponent’s (ring). Each state reacts according to its population: moving to the center wins close states but loses ground in your strongholds. Each change costs 1 action.')},
 {tab:'groups',hl:'.grp',t:B('Les groupes d’électeurs','Voter groups'),x:B('Sept groupes pèsent différemment selon les États. La barre montre qui ils préfèrent d’après vos positions. Cibler un groupe (1 action, 1,5 M$) donne un bonus partout où il est nombreux.','Seven groups weigh differently from state to state. The bar shows who they prefer given your positions. Targeting a group (1 action, $1.5M) gives a bonus wherever it is large.')},
 {tab:'team',hl:'.staff',t:B('L’équipe','The team'),x:B('Recrutez des cadres : un sondeur, un directeur de terrain, de la communication… Chaque recrue coûte un salaire chaque semaine, à comparer à ce qu’elle rapporte.','Hire staff: a pollster, a field director, communications… Each hire costs a salary every week, to weigh against what they bring.')},
 {tab:'actions',hl:'.card',t:B('Campagne nationale','National campaign'),x:B('Collecte de fonds, grande interview et préparation du débat (semaines 5 et 9) se font ici. Pensez à collecter régulièrement : l’argent est le nerf de la guerre.','Fundraising, major interviews and debate prep (weeks 5 and 9) happen here. Fundraise regularly: money is the lifeblood of a campaign.')},
 {tab:'map',hl:'#endBtn',t:B('Terminer la semaine','End the week'),x:B('L’adversaire joue, l’économie bouge, puis un événement vous demande de choisir. Le bouton ? en haut à droite rouvre le manuel à tout moment. Bonne campagne.','Your opponent plays, the economy moves, then an event asks you to choose. The ? button at the top right reopens the manual at any time. Good luck.')}
];
const tutoSeen=()=>{try{return localStorage.getItem('cap270.tuto')==='1'}catch(e){return false}};
const tutoMark=()=>{try{localStorage.setItem('cap270.tuto','1')}catch(e){}};
function tutoGo(i){
  UI.tuto=i;const st=TUTO[i];UI.tab=st.tab;if(st.sel)UI.sel=st.sel;
  render();const e=st.hl&&document.querySelector(st.hl);if(e)e.scrollIntoView({block:'center',behavior:'smooth'});
}
function renderCoach(){
  const c=$('#coach');document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));
  const on=!SIM&&G&&UI.tuto!=null&&G.phase==='play';
  c.hidden=!on;document.body.classList.toggle('tuto',!!on);if(!on)return;
  const st=TUTO[UI.tuto],last=UI.tuto===TUTO.length-1;
  c.innerHTML=`<div class="cn">${t('Tutoriel · étape','Tutorial · step')} ${UI.tuto+1}/${TUTO.length}</div><h3>${t(st.t)}</h3><p>${t(st.x)}</p><div class="cb">${last?'':`<button class="btn sm alt" data-act="tutoSkip">${t('Passer','Skip')}</button>`}<button class="btn sm" data-act="tutoNext">${last?t('Commencer','Start'):t('Suivant','Next')}</button></div>`;
  const e=document.querySelector(st.hl);if(e)e.classList.add('hl');
}
function langSw(){return`<div class="langsw" role="group" aria-label="Language"><button data-act="lang" data-l="en" aria-pressed="${LANG==='en'}">English</button><button data-act="lang" data-l="fr" aria-pressed="${LANG==='fr'}">Français</button><button data-act="lang" data-l="es" aria-pressed="${LANG==='es'}">Español</button></div>`}
function helpHTML(canReplay){
  const replay=canReplay?`<button class="btn alt" data-act="tutoRestart">${t('Rejouer le tutoriel','Replay the tutorial')}</button>`:'';
  const head=`<div class="man"><div class="mhead"><h2>${t('Manuel','Manual')}</h2><button class="btn sm alt" data-act="closeHelp">${t('Fermer','Close')}</button></div>${langSw()}<div style="margin-bottom:8px"><button class="btn sm alt" data-act="settings">⚙ ${t('Réglages','Settings')}</button></div>`;
  const foot=`<div class="irow" style="margin-top:12px">${replay}<button class="btn" data-act="closeHelp">${t('Fermer','Close')}</button></div></div>`;
  if(FR())return head+`
<details open><summary>But et déroulé</summary><p>Vous menez une campagne présidentielle fictive de 12 semaines, du 14 août au 7 novembre 2028. Il faut au moins <b>270 des 538 grands électeurs</b>.</p>
<ul><li>Chaque semaine, vous dépensez vos <b>3 actions</b> et votre argent.</li><li>Vous terminez la semaine : l’adversaire joue, l’économie évolue, un événement vous demande de choisir.</li><li>Le soir du scrutin, les résultats tombent État par État avec une part de hasard : les sondages peuvent se tromper.</li></ul></details>
<details><summary>Candidats et primaires</summary><ul>
<li>Vous choisissez parmi <b>3 candidats générés</b> : deux atouts et une faiblesse chacun (image, fonds, bureaux moins chers, débats, ancrage local ; interviews risquées, passé encombrant, faible notoriété).</li>
<li>Les <b>primaires</b> comptent 4 scrutins (le Super Tuesday pèse le plus). Vous avez 2 actions par tour : mobiliser la base ou viser le centre, publicité (4 M$), tournée, collecte, attaque d’un rival.</li>
<li>Les électeurs de primaire ont une <b>humeur</b> indiquée sous les sondages. Se placer près d’elle aide, mais votre positionnement déplace vos positions sur les enjeux à l’investiture.</li>
<li>Attaquer affaiblit un rival mais coûte de l’image face à l’adversaire. L’argent restant passe en campagne générale.</li>
<li>Si vous ne finissez pas premier aux délégués, la campagne s’arrête.</li></ul></details>
<details><summary>Lire la carte et les sondages</summary><ul>
<li><b>Couleurs :</b> bleu pour les démocrates, rouge pour les républicains. Plus c’est foncé, plus l’écart est grand. Hachuré : moins de 1,5 point, incertain.</li>
<li><b>Sondages :</b> bruités, avec un biais commun à tout le pays. Un événement permet d’auditer ce biais.</li>
<li><b>Sondage interne (1 M$) :</b> donne la vraie marge de l’État pour la semaine.</li>
<li><b>Barre du haut :</b> projection de votre camp, de l’adversaire et des États incertains. Le trait marque 270.</li>
<li><b>Point doré sur une case :</b> vous y avez un bureau de campagne.</li>
<li>Les marges de départ viennent des résultats de 2024, recalées pour que la course soit ouverte.</li></ul></details>
<details><summary>Actions dans un État</summary><ul>
<li><b>Publicité :</b> coûte 0,8 M$ plus 0,1 M$ par grand électeur. Jusqu’à environ +3 points, avec des rendements décroissants. L’effet baisse de 15 % chaque semaine.</li>
<li><b>Bureau de terrain :</b> 1 action et de l’argent. Jusqu’à 3 par État, environ +0,6, +1,0 puis +1,4 point au total. Effet durable, mais l’entretien coûte chaque semaine.</li>
<li><b>Visite :</b> 1 action et 0,3 M$. +1,3 point de buzz, divisé par deux chaque semaine.</li>
<li>L’adversaire a les mêmes leviers : ce qui compte est l’écart net entre vous deux.</li></ul></details>
<details><summary>Actions nationales</summary><ul>
<li><b>Collecte de fonds :</b> 1 action pour 4 à 7 M$, un peu plus avec une bonne image.</li>
<li><b>Grande interview :</b> le plus souvent bénéfique pour votre image, parfois sans effet, rarement un dérapage.</li>
<li><b>Préparer le débat :</b> jusqu’à 3 niveaux, utilisés aux débats des semaines 5 et 9, puis remis à zéro.</li>
<li><b>Colistier :</b> choisi au début, il apporte un bonus régional, de l’image ou des fonds.</li></ul></details>
<details><summary>Enjeux et positions</summary><ul>
<li>Dix enjeux, chacun avec une <b>importance</b> (barre dorée) et une <b>position</b> de −2 à +2.</li>
<li>Changer une position ou mettre un enjeu à l’agenda coûte 1 action.</li>
<li>Chaque État réagit selon sa population. Se rapprocher des électeurs d’un État vous y rapporte des points, mais vous en fait perdre ailleurs.</li>
<li>S’éloigner de la ligne de votre parti démobilise un peu votre base, partout.</li>
<li>Quand un enjeu gagne en importance, il avantage le camp à qui il est associé : santé, avortement et climat plutôt côté démocrate, immigration, sécurité et économie plutôt côté républicain.</li></ul></details>
<details><summary>Groupes d’électeurs</summary><ul>
<li>Sept groupes. Chaque État a sa propre composition, visible dans son panneau.</li>
<li>Chaque groupe a ses priorités et préfère un camp selon vos positions (onglet Groupes).</li>
<li><b>Cibler un groupe :</b> 1 action et 1,5 M$. Le bonus s’applique dans chaque État selon le poids local du groupe, puis s’estompe de 25 % par semaine. L’adversaire le fait aussi.</li></ul></details>
<details><summary>Économie</summary><ul>
<li>La conjoncture nationale et l’économie de chaque État (secteur, chômage) comptent.</li>
<li>Une bonne économie profite au <b>parti sortant</b>, une mauvaise à son challenger. Le parti sortant est indiqué dans l’onglet Groupes.</li>
<li>L’énergie et l’industrie réagissent plus fort que les services. Des événements peuvent frapper un secteur.</li></ul></details>
<details><summary>Événements, image, débats</summary><ul>
<li>Chaque semaine, un événement demande un choix, souvent avec un coût ou un risque.</li>
<li>Votre <b>image</b> face à l’adversaire déplace tous les États un peu.</li>
<li>Deux débats (semaines 5 et 9) et une révélation de dernière minute (semaine 11).</li></ul></details>
<details><summary>Équipe de campagne</summary><ul>
<li>L’onglet <b>Équipe</b> permet de recruter 5 cadres : directeur de campagne, sondeur, directeur de terrain, communication, finances. Chacun a un niveau (I à III) et un salaire hebdomadaire.</li>
<li>Recruter coûte une semaine de salaire d’avance. Un niveau élevé coûte plus cher : à vous de juger si l’effet compense le salaire.</li></ul></details>
<details><summary>Médias, polémiques et vote anticipé</summary><ul>
<li><b>Canaux de publicité :</b> la TV marche partout et dure plus longtemps ; le numérique coûte 20 % de moins mais s’efface vite et convient aux jeunes et aux diplômés ; la radio locale coûte moitié moins et convient aux zones rurales, aux électeurs noirs et évangéliques. Les coefficients affichés (×) indiquent l’adéquation de chaque canal à l’État.</li>
<li><b>Polémiques :</b> chaque semaine peut apporter une histoire virale (pour ou contre vous). Réagir (1 action) limite les dégâts ou amplifie le bénéfice.</li>
<li><b>Vote anticipé :</b> à partir de la semaine 8, une opération (1 action, 2 M$) engrange un bonus durable dans un État, jusqu’à 3 fois. Il pèse davantage là où les seniors et diplômés dominent. L’adversaire le fait aussi.</li></ul></details>
<details><summary>Candidat indépendant et districts</summary><ul>
<li>Dans certaines parties, un indépendant se lance vers les semaines 3 à 5 et prend des voix à un camp, puis s’essouffle. S’il vous nuit, vous pouvez courtiser ses électeurs ou appeler au vote utile.</li>
<li>Le Maine et le Nebraska répartissent leurs grands électeurs : 2 pour le vainqueur de l’État, 1 par district. Le panneau de l’État montre la marge dans chaque district.</li></ul></details>
<details><summary>Mode Midterms (Chambre et Sénat)</summary><ul>
<li>Vous dirigez la campagne nationale de votre parti. Il n’y a ni candidat, ni primaires, ni débats.</li>
<li>Chaque État élit plusieurs <b>sièges à la Chambre</b> (nombre indiqué sur la carte) ; les États marqués d’une ★ ont aussi une <b>élection au Sénat</b>. Les sièges hors scrutin (34 démocrates, 31 républicains) sont acquis.</li>
<li>Il faut <b>218 sièges</b> à la Chambre pour gagner. Prendre aussi le <b>Sénat</b> (51 sièges ; 50 suffisent pour le parti du président, la vice-présidence départageant) donne une victoire totale.</li>
<li>Le parti du président est en général pénalisé. Vos leviers (publicité, bureaux, enjeux, groupes, équipe) jouent comme en présidentielle, mais comptent pour tous les sièges de l’État. Un siège de Sénat sortant est un peu plus facile à garder.</li>
<li>Les sièges du Sénat sortants sont un peu plus faciles à garder, et la carte du Sénat favorise structurellement les républicains.</li></ul></details>
<details><summary>Conseils</summary><ul>
<li>Concentrez-vous sur 6 à 8 États serrés, pondérés par leurs grands électeurs.</li>
<li>Évitez d’investir dans les États acquis ou perdus de plus de 10 points.</li>
<li>Collectez régulièrement et dépensez tout avant le jour du scrutin.</li>
<li>Payez un sondage interne avant un gros investissement.</li>
<li>Surveillez le Journal : les actions publiques de l’adversaire y apparaissent.</li>
<li>Dans le Journal, « Afficher les calculs » détaille la marge de chaque État.</li></ul></details>
<details><summary>Difficulté</summary><p>En Facile, le climat national vous est favorable. En Difficile, il vous est défavorable et l’adversaire dispose de plus de fonds.</p></details>`+foot;
  if(LANG==='es')return head+HELP_ES+foot;
  return head+`
<details open><summary>Goal and flow</summary><p>You run a fictional 12-week presidential campaign, from August 14 to November 7, 2028. You need at least <b>270 of the 538 electoral votes</b>.</p>
<ul><li>Each week, you spend your <b>3 actions</b> and your money.</li><li>You end the week: your opponent plays, the economy moves, and an event asks you to choose.</li><li>On election night, results come in state by state with some randomness: polls can be wrong.</li></ul></details>
<details><summary>Candidates and primaries</summary><ul>
<li>You choose among <b>3 generated candidates</b>: two strengths and one weakness each (image, funds, cheaper offices, debates, home turf; risky interviews, baggage, low name ID).</li>
<li>The <b>primaries</b> are 4 contests (Super Tuesday counts the most). You get 2 actions per round: rally the base or court the center, ads ($4M), barnstorm, fundraise, attack a rival.</li>
<li>Primary voters have a <b>mood</b>, shown under the polls. Positioning near it helps, but your stance shifts your issue positions once you are nominated.</li>
<li>Attacking weakens a rival but costs image against your general-election opponent. Money left over carries into the general campaign.</li>
<li>If you do not finish first in delegates, your campaign ends.</li></ul></details>
<details><summary>Reading the map and polls</summary><ul>
<li><b>Colors:</b> blue for Democrats, red for Republicans. The darker, the bigger the gap. Hatched: under 1.5 points, a toss-up.</li>
<li><b>Polls:</b> noisy, with a bias shared across the whole country. One event lets you audit that bias.</li>
<li><b>Internal poll ($1M):</b> gives the state’s true margin for the week.</li>
<li><b>Top bar:</b> projection for your side, your opponent and toss-up states. The line marks 270.</li>
<li><b>Gold dot on a tile:</b> you have a campaign office there.</li>
<li>Starting margins come from the 2024 results, recalibrated so that the race is open.</li></ul></details>
<details><summary>Actions in a state</summary><ul>
<li><b>Ads:</b> cost $0.8M plus $0.1M per electoral vote. Up to about +3 points, with diminishing returns. The effect fades 15% each week.</li>
<li><b>Field office:</b> 1 action and money. Up to 3 per state, about +0.6, +1.0 then +1.4 points in total. Lasting effect, but upkeep costs money every week.</li>
<li><b>Visit:</b> 1 action and $0.3M. +1.3 points of buzz, halved each week.</li>
<li>Your opponent has the same levers: what matters is the net gap between you.</li></ul></details>
<details><summary>National actions</summary><ul>
<li><b>Fundraising:</b> 1 action for $4M to $7M, a bit more with a good image.</li>
<li><b>Major interview:</b> most often good for your image, sometimes no effect, rarely a slip.</li>
<li><b>Debate prep:</b> up to 3 levels, used at the week 5 and week 9 debates, then reset to zero.</li>
<li><b>Running mate:</b> chosen at the start, brings a regional bonus, image or funds.</li></ul></details>
<details><summary>Issues and positions</summary><ul>
<li>Ten issues, each with an <b>importance</b> (gold bar) and a <b>position</b> from −2 to +2.</li>
<li>Changing a position or putting an issue on the agenda costs 1 action.</li>
<li>Each state reacts according to its population. Moving toward a state’s voters wins you points there but costs you elsewhere.</li>
<li>Moving away from your party’s line demobilizes your base a little, everywhere.</li>
<li>When an issue gains importance, it favors the side associated with it: health care, abortion and climate lean Democratic; immigration, crime and the economy lean Republican.</li></ul></details>
<details><summary>Voter groups</summary><ul>
<li>Seven groups. Each state has its own makeup, shown in its panel.</li>
<li>Each group has its priorities and prefers a side depending on your positions (Groups tab).</li>
<li><b>Targeting a group:</b> 1 action and $1.5M. The bonus applies in each state according to the group’s local weight, then fades 25% per week. Your opponent does it too.</li></ul></details>
<details><summary>Economy</summary><ul>
<li>National conditions and each state’s economy (sector, unemployment) both matter.</li>
<li>A good economy helps the <b>incumbent party</b>, a bad one helps its challenger. The incumbent party is shown in the Groups tab.</li>
<li>Energy and manufacturing react more strongly than services. Events can hit a sector.</li></ul></details>
<details><summary>Events, image, debates</summary><ul>
<li>Each week, an event asks for a choice, often with a cost or a risk.</li>
<li>Your <b>image</b> against your opponent moves every state a little.</li>
<li>Two debates (weeks 5 and 9) and a last-minute revelation (week 11).</li></ul></details>
<details><summary>Campaign staff</summary><ul>
<li>The <b>Team</b> tab lets you hire 5 staffers: campaign manager, pollster, field director, communications, finance. Each has a level (I to III) and a weekly salary.</li>
<li>Hiring costs one week of salary up front. A higher level costs more: it is up to you to judge whether the effect pays for the salary.</li></ul></details>
<details><summary>Media, storms and early voting</summary><ul>
<li><b>Ad channels:</b> TV works everywhere and lasts longer; digital is 20% cheaper but fades fast and suits young and college-educated voters; local radio costs half as much and suits rural areas, Black and evangelical voters. The multipliers (×) show how well each channel fits the state.</li>
<li><b>Storms:</b> each week may bring a viral story (for or against you). Responding (1 action) limits the damage or amplifies the benefit.</li>
<li><b>Early voting:</b> from week 8, a drive (1 action, $2M) banks a lasting bonus in a state, up to 3 times. It counts more where seniors and college graduates dominate. Your opponent does it too.</li></ul></details>
<details><summary>Independent candidate and districts</summary><ul>
<li>In some games an independent enters around weeks 3 to 5 and takes votes from one side, then fades. If it hurts you, you can court its voters or urge strategic voting.</li>
<li>Maine and Nebraska split their electoral votes: 2 for the statewide winner, 1 per district. The state panel shows the margin in each district.</li></ul></details>
<details><summary>Midterms mode (House and Senate)</summary><ul>
<li>You run your party’s national campaign. There are no candidates, primaries or debates.</li>
<li>Each state elects several <b>House seats</b> (the number is shown on the map); states marked ★ also hold a <b>Senate election</b>. Seats not up for election (34 Democratic, 31 Republican) are already counted.</li>
<li>You need <b>218 House seats</b> to win. Taking the <b>Senate</b> too (51 seats; 50 is enough for the president’s party, the vice-president breaking ties) is a total victory.</li>
<li>The president’s party is usually penalized. Your levers (ads, offices, issues, groups, staff) work as in the presidential game, but count for every seat in the state. An incumbent Senate seat is a little easier to hold.</li>
<li>Incumbent Senate seats are a little easier to hold, and the Senate map structurally favors Republicans.</li></ul></details>
<details><summary>Tips</summary><ul>
<li>Focus on 6 to 8 close states, weighted by electoral votes.</li>
<li>Avoid investing in states that are locked or lost by more than 10 points.</li>
<li>Fundraise regularly and spend everything before election day.</li>
<li>Pay for an internal poll before a big investment.</li>
<li>Watch the Log: your opponent’s public actions appear there.</li>
<li>In the Log, “Show detailed calculations” breaks down each state’s margin.</li></ul></details>
<details><summary>Difficulty</summary><p>On Easy, the national mood favors you. On Hard, it works against you and your opponent has more money.</p></details>`+foot;
}
