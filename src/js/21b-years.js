/* ---------- Événements propres à chaque année (scénarios historiques) ---------- */
// Faits génériques inspirés de chaque campagne ; aucun nom réel. Ils sont glissés dans le paquet d’événements des scénarios concernés.
const YEV={'2008':['y08bank','y08vp'],'2012':['y12clip','y12storm'],'2016':['y16probe','y16tape'],'2020':['y20wave','y20mail'],'2024':['y24age','y24fake'],'m2010':['y10tax'],'m2018':['y18youth'],'m2022':['y22leak']};
const yk=()=>G.scn||(G.mscn?'m'+G.mscn:'');
EVENTS.push(
{id:'y08bank',req:()=>yk()==='2008',t:B('Une grande banque s’effondre','A major bank collapses','Se hunde un gran banco'),
 x:()=>t('Une banque d’investissement historique fait faillite et les marchés plongent. Le pays attend de savoir qui a la solution.','A historic investment bank goes under and markets plunge. The country wants to know who has the answer.','Un banco de inversión histórico quiebra y los mercados se hunden. El país quiere saber quién tiene la solución.'),
 pre(){G.econ=clamp(G.econ-.7,-3,3);H.sal('eco',.25)},ch:[
 C_(B('Soutenir un plan de sauvetage','Back a bailout plan','Apoyar un plan de rescate'),B('Risque d’image','Image risk','Riesgo de imagen'),()=>{H.img(IN_()?-.2:.15);return B('Un geste responsable, mais impopulaire dans les deux camps.','A responsible move, but unpopular in both camps.','Un gesto responsable, pero impopular en ambos bandos.')}),
 C_(B('Dénoncer Wall Street','Blast Wall Street','Denunciar a Wall Street'),ISSP,()=>{H.target('ouv',.5);H.sal('eco',.1);H.img(.05);return B('Les classes populaires applaudissent.','Working-class voters cheer.','Las clases populares aplauden.')}),
 C_(B('Suspendre la campagne','Suspend the campaign','Suspender la campaña'),M1AN,()=>{G.apNext-=1;if(rnd()<.5){H.img(.3);return B('Le geste est salué comme un acte de responsabilité.','The gesture is hailed as statesmanlike.','El gesto se elogia como un acto de responsabilidad.')}H.img(-.2);return B('On vous accuse de calcul politique.','You are accused of political theater.','Te acusan de teatro político.')})]},
{id:'y08vp',req:()=>yk()==='2008',t:B('Un colistier surprise','A surprise running mate','Una fórmula sorpresa'),
 x:()=>t('Le camp adverse annonce un colistier inattendu, très médiatique, qui électrise sa base en une soirée.','The other side names a surprise running mate who electrifies its base overnight.','El bando rival anuncia una fórmula inesperada que electriza a su base de la noche a la mañana.'),
 pre(){H.oppImg(.15)},ch:[
 C_(B('Attaquer son manque d’expérience','Attack their lack of experience','Atacar su falta de experiencia'),B('−1 M$','−$1M','−1 M$'),()=>{H.pay(1);H.oppImg(.2);return B('La ligne d’attaque prend.','The attack line sticks.','La línea de ataque cuaja.')}),
 C_(B('Ignorer et rester sur le fond','Ignore it and stay on message','Ignorarlo y seguir con el mensaje'),FREE,()=>{H.img(.05);return B('Vous gardez le cap.','You stay on course.','Mantienes el rumbo.')}),
 C_(B('Ironiser en meeting','Mock them at rallies','Burlarte en los mítines'),GAMBLE,()=>{if(rnd()<.45){H.oppImg(.3);return B('Le trait fait rire la salle.','The jab lands with the crowd.','El dardo hace reír a la sala.')}H.img(-.25);return B('Vous passez pour condescendant.','You come across as condescending.','Pareces condescendiente.')})]},
{id:'y12clip',req:()=>yk()==='2012',t:B('Une vidéo en coulisses','A behind-the-scenes video','Un vídeo entre bastidores'),
 x:()=>t('Une vidéo tournée en privé montre l’adversaire évoquer près de la moitié des électeurs avec mépris.','A privately shot video shows your opponent speaking with contempt about nearly half the electorate.','Un vídeo grabado en privado muestra al rival hablando con desprecio de casi la mitad del electorado.'),
 pre(){H.oppImg(.15)},ch:[
 C_(B('Diffuser un spot dessus','Cut an ad around it','Hacer un anuncio con ello'),B('−1,5 M$','−$1.5M','−1,5 M$'),()=>{H.pay(1.5);H.oppImg(.3);H.target('ouv',.3);return B('Le spot tourne en boucle.','The ad runs on repeat.','El anuncio se emite sin parar.')}),
 C_(B('Rester mesuré','Stay measured','Mantener la mesura'),FREE,()=>{H.img(.1);return B('Vous apparaissez au-dessus de la mêlée.','You look above the fray.','Pareces estar por encima de la refriega.')}),
 C_(B('Ne rien dire','Say nothing','No decir nada'),FREE,()=>B('L’affaire s’essouffle d’elle-même.','The story fizzles on its own.','El asunto se apaga solo.'))]},
{id:'y12storm',req:()=>yk()==='2012',t:B('Tempête exceptionnelle sur la côte Est','Superstorm on the East Coast','Supertormenta en la costa Este'),
 x:()=>t('Une tempête hors norme frappe la côte Est à quelques semaines du vote. Les images de dévastation dominent l’actualité.','An exceptional storm hits the East Coast weeks before the vote. Images of devastation dominate the news.','Una tormenta excepcional golpea la costa Este a pocas semanas de la votación. Las imágenes de devastación dominan las noticias.'),
 ch:[
 C_(B('Gérer la crise','Manage the crisis','Gestionar la crisis'),M1AN,()=>{G.apNext-=1;H.img(IN_()?.45:.2);['NJ','NY','CT'].forEach(a=>H.buzz(a,1));return B(IN_()?'Votre gestion de crise est applaudie.':'Votre sobriété est remarquée.','Your handling of the crisis is praised.','Tu gestión de la crisis es elogiada.')}),
 C_(B('Suspendre la campagne','Pause the campaign','Pausar la campaña'),FREE,()=>{H.img(.1);return B('Un geste de respect.','A gesture of respect.','Un gesto de respeto.')}),
 C_(B('Continuer comme prévu','Carry on as planned','Seguir según lo previsto'),B('Risque d’image','Image risk','Riesgo de imagen'),()=>{H.img(-.3);return B('On vous reproche de faire de la politique.','You are accused of playing politics.','Te acusan de hacer política.')})]},
{id:'y16probe',req:()=>yk()==='2016',t:B('Une enquête relancée à dix jours du vote','A probe reopened ten days from the vote','Una investigación reabierta a diez días del voto'),
 x:()=>t('Un haut responsable fédéral annonce rouvrir une enquête sur le candidat d’un des deux camps. Le sujet occupe tout l’espace médiatique.','A senior federal official says a probe touching one camp’s candidate is being reopened. It swallows the news cycle.','Un alto cargo federal anuncia que reabre una investigación sobre el candidato de uno de los bandos. Ocupa todo el espacio mediático.'),
 pre(){G.env+=(G.inc==='D'?-.2:.2)},ch:[
 C_(B('Exiger la transparence','Demand transparency','Exigir transparencia'),GAMBLE,()=>{if(rnd()<.5){H.img(.2);return B('Vous apparaissez sûr(e) de vous.','You come across as confident.','Pareces seguro/a de ti.')}H.img(-.2);return B('Cela entretient l’affaire.','It keeps the story alive.','Eso mantiene vivo el asunto.')}),
 C_(B('Changer de sujet','Change the subject','Cambiar de tema'),ISSP,()=>{const b=H.best();H.sal(b.id,.2);return B('Vous recentrez le débat.','You refocus the debate.','Reorientas el debate.')}),
 C_(B('Attaquer l’institution','Attack the institution','Atacar a la institución'),B('Image −','Image −','Imagen −'),()=>{H.img(-.15);H.target('evg',.3);return B('Votre base applaudit, les indécis grimacent.','Your base cheers, undecideds wince.','Tu base aplaude, los indecisos se inquietan.')})]},
{id:'y16tape',req:()=>yk()==='2016',t:B('Un enregistrement embarrassant ressurgit','An embarrassing recording resurfaces','Reaparece una grabación embarazosa'),
 x:()=>t('Un vieux enregistrement refait surface : des propos grossiers tenus en coulisses sont diffusés partout.','An old recording resurfaces: crude remarks made in private are broadcast everywhere.','Reaparece una vieja grabación: comentarios groseros hechos en privado se difunden por todas partes.'),
 pre(){H.oppImg(.1)},ch:[
 C_(B('Se démarquer fermement','Distance yourself firmly','Distanciarte con firmeza'),FREE,()=>{H.img(.1);H.target('dip',.3);return B('Les diplômés apprécient votre ton.','College graduates appreciate your tone.','Los titulados valoran tu tono.')}),
 C_(B('Éviter le sujet','Avoid the subject','Evitar el tema'),FREE,()=>B('Vous laissez l’affaire se tasser.','You let the story settle.','Dejas que el asunto se enfríe.')),
 C_(B('Lancer une riposte sur les médias','Counter-attack on the media','Contraatacar a los medios'),GAMBLE,()=>{if(rnd()<.4){H.target('evg',.4);H.target('ouv',.2);return B('Le message passe auprès de votre base.','The message lands with your base.','El mensaje llega a tu base.')}H.img(-.2);return B('Cela sonne comme une diversion.','It sounds like a diversion.','Suena a maniobra de distracción.')})]},
{id:'y20wave',req:()=>yk()==='2020',t:B('Nouvelle vague épidémique','New wave of the epidemic','Nueva ola de la epidemia'),
 x:()=>t('Les hospitalisations repartent à la hausse. La santé et la réouverture des écoles divisent le pays.','Hospitalizations climb again. Health and school reopening divide the country.','Las hospitalizaciones vuelven a subir. La sanidad y la reapertura de las escuelas dividen al país.'),
 pre(){G.econ=clamp(G.econ-.4,-3,3);H.sal('san',.2)},ch:[
 C_(B('Plaider pour des mesures strictes','Argue for strict measures','Defender medidas estrictas'),ISSP,()=>{H.sal('san',.1);H.target('sen',.5);H.target('dip',.3);return B('Seniors et diplômés vous écoutent.','Seniors and graduates listen.','Los mayores y titulados te escuchan.')}),
 C_(B('Défendre la réouverture','Defend reopening','Defender la reapertura'),ISSP,()=>{H.target('ouv',.5);H.target('evg',.3);H.sal('eco',.1);return B('Les classes populaires approuvent.','Working-class voters approve.','Las clases populares aprueban.')}),
 C_(B('Appeler à la prudence','Call for caution','Pedir prudencia'),FREE,()=>{H.img(.05);return B('Un message mesuré, peu remarqué.','A measured message, little noticed.','Un mensaje mesurado, poco notado.')})]},
{id:'y20mail',req:()=>yk()==='2020',t:B('Bataille sur le vote par correspondance','Fight over mail-in voting','Batalla por el voto por correo'),
 x:()=>t('Les règles du vote par correspondance deviennent un sujet de bataille juridique et politique.','Mail-in voting rules turn into a legal and political fight.','Las reglas del voto por correo se convierten en una batalla jurídica y política.'),
 ch:[
 C_(B('Mobiliser le vote anticipé','Push early voting','Impulsar el voto anticipado'),B('−2 M$','−$2M','−2 M$'),()=>{H.pay(2);G.states.forEach(s=>{if(s.ebP<3&&Math.abs(s.lean)<6)s.ebP=Math.min(3,s.ebP+.3)});return B('Vos équipes inscrivent massivement.','Your teams register voters in droves.','Tus equipos inscriben en masa.')}),
 C_(B('Contester les règles','Challenge the rules','Impugnar las reglas'),GAMBLE,()=>{if(rnd()<.5){H.img(.1);return B('Vous gagnez la bataille de l’opinion.','You win the battle of opinion.','Ganas la batalla de la opinión.')}H.img(-.25);return B('On vous accuse de freiner le vote.','You are accused of suppressing the vote.','Te acusan de frenar el voto.')}),
 C_(B('Rassurer les électeurs','Reassure voters','Tranquilizar a los votantes'),FREE,()=>{H.img(.1);return B('Un message de confiance bien reçu.','A confidence message, well received.','Un mensaje de confianza bien recibido.')})]},
{id:'y24age',req:()=>yk()==='2024',t:B('Le débat sur l’âge et la forme','The age and stamina debate','El debate sobre la edad y la forma'),
 x:()=>t('Une prestation hésitante relance le débat sur l’âge et la forme physique des candidats.','A shaky performance revives the debate over candidates’ age and stamina.','Una actuación titubeante reaviva el debate sobre la edad y la forma física de los candidatos.'),
 ch:[
 C_(B('Montrer de l’énergie','Show some energy','Mostrar energía'),M1AN,()=>{G.apNext-=1;H.img(.3);return B('Une semaine intense qui rassure.','An intense week that reassures.','Una semana intensa que tranquiliza.')}),
 C_(B('Contre-attaquer','Hit back','Contraatacar'),GAMBLE,()=>{if(rnd()<.5){H.oppImg(.3);return B('Le débat se retourne contre l’adversaire.','The debate turns against your opponent.','El debate se vuelve contra el rival.')}H.img(-.2);return B('Votre riposte sonne creux.','Your comeback rings hollow.','Tu réplica suena hueca.')}),
 C_(B('Minimiser','Play it down','Quitarle importancia'),FREE,()=>{H.img(-.1);return B('Le sujet reste dans l’air.','The topic lingers.','El tema sigue en el aire.')})]},
{id:'y24fake',req:()=>yk()==='2024',t:B('Un faux enregistrement circule','A fake recording circulates','Circula una grabación falsa'),
 x:()=>t('Un enregistrement fabriqué par IA imite la voix d’un candidat et se répand sur les réseaux.','An AI-fabricated recording mimics a candidate’s voice and spreads on social media.','Una grabación fabricada con IA imita la voz de un candidato y se propaga en las redes.'),
 ch:[
 C_(B('Démentir et alerter','Debunk and warn','Desmentir y alertar'),B('−1 M$','−$1M','−1 M$'),()=>{H.pay(1);H.img(.2);return B('La riposte est rapide et crédible.','The response is fast and credible.','La respuesta es rápida y creíble.')}),
 C_(B('Réclamer une loi','Call for a law','Reclamar una ley'),ISSP,()=>{H.sal('ai',.2);H.target('jeu',.3);return B('Les jeunes apprécient.','Young voters appreciate it.','A los jóvenes les gusta.')}),
 C_(B('Ignorer','Ignore it','Ignorarlo'),FREE,()=>{H.img(-.15);return B('Le faux fait son chemin.','The fake makes its way.','El falso se abre camino.')})]},
{id:'y10tax',req:()=>yk()==='m2010',t:B('Mouvement de colère fiscale','Tax-revolt movement','Movimiento de rebelión fiscal'),
 x:()=>t('Des rassemblements locaux dénoncent l’État fédéral, les impôts et les plans de sauvetage. Le mouvement gagne les médias.','Local rallies denounce the federal government, taxes and bailouts. The movement hits the media.','Mítines locales denuncian al Estado federal, los impuestos y los rescates. El movimiento llega a los medios.'),
 pre(){H.incHit(.3);H.sal('eco',.15)},ch:[
 C_(B('S’en distancier','Distance yourself','Distanciarte'),FREE,()=>{H.target('dip',.3);return B('Vous évitez l’amalgame.','You avoid the association.','Evitas la asociación.')}),
 C_(B('Récupérer le mouvement','Embrace the movement','Abrazar el movimiento'),GAMBLE,()=>{if(rnd()<.5){H.target('evg',.4);H.target('ouv',.3);return B('Vous captez une partie de la colère.','You capture some of the anger.','Capturas parte de la ira.')}H.img(-.2);return B('Cela sonne opportuniste.','It sounds opportunistic.','Suena oportunista.')}),
 C_(B('Parler emploi','Talk jobs','Hablar de empleo'),ISSP,()=>{H.sal('eco',.1);return B('Vous recentrez sur l’emploi.','You refocus on jobs.','Reorientas hacia el empleo.')})]},
{id:'y18youth',req:()=>yk()==='m2018',t:B('Mobilisation de la jeunesse','Youth mobilization','Movilización juvenil'),
 x:()=>t('Des marches étudiantes massives réclament des lois sur les armes et la sécurité. Les inscriptions sur les listes explosent.','Massive student marches demand gun and safety laws. Voter registrations surge.','Multitudinarias marchas estudiantiles exigen leyes sobre armas y seguridad. Se disparan las inscripciones en el censo.'),
 pre(){H.sal('sec',.2)},ch:[
 C_(B('Rejoindre le mouvement','Join the movement','Unirte al movimiento'),M1AN,()=>{G.apNext-=1;H.target('jeu',.7);H.img(.1);return B('Les jeunes vous accueillent bien.','Young voters welcome you.','Los jóvenes te reciben bien.')}),
 C_(B('Financer l’inscription','Fund registration drives','Financiar la inscripción'),B('−2 M$','−$2M','−2 M$'),()=>{H.pay(2);H.target('jeu',.5);H.target('noi',.2);return B('Des milliers de nouveaux inscrits.','Thousands of new registrants.','Miles de nuevos inscritos.')}),
 C_(B('Rester en retrait','Stay on the sidelines','Mantenerte al margen'),FREE,()=>B('Le mouvement vous dépasse.','The movement passes you by.','El movimiento te supera.'))]},
{id:'y22leak',req:()=>yk()==='m2022',t:B('Une décision de justice fuite','A court decision leaks','Se filtra una decisión judicial'),
 x:()=>t('Le brouillon d’un arrêt de la plus haute juridiction sur l’avortement est dévoilé. La mobilisation change de camp.','The draft of a top-court ruling on abortion is leaked. Mobilization shifts sides.','Se filtra el borrador de una sentencia del máximo tribunal sobre el aborto. La movilización cambia de bando.'),
 pre(){H.sal('avo',.3)},ch:[
 C_(B('Faire campagne sur le droit','Campaign on the right','Hacer campaña por el derecho'),ISSP,()=>{H.sal('avo',.1);H.target('dip',.4);H.target('jeu',.3);return B('Les électrices et les jeunes se mobilisent.','Women and young voters mobilize.','Las mujeres y los jóvenes se movilizan.')}),
 C_(B('Parler économie','Talk economy','Hablar de economía'),ISSP,()=>{H.sal('eco',.15);return B('Vous gardez la main sur votre thème.','You hold the ground on your theme.','Mantienes el terreno en tu tema.')}),
 C_(B('Rester prudent','Stay cautious','Mantenerte prudente'),FREE,()=>B('Vous évitez un sujet risqué.','You avoid a risky subject.','Evitas un tema arriesgado.'))]}
);
function yearDeck(){
  const ids=YEV[yk()];if(!ids||!G.deck)return;
  G.deck=G.deck.filter(i=>!ids.includes(i));
  ids.forEach((id,n)=>{const pos=Math.min(G.deck.length,1+n*3+Math.floor(rnd()*3));G.deck.splice(pos,0,id)});
}
