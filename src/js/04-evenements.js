/* ---------- Événements ---------- */
const H={
 img(x){G.img+=G.me*x},incHit(x){G.env+=(G.inc==='D'?-x:x)},
 shock(l,v){l.forEach(a=>{const s=ST(a);if(s)s.shock+=v})},
 target(id,v){const i=GROUPS.findIndex(g=>g.id===id);G.tgtP[i]=clamp(G.tgtP[i]+v,-2,2)},
 sal(id,dv){const i=ISSUES.findIndex(q=>q.id===id);G.sal[i]=clamp(G.sal[i]+dv,.1,1.6)},
 buzz(ab,v){const s=ST(ab);if(s)s.buzzP=Math.min(2.4,s.buzzP+v)},
 ap(x){if(G.ap>=x){G.ap-=x;return true}G.apNext-=x-G.ap;G.ap=0;return false},
 pay(x){G.cash=Math.max(0,G.cash-x)},
 best(){let b=0;ISSUES.forEach((q,i)=>{if(G.me*q.own>G.me*ISSUES[b].own)b=i});return ISSUES[b]}
};
const FREE=B('Gratuit','Free'),GAMBLE=B('Pari','Gamble'),IMGP=B('Image +','Image +'),ISSP=B('Enjeu +','Issue +'),M1A=B('−1 action','−1 action'),M1AN=B('−1 action la semaine prochaine','−1 action next week');
const EVENTS=[
{id:'jobs',t:B('Rapport sur l’emploi décevant','Disappointing jobs report'),
 x:()=>t(`Les créations d’emplois sont très en dessous des attentes. L’économie redevient la première préoccupation du pays, et l’administration ${incName()} est sur la défensive.`,`Job creation came in far below expectations. The economy is back as the country’s top concern, and the ${incName()} administration is on the defensive.`),
 pre(){H.sal('eco',.2);G.econ=clamp(G.econ-.7,-3,3)},ch:[
 {t:B('Mettre l’économie au centre','Put the economy front and center'),d:ISSP,fx(){H.sal('eco',.15);return B('L’économie domine les débats. Celui qui sort du lot sur ce terrain en profite.','The economy dominates the debate. Whichever side owns the issue benefits.')}},
 {t:B('Revenir à votre thème fort','Return to your strongest theme'),d:B('Détourner l’attention','Change the subject'),fx(){const b=H.best();H.sal(b.id,.2);return B(`Vous ramenez la conversation sur « ${b.n.fr} ».`,`You steer the conversation back to “${b.n.en}”.`)}}]},
{id:'storm',t:B('Ouragan sur le Golfe','Hurricane on the Gulf Coast'),x:()=>t('Un ouragan majeur touche la côte. Des images de dévastation tournent en boucle.','A major hurricane hits the coast. Images of devastation play on a loop.'),ch:[
 {t:B('Aller sur place','Go to the scene'),d:M1AN,fx(){H.ap(0);G.apNext-=1;H.img(.4);H.buzz('FL',1.4);H.buzz('LA',1);return B('Vos images de réconfort sont bien reçues.','Your comforting images are well received.')}},
 {t:B('Envoyer 2 M$ d’aide et continuer','Send $2M in aid and keep campaigning'),d:B('−2 M$','−$2M'),fx(){H.pay(2);H.img(.15);return B('Un geste apprécié, sans plus.','A gesture that is appreciated, no more.')}},
 {t:B('Poursuivre la campagne','Keep campaigning'),d:B('Risque d’image','Image risk'),fx(){H.img(-.3);return B('On vous reproche de faire de la politique pendant le drame.','You are accused of playing politics during the tragedy.')}}]},
{id:'gaffe',t:B('Micro resté ouvert','Hot mic'),x:()=>t('Une phrase du candidat captée en coulisses devient virale en quelques heures.','A remark the candidate made backstage goes viral within hours.'),ch:[
 {t:B('Présenter des excuses','Apologize'),d:B('Dégâts limités','Limited damage'),fx(){H.img(-.1);return B('L’affaire retombe vite.','The story fades quickly.')}},
 {t:B('Assumer et contre-attaquer','Own it and hit back'),d:GAMBLE,fx(){if(rnd()<.45){H.img(.5);return B('Votre base applaudit, les indépendants aussi.','Your base cheers, and so do independents.')}H.img(-.9);return B('Le pari échoue. Les chaînes d’info en font leur ouverture.','The gamble fails. Cable news leads with it.')}},
 {t:B('Envoyer le colistier au front','Send your running mate out'),d:M1A,fx(){if(G.ap>=1){G.ap--;H.img(-.15)}else H.img(-.35);return B('Le colistier prend la parole, la polémique faiblit.','Your running mate steps up and the controversy cools.')}}]},
{id:'scandal',t:B('Un ancien collaborateur est mis en cause','A former aide is under fire'),x:()=>t('Un article met en cause un ancien conseiller du candidat. La presse réclame une réaction.','An article implicates a former adviser to the candidate. The press demands a response.'),ch:[
 {t:B('Prendre ses distances','Distance yourself'),d:B('Sûr','Safe'),fx(){H.img(-.25);return B('Vous coupez court. Le coût est modéré.','You cut it short. The cost is moderate.')}},
 {t:B('Défendre à tout prix','Defend at all costs'),d:GAMBLE,fx(){if(rnd()<.4){H.img(-1.3);return B('L’affaire enfle et vous colle à la peau.','The story snowballs and sticks to you.')}return B('L’affaire s’éteint d’elle-même.','The story dies down on its own.')}},
 {t:B('Enquête indépendante','Independent inquiry'),d:B('−2 M$','−$2M'),fx(){H.pay(2);H.img(-.1);return B('Vous gagnez en crédibilité pour un coût raisonnable.','You gain credibility at a reasonable cost.')}}]},
{id:'endorse',t:B('Un poids lourd propose son soutien','A heavyweight offers an endorsement'),x:()=>t('Un ancien gouverneur très populaire dans le Midwest propose de vous soutenir publiquement.','A former governor, very popular in the Midwest, offers to endorse you publicly.'),ch:[
 {t:B('Accepter avec un meeting commun','Accept with a joint rally'),d:M1A,fx(){if(G.ap>=1)G.ap--;H.img(.4);['WI','MI','PA','MN'].forEach(a=>H.buzz(a,.8));return B('Le meeting fait la une des journaux régionaux.','The rally makes front pages across the region.')}},
 {t:B('Accepter discrètement','Accept quietly'),d:FREE,fx(){H.img(.15);return B('Un soutien utile.','A useful endorsement.')}},
 {t:B('Décliner','Decline'),d:B('Rester indépendant','Stay independent'),fx(){H.img(.05);return B('Votre base apprécie, l’occasion est passée.','Your base approves, but the opportunity is gone.')}}]},
{id:'donor',t:B('Un méga-donateur se manifeste','A mega-donor steps forward'),x:()=>t('Un super PAC propose 10 M$ de publicité en soutien. Les conditions sont floues.','A super PAC offers $10M in supportive advertising. The terms are vague.'),ch:[
 {t:B('Accepter','Accept'),d:B('+10 M$, image −','+$10M, image −'),fx(){G.cash+=10;H.img(-.35);return B('La presse dénonce l’influence de l’argent, mais vos caisses se remplissent.','The press denounces the influence of money, but your coffers fill up.')}},
 {t:B('Refuser','Refuse'),d:IMGP,fx(){H.img(.2);return B('Beau geste, mais les caisses restent maigres.','A fine gesture, but the coffers stay thin.')}}]},
{id:'crime',t:B('Vague de faits divers','Wave of violent crime stories'),x:()=>t('Une série de faits divers violents nourrit le débat sur la sécurité.','A string of violent crimes feeds the debate on public safety.'),pre(){H.sal('sec',.2)},ch:[
 {t:B('Parler sécurité','Talk public safety'),d:ISSP,fx(){H.sal('sec',.1);return B('La sécurité s’installe dans le débat.','Public safety settles into the debate.')}},
 {t:B('Appeler à l’apaisement','Call for calm'),d:IMGP,fx(){H.img(.2);return B('Votre ton mesuré est remarqué.','Your measured tone is noticed.')}}]},
{id:'court',t:B('Décision de la Cour suprême','Supreme Court ruling'),x:()=>t('Un arrêt sur l’avortement ravive un débat que beaucoup croyaient tranché.','A ruling on abortion reignites a debate many thought settled.'),pre(){H.sal('avo',.25)},ch:[
 {t:B('Réagir vivement','React strongly'),d:ISSP,fx(){H.sal('avo',.1);return B('Vous mobilisez vos partisans.','You rally your supporters.')}},
 {t:B('Rester sobre','Stay measured'),d:IMGP,fx(){H.img(.1);return B('Vous évitez la surenchère.','You avoid escalating.')}}]},
{id:'foreign',t:B('Crise internationale','International crisis'),x:()=>t('Une crise éclate à l’étranger. Le pays se range d’abord derrière l’exécutif.','A crisis erupts abroad. The country first rallies behind the executive.'),pre(){H.sal('com',.25);H.incHit(-.4)},ch:[
 {t:B('Appeler à l’union nationale','Call for national unity'),d:IMGP,fx(){H.img(.2);return B('Votre ton rassembleur est bien accueilli.','Your unifying tone is well received.')}},
 {t:B('Critiquer la gestion','Criticize the handling'),d:B('Selon votre camp','Depends on your side'),fx(){if(G.inc===side()){H.img(-.3);return B('Critiquer votre propre camp surprend.','Criticizing your own side comes as a surprise.')}H.incHit(.5);return B('Votre critique fait mouche.','Your criticism hits home.')}}]},
{id:'poll',t:B('Écart entre sondages et terrain','Polls and ground game disagree'),x:()=>t('Vos responsables locaux sentent un décalage avec les sondages publics.','Your local organizers sense a gap with the public polls.'),ch:[
 {t:B('Commander un audit','Commission an audit'),d:B('−1,5 M$','−$1.5M'),fx(){H.pay(1.5);const v=G.me*G.pbNat+randn()*.4;G.hint=v;return both(()=>t(`Vos analystes estiment que les sondages publics sont décalés de ${fS(v)} point en votre faveur (marge d’erreur ±0,5).`,`Your analysts estimate that public polls are shifted ${fS(v)} points in your favor (margin of error ±0.5).`))}},
 {t:B('Faire confiance aux sondages','Trust the polls'),d:FREE,fx(){return B('Vous gardez le cap.','You stay the course.')}}]},
{id:'deepfake',t:B('Vidéo truquée en circulation','Doctored video in circulation'),x:()=>t('Une vidéo manipulée du candidat circule sur les réseaux.','A manipulated video of the candidate is circulating on social media.'),ch:[
 {t:B('Dénoncer publiquement','Denounce it publicly'),d:FREE,fx(){if(rnd()<.7){H.img(.1);return B('Les médias relaient votre démenti.','The media relay your denial.')}H.img(-.2);return B('Votre démenti donne plus d’écho à la vidéo.','Your denial gives the video more reach.')}},
 {t:B('Riposte juridique','Take legal action'),d:B('−2 M$','−$2M'),fx(){H.pay(2);H.img(.05);return B('La vidéo est retirée rapidement.','The video is quickly taken down.')}},
 {t:B('Ignorer','Ignore it'),d:GAMBLE,fx(){if(rnd()<.5){H.img(-.6);return B('La vidéo s’est largement propagée.','The video spread widely.')}return B('Elle passe inaperçue.','It goes unnoticed.')}}]},
{id:'union',t:B('Grève dans l’automobile','Auto industry strike'),x:()=>t('Un conflit social touche le Michigan et l’Ohio. Chaque camp est attendu sur les piquets.','A labor dispute hits Michigan and Ohio. Both sides are expected on the picket lines.'),ch:[
 {t:B('Rejoindre le piquet de grève','Join the picket line'),d:M1AN,fx(){G.apNext-=1;['MI','OH','PA','WI'].forEach(a=>H.buzz(a,1.2));H.img(.1);return B('Des images fortes dans quatre États clés.','Powerful images in four key states.')}},
 {t:B('Rester à l’écart','Stay out of it'),d:FREE,fx(){return B('Vous évitez le sujet.','You avoid the topic.')}}]},
{id:'plant',t:B('Fermeture d’une grande usine','Major plant closing'),x:()=>t('Un constructeur annonce la fermeture d’un site majeur. Des milliers d’emplois sont menacés dans la Rust Belt.','A manufacturer announces the closing of a major plant. Thousands of jobs are at risk in the Rust Belt.'),
 pre(){H.shock(['MI','OH','PA','WI','IN'],-.7)},ch:[
 {t:B('Aller à la rencontre des salariés','Meet the workers'),d:M1AN,fx(){G.apNext-=1;['MI','OH','PA','WI'].forEach(a=>H.buzz(a,1));H.img(.1);return B('Vos images avec les ouvriers sont reprises par la presse locale.','Your images with the workers are picked up by the local press.')}},
 {t:B('Annoncer un plan industriel','Announce an industrial plan'),d:B('−3 M$','−$3M'),fx(){H.pay(3);if(G.inc===side())H.shock(['MI','OH','PA','WI','IN'],.4);H.target('ouv',.6);return B('Le plan rassure en partie les classes populaires.','The plan partly reassures working-class voters.')}},
 {t:B('Ne pas commenter','Stay silent'),d:FREE,fx(){return B('Vous évitez un terrain miné.','You avoid a minefield.')}}]},
{id:'gas',t:B('Flambée du prix de l’essence','Gas price spike'),x:()=>t('Les prix à la pompe s’envolent. Les États producteurs en profitent, les automobilistes grondent.','Pump prices soar. Producing states benefit while drivers grumble.'),
 pre(){G.econ=clamp(G.econ-.3,-3,3);H.shock(['TX','ND','OK','LA','WV','AK','NM'],.5);H.sal('eco',.1)},ch:[
 {t:B('Défendre la production nationale','Defend domestic production'),d:B('Climat −','Climate −'),fx(){H.sal('cli',-.08);H.target('ouv',.5);return B('Votre message plaît aux automobilistes.','Your message appeals to drivers.')}},
 {t:B('Pousser la transition','Push the energy transition'),d:B('Climat +','Climate +'),fx(){H.sal('cli',.12);H.target('jeu',.6);return B('Les jeunes électeurs retiennent votre discours.','Young voters take note of your message.')}}]},
{id:'latino',t:B('Le vote latino se fragmente','The Latino vote fragments'),x:()=>t('Une étude montre un électorat latino plus volatil que prévu, surtout en Arizona, au Nevada, en Floride et au Texas.','A study shows a more volatile Latino electorate than expected, especially in Arizona, Nevada, Florida and Texas.'),ch:[
 {t:B('Lancer une campagne en espagnol','Launch a Spanish-language campaign'),d:B('−2 M$','−$2M'),fx(){H.pay(2);H.target('lat',1.2);return B('Vos spots en espagnol passent bien.','Your Spanish-language ads land well.')}},
 {t:B('Parler pouvoir d’achat','Talk cost of living'),d:FREE,fx(){H.target('lat',.5);H.sal('eco',.08);return B('Le message sur le budget des ménages fait écho.','The message on household budgets resonates.')}}]},
{id:'seniors',t:B('Débat sur la Sécurité sociale','Social Security debate'),x:()=>t('Un rapport alerte sur l’équilibre des retraites. Les seniors scrutent chaque mot.','A report warns about the balance of pensions. Seniors scrutinize every word.'),pre(){H.sal('san',.12)},ch:[
 {t:B('Promettre de ne rien toucher','Promise to leave it untouched'),d:B('Seniors +','Seniors +'),fx(){H.target('sen',1);return B('Les seniors apprécient la garantie.','Seniors appreciate the guarantee.')}},
 {t:B('Parler de réforme','Talk reform'),d:B('Risqué','Risky'),fx(){if(rnd()<.5){H.img(.3);return B('Votre sérieux est salué.','Your seriousness is praised.')}H.target('sen',-.8);return B('Les seniors s’inquiètent.','Seniors grow worried.')}}]},
{id:'campus',t:B('Mobilisation étudiante','Student mobilization'),x:()=>t('Des campus se mobilisent pour le climat et le coût des études. Les jeunes pèsent surtout dans les États universitaires.','Campuses mobilize over climate and the cost of college. Young voters matter most in university states.'),ch:[
 {t:B('Organiser un rassemblement','Hold a rally'),d:B('−1 M$','−$1M'),fx(){H.pay(1);H.target('jeu',1);return B('Beaucoup de jeunes répondent à l’appel.','Many young people answer the call.')}},
 {t:B('Rester en retrait','Stay on the sidelines'),d:FREE,fx(){return B('Le sujet passe sans vous.','The topic passes you by.')}}]},
{id:'third',t:B('Un candidat indépendant se lance','An independent candidate enters the race'),
 x:()=>{const T=G.third,hurt=T.side===side();return t(`${T.name} annonce sa candidature et attire surtout des électeurs ${T.side==='D'?'démocrates':'républicains'}. ${hurt?'C’est un danger pour vous : chaque point lui sera pris sur votre électorat.':'Cela vous arrange : il ou elle affaiblit votre adversaire.'}`,`${T.name} announces an independent run and draws mostly ${T.side==='D'?'Democratic':'Republican'} voters. ${hurt?'This is a danger to you: every point comes out of your electorate.':'This suits you: it weakens your opponent.'}`)},
 pre(){const T=G.third;T.on=true;T.pow=1.4+rnd()*.9},
 get ch(){const T=G.third,hurt=T.side===side();return hurt?[
  {t:B('Courtiser ses électeurs','Court its voters'),d:M1A,fx(){if(G.ap>=1){G.ap--;T.pow*=.6;return B('Vous récupérez une partie de ces électeurs.','You win back part of those voters.')}T.pow*=.85;return B('Faute de temps, l’effet est limité.','With little time, the effect is limited.')}},
  {t:B('Appeler au vote utile','Urge strategic voting'),d:B('Gratuit','Free'),fx(){T.pow*=.85;H.img(-.05);return B('Le message passe, avec un léger coût d’image.','The message lands, at a small cost in image.')}},
  {t:B('Ignorer','Ignore it'),d:FREE,fx(){return B('Vous laissez la candidature suivre son cours.','You let the run take its course.')}}]:[
  {t:B('Amplifier discrètement','Quietly amplify it'),d:B('−1,5 M$','−$1.5M'),fx(){H.pay(1.5);T.pow*=1.3;return B('La candidature gagne en visibilité.','The run gains visibility.')}},
  {t:B('Ne rien faire','Do nothing'),d:FREE,fx(){return B('Vous laissez faire.','You stay out of it.')}}]}},
{id:'school',t:B('Polémique sur l’école','School curriculum fight'),x:()=>t('Une bataille sur les programmes scolaires et le coût des études enflamme les réunions de parents.','A fight over school curricula and the cost of college inflames parent meetings.'),pre(){H.sal('edu',.25)},ch:[
 {t:B('Prendre position publiquement','Take a public stand'),d:ISSP,fx(){H.sal('edu',.1);H.target('jeu',.4);return B('Le débat vous est favorable chez les jeunes familles.','The debate works in your favor with young families.')}},
 {t:B('Laisser chaque État décider','Leave it to the states'),d:IMGP,fx(){H.img(.15);return B('Vous évitez le piège de la guerre culturelle.','You avoid the culture-war trap.')}}]},
{id:'aiwave',t:B('Licenciements attribués à l’IA','AI-linked layoffs'),x:()=>t('Plusieurs grands employeurs annoncent des suppressions de postes attribuées à l’automatisation.','Several large employers announce job cuts blamed on automation.'),pre(){H.sal('ai',.3);H.sal('eco',.1)},ch:[
 {t:B('Proposer un encadrement strict','Propose strict rules'),d:B('Classes populaires +','Working class +'),fx(){H.sal('ai',.1);H.target('ouv',.6);return B('Vos propositions rassurent les salariés exposés.','Your proposals reassure exposed workers.')}},
 {t:B('Défendre l’innovation','Defend innovation'),d:B('Diplômés +','Graduates +'),fx(){H.target('dip',.5);H.img(.05);return B('Le monde de la tech salue votre ligne.','The tech world welcomes your line.')}}]},
{id:'naval',t:B('Incident naval dans le Pacifique','Naval incident in the Pacific'),x:()=>t('Un affrontement en mer ravive le débat sur la défense. Le pays se range d’abord derrière l’exécutif.','A clash at sea revives the defense debate. The country first rallies behind the executive.'),pre(){H.sal('def',.3);H.incHit(-.3)},ch:[
 {t:B('Afficher la fermeté','Project strength'),d:B('Seniors +','Seniors +'),fx(){H.target('sen',.5);H.sal('def',.05);return B('Les électeurs âgés approuvent votre fermeté.','Older voters approve your firmness.')}},
 {t:B('Appeler à la retenue','Call for restraint'),d:B('Jeunes +','Young voters +'),fx(){H.target('jeu',.5);return B('Votre prudence est bien reçue chez les jeunes.','Your caution goes down well with young voters.')}}]},
{id:'debate',t:B('Débat présidentiel','Presidential debate'),x:()=>'',ch:[
 {t:B('Offensif','Aggressive'),d:B('Attaque','Attack'),fx(){debAuto(0);return G.ev.res}},
 {t:B('Pédagogue','Explainer'),d:B('Plan','Plan'),fx(){debAuto(1);return G.ev.res}},
 {t:B('Prudent','Cautious'),d:B('Prudent','Cautious'),fx(){debAuto(2);return G.ev.res}}]},
{id:'surprise',t:B('Révélation de dernière minute','Last-minute revelation'),
 x:()=>G.ev.hit==='you'?t('Une enquête de presse met votre campagne en difficulté à dix jours du vote.','A press investigation puts your campaign in trouble ten days before the vote.'):t('Une enquête de presse met l’adversaire en difficulté à dix jours du vote.','A press investigation puts your opponent in trouble ten days before the vote.'),
 pre(){G.ev.hit=rnd()<.5+(wkP()==='scandal'?.15:0)-(wkO()==='scandal'?.15:0)?'you':'opp';H.img(G.ev.hit==='you'?-.9:.9)},ch:[
 {t:B('Contre-attaque médiatique','Media counterattack'),d:B('−3 M$','−$3M'),fx(){H.pay(3);if(G.ev.hit==='you'){H.img(.5);return B('Vous limitez les dégâts.','You limit the damage.')}H.img(.2);return B('Vous enfoncez le clou.','You drive the point home.')}},
 {t:B('Laisser passer','Let it pass'),d:FREE,fx(){return B('La campagne se poursuit.','The campaign goes on.')}}]}
];
function nextEvent(){
  let id;
  if(G.mode!=='mid'&&(G.wk===5||G.wk===9))id='debate';else if(G.wk===11)id='surprise';
  else if(G.third&&!G.third.on&&G.wk>=G.third.wk)id='third';
  else{if(!G.deck||!G.deck.length)G.deck=mkDeck();id=G.deck.shift();G.used.push(id)}
  G.ev={id,res:null};G.phase='event';
  EVENTS.find(e=>e.id===id).pre?.();
}
