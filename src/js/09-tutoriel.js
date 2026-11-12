/* ---------- Tutoriel et manuel ---------- */
const TUTO_BASE=[
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
const tutoKey=()=>G&&G.mode==='mid'?'cap270.tuto.mid':'cap270.tuto';
const tutoSeen=()=>{try{return localStorage.getItem(tutoKey())==='1'}catch(e){return false}};
const tutoMark=()=>{try{localStorage.setItem(tutoKey(),'1')}catch(e){}};
const tuAct=()=>!!UI.tuBase&&(G.ap<UI.tuBase.ap||G.spentP>UI.tuBase.sp+1e-9);
// Steps: the first ones wait for you to actually do something (need), the last one ends when you end the week.
function tutoSteps(){
  const b=TUTO_BASE,mid=G&&G.mode==='mid',S=[];
  S.push(mid?{tab:'map',hl:'#hudTop .evbar',t:B('Votre mission','Your mission','Tu misión'),x:B('Contrôlez la Chambre (218 sièges) et, si possible, le Sénat. Cette barre projette le résultat d’après les sondages : votre couleur à gauche, l’adversaire à droite.','Control the House (218 seats) and the Senate too if you can. This bar projects the result from the polls: your color on the left, your opponent on the right.','Controla la Cámara (218 escaños) y, si puedes, el Senado. Esta barra proyecta el resultado según las encuestas: tu color a la izquierda, el rival a la derecha.')}:b[0]);
  S.push(Object.assign({},b[1],{sel:'',need:()=>!!UI.sel,do:B('Touchez un État sur la carte.','Tap a state on the map.','Toca un estado en el mapa.')}));
  S.push(Object.assign({},b[2],{sel:()=>UI.sel||'PA',need:tuAct,do:B('Faites une action : publicité, bureau de terrain, visite ou sondage.','Take one action: an ad, a field office, a visit or a poll.','Haz una acción: un anuncio, una oficina de campo, una visita o una encuesta.')}));
  S.push(b[3],b[4],b[5],b[6],b[7]);
  S.push({tab:'actions',hl:'#pMedia',t:B('Médias et donateurs','Media and donors','Medios y donantes'),x:B('Chaque semaine peuvent arriver des invitations médias (allez-y ou envoyez un porte-parole) et des offres de donateurs : de l’argent, mais avec des contreparties et un risque de scandale.','Every week media invitations may show up (go yourself or send a surrogate) along with donor offers: money, but with strings attached and a risk of scandal.','Cada semana pueden llegar invitaciones de medios (ve tú o envía a un sustituto) y ofertas de donantes: dinero, pero con contrapartidas y riesgo de escándalo.')});
  if(!mid)S.push({tab:'actions',hl:'#pRival',t:B('Votre adversaire','Your opponent','Tu rival'),x:B('Il a un style de jeu propre : attaquant, prudent, centriste, populiste, bien financé ou numérique. Lisez son profil et adaptez votre campagne.','It has its own playing style: attack dog, cautious, centrist, populist, well-funded or digital. Read its profile and adapt your campaign.','Tiene su propio estilo de juego: atacante, prudente, centrista, populista, bien financiado o digital. Lee su perfil y adapta tu campaña.')});
  S.push(Object.assign({},b[8],{last:true,hl:'#endBtn',do:B('Touchez « Fin de semaine » pour lancer votre première semaine.','Tap “End week” to run your first week.','Toca «Fin de semana» para jugar tu primera semana.')}));
  return S;
}
function tutoGo(i){
  const S=tutoSteps(),st=S[i];UI.tuto=i;UI.tab=st.tab;if('sel' in st)UI.sel=typeof st.sel==='function'?st.sel():st.sel;
  UI.tuBase={ap:G.ap,sp:G.spentP};
  render();const e=st.hl&&document.querySelector(st.hl);if(e)e.scrollIntoView({block:'center',behavior:'smooth'});
}
function renderCoach(){
  const c=$('#coach');document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));
  const on=!SIM&&G&&UI.tuto!=null&&G.phase==='play';
  c.hidden=!on;document.body.classList.toggle('tuto',!!on);if(!on)return;
  const S=tutoSteps(),st=S[UI.tuto],last=!!st.last,blocked=st.need?!st.need():false;
  c.innerHTML=`<div class="cn">${t('Tutoriel · étape','Tutorial · step','Tutorial · paso')} ${UI.tuto+1}/${S.length}</div><h3>${t(st.t)}</h3><p>${t(st.x)}</p>${st.do?`<p class="todo${blocked||last?'':' done'}">${blocked||last?'👉':'✔'} ${t(st.do)}</p>`:''}<div class="cb">${last?'':`<button class="btn sm alt" data-act="tutoSkip">${t('Passer','Skip','Saltar')}</button>`}${last?`<button class="btn sm alt" data-act="tutoSkip">${t('Fermer','Close','Cerrar')}</button>`:`<button class="btn sm" data-act="tutoNext" ${blocked?'disabled':''}>${t('Suivant','Next','Siguiente')}</button>`}</div>`;
  const e=document.querySelector(st.hl);if(e)e.classList.add('hl');
}
function langSw(){return`<div class="langsw" role="group" aria-label="Language"><button data-act="lang" data-l="en" aria-pressed="${LANG==='en'}">English</button><button data-act="lang" data-l="fr" aria-pressed="${LANG==='fr'}">Français</button><button data-act="lang" data-l="es" aria-pressed="${LANG==='es'}">Español</button></div>`}
function helpHTML(canReplay){
  const replay=canReplay?`<button class="btn alt" data-act="tutoRestart">${t('Rejouer le tutoriel','Replay the tutorial')}</button>`:`<button class="btn alt" data-act="tutoReset">${t('Relancer le tutoriel à la prochaine partie','Show the tutorial again in the next game','Mostrar el tutorial en la próxima partida')}</button>`;
  const head=`<div class="man"><div class="mhead"><h2>${t('Manuel','Manual')}</h2><button class="btn sm alt" data-act="closeHelp">${t('Fermer','Close')}</button></div>${langSw()}<div style="margin-bottom:8px"><button class="btn sm alt" data-act="settings">⚙ ${t('Réglages','Settings')}</button></div>`;
  const foot=`<div class="irow" style="margin-top:12px">${replay}<button class="btn" data-act="closeHelp">${t('Fermer','Close')}</button></div></div>`;
  if(FR())return head+`
<details open><summary>But et déroulé</summary><p>Vous menez une campagne présidentielle fictive de 12 semaines, du 14 août au 7 novembre 2028. Il faut au moins <b>270 des 538 grands électeurs</b>.</p>
<ul><li>Chaque semaine, vous dépensez vos <b>3 actions</b> et votre argent.</li><li>Vous terminez la semaine : l’adversaire joue, l’économie évolue, un événement vous demande de choisir.</li><li>Le soir du scrutin, les résultats tombent État par État avec une part de hasard : les sondages peuvent se tromper.</li></ul></details>
<details><summary>Candidats et primaires</summary><ul>
<li>Vous choisissez parmi <b>3 candidats générés</b> (« Tirer trois autres candidats » si aucun ne vous plaît ; case « Passer les primaires » pour aller directement à la présidentielle) : deux atouts et une faiblesse chacun (image, fonds, bureaux moins chers, débats, ancrage local ; interviews risquées, passé encombrant, faible notoriété).</li>
<li>Les <b>primaires</b> comptent 4 scrutins (le Super Tuesday pèse le plus). Vous avez 2 actions par tour : mobiliser la base ou viser le centre, publicité (4 M$), tournée, collecte, attaque d’un rival.</li>
<li>Les électeurs de primaire ont une <b>humeur</b> indiquée sous les sondages. Se placer près d’elle aide, mais votre positionnement déplace vos positions sur les enjeux à l’investiture.</li>
<li>Attaquer affaiblit un rival mais coûte de l’image face à l’adversaire. L’argent restant passe en campagne générale.</li>
<li>Si vous ne finissez pas premier aux délégués, la campagne s’arrête.</li></ul></details>
<details><summary>Lire la carte et les sondages</summary><ul>
<li>Les erreurs de sondage sont <b>corrélées par région</b> : si le Midwest est surestimé pour un camp, tous ses États le sont. La <b>participation</b> du jour J favorise les jeunes et les minorités (forte) ou les seniors et les diplômés (faible).</li>
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
<li>Deux débats (semaines 5 et 9) joués question par question : trois questions sur les enjeux du moment, puis une conclusion. Chaque réponse (attaquer, détailler, raconter, recentrer) a son risque ; détailler paie sur vos enjeux forts, recentrer sauve un enjeu faible. et une révélation de dernière minute (semaine 11).</li></ul></details>
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
<details><summary>Après le scrutin</summary><p>Si un État décisif se joue à moins d’un demi-point : recomptage (vous pouvez le demander ou vous défendre, plus ou moins d’argent), puis, si l’écart reste infime, recours devant la Cour suprême (6 juges conservateurs contre 3, ce qui avantage le camp républicain). Si la majorité tient à quelques grands électeurs, des électeurs infidèles peuvent inverser le résultat. Ces choix coûtent de l’argent (et donc le succès « Cagnotte intacte »).</p></details>
<details><summary>Confort</summary><ul><li><b>↶ Annuler</b> : le bouton à côté du ? annule jusqu’à 5 actions de la semaine en cours (pas après « Fin de semaine »).</li><li><b>Simulation accélérée</b> (onglet Actions) : passe 1, 3 semaines ou jusqu’à l’élection sans agir ; les événements sont réglés au plus prudent.</li><li><b>Sons, musique, animations</b> : synthétisés, réglables ou désactivables dans les réglages.</li></ul></details>
<details><summary>Scénarios historiques</summary><p>Rejouez 2016, 2020 ou 2024 : la carte reprend les marges réelles de chaque État, avec l’économie, les enjeux dominants et le candidat indépendant propres à l’année. Pas de primaires ; les candidats restent fictifs. Gagner avec le camp qui a perdu en réalité débloque un succès.</p></details>
<details><summary>Difficulté</summary><p>En Facile, le climat national vous est favorable. En Difficile, il vous est défavorable, l’adversaire dispose de plus de fonds, les sondages sont plus bruités, les scandales coûtent plus cher et vous n’avez que trois annulations par partie. En Facile, les sondages sont plus fiables et le jeu vous signale les États à portée (qui clignotent sur la carte) avec des conseils (désactivables dans les réglages).</p></details>`+foot;
  if(LANG==='es')return head+HELP_ES+foot;
  return head+`
<details open><summary>Goal and flow</summary><p>You run a fictional 12-week presidential campaign, from August 14 to November 7, 2028. You need at least <b>270 of the 538 electoral votes</b>.</p>
<ul><li>Each week, you spend your <b>3 actions</b> and your money.</li><li>You end the week: your opponent plays, the economy moves, and an event asks you to choose.</li><li>On election night, results come in state by state with some randomness: polls can be wrong.</li></ul></details>
<details><summary>Candidates and primaries</summary><ul>
<li>You choose among <b>3 generated candidates</b> (“Draw three other candidates” if none appeal; tick “Skip the primaries” to go straight to the general election): two strengths and one weakness each (image, funds, cheaper offices, debates, home turf; risky interviews, baggage, low name ID).</li>
<li>The <b>primaries</b> are 4 contests (Super Tuesday counts the most). You get 2 actions per round: rally the base or court the center, ads ($4M), barnstorm, fundraise, attack a rival.</li>
<li>Primary voters have a <b>mood</b>, shown under the polls. Positioning near it helps, but your stance shifts your issue positions once you are nominated.</li>
<li>Attacking weakens a rival but costs image against your general-election opponent. Money left over carries into the general campaign.</li>
<li>If you do not finish first in delegates, your campaign ends.</li></ul></details>
<details><summary>Reading the map and polls</summary><ul>
<li>Poll errors are <b>correlated by region</b>: if the Midwest is overstated for one side, all its states are. Election-day <b>turnout</b> favors young and minority voters (high) or seniors and graduates (low).</li>
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
<li>Two debates (weeks 5 and 9), played question by question: three questions on the hot issues, then a closing statement. Each answer (attack, lay out a plan, tell a story, pivot) has its own risk; a plan pays off on your strong issues, a pivot rescues a weak one. and a last-minute revelation (week 11).</li></ul></details>
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
<details><summary>After election night</summary><p>If a decisive state is within half a point: a recount (you can request one or defend, spending more or less money), then, if the margin stays razor-thin, an appeal to the Supreme Court (6 conservative justices to 3, which favors the Republican side). If the majority rests on a few electoral votes, faithless electors can reverse the result. These choices cost money (and so the “Spare change” achievement).</p></details>
<details><summary>Comfort</summary><ul><li><b>↶ Undo</b>: the button next to ? undoes up to 5 actions of the current week (not after “End week”).</li><li><b>Fast-forward</b> (Actions tab): skip 1 week, 3 weeks or straight to election day without acting; events are settled the safest way.</li><li><b>Sound, music, animations</b>: synthesized, adjustable or switched off in Settings.</li></ul></details>
<details><summary>Historical scenarios</summary><p>Replay 2016, 2020 or 2024: the map uses each state’s real margins, with the year’s economy, dominant issues and independent candidate. No primaries; candidates remain fictional. Winning with the side that actually lost unlocks an achievement.</p></details>
<details><summary>Difficulty</summary><p>On Easy, the national mood favors you. On Hard, it works against you, your opponent has more money, polls are noisier, scandals cost more and you only get three undos per game. On Easy, polls are more reliable and the game flags states within reach (blinking on the map) with tips (can be turned off in settings).</p></details>`+foot;
}
/* Astuces ponctuelles (une seule fois) */
const TIPS={
 cand:{t:B('Choisir votre candidat','Pick your candidate','Elige a tu candidato'),x:B('Chaque candidat a un parcours, des atouts et une faiblesse qui jouent sur la campagne (argent, image, État d’origine…). Aucun ne vous plaît ? « Tirer trois autres candidats ». Pas envie des primaires ? Cochez « Passer les primaires ».','Each candidate has a background, strengths and a weakness that shape the campaign (money, image, home state…). None appeal? “Draw three other candidates”. Not into primaries? Tick “Skip the primaries”.','Cada candidato tiene una trayectoria, virtudes y una debilidad que influyen en la campaña (dinero, imagen, estado natal…). ¿Ninguno te convence? «Sortear otros tres candidatos». ¿Sin ganas de primarias? Marca «Omitir las primarias».')},
 term:{t:B('Gouverner','Governing','Gobernar'),x:B('Vous avez 2 actions par trimestre et du capital politique (◆) qui se reconstitue. Proposez des lois : leurs chances dépendent de votre majorité à la Chambre et au Sénat (60 voix contre le filibuster, sauf textes budgétaires), de votre popularité et du soutien public. Le décret est sûr mais fragile. Votre bilan pèsera sur les midterms, puis sur la réélection.','You get 2 actions per quarter plus political capital (◆) that rebuilds over time. Propose bills: their odds depend on your House and Senate majorities (60 votes to beat the filibuster, except budget bills), your approval and public support. Executive orders are sure but fragile. Your record will weigh on the midterms, then on re-election.','Tienes 2 acciones por trimestre y capital político (◆) que se recupera. Propón leyes: sus probabilidades dependen de tu mayoría en la Cámara y el Senado (60 votos contra el filibusterismo, salvo textos presupuestarios), de tu aprobación y del apoyo público. El decreto es seguro pero frágil. Tu balance pesará en las intermedias y luego en la reelección.')},
 prim:{t:B('Les primaires','The primaries','Las primarias'),x:B('Quatre scrutins, deux actions chacun. Aller vers la base plaît aux électeurs de primaire ; aller vers le centre aide en novembre mais déplace vos positions. Publicité, tournée et collecte de fonds vous aident ; attaquer un rival affaiblit son image. Il faut finir en tête pour être investi.','Four contests, two actions each. Moving to the base pleases primary voters; moving to the center helps in November but shifts your positions. Ads, touring and fundraising help; attacking a rival weakens its image. You must finish first to win the nomination.','Cuatro votaciones, dos acciones cada una. Ir a la base gusta a los votantes de primarias; ir al centro ayuda en noviembre pero cambia tus posturas. Anuncios, giras y recaudación ayudan; atacar a un rival debilita su imagen. Hay que terminar primero para ser nominado.')}
};
function firstTip(id){
  if(SIM||!TIPS[id])return;
  let seen=[];try{seen=JSON.parse(localStorage.getItem('cap270.tips')||'[]')}catch(e){}
  if(seen.includes(id))return;
  try{seen.push(id);localStorage.setItem('cap270.tips',JSON.stringify(seen))}catch(e){}
  showModal(`<h2>${t(TIPS[id].t)}</h2><p>${t(TIPS[id].x)}</p><div class="irow"><button class="btn" data-act="closeHelp">${t('Compris','Got it','Entendido')}</button></div>`,'tip');
}
