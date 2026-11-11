/* ---------- Événements internes à l'équipe ---------- */
// Drawn only when the condition (req) holds; otherwise the event goes back to the end of the deck.
const stf=()=>Object.keys(G.staff||{});
const stN=r=>{const q=STAFF.find(z=>z.id===r);return q?t(q.n):''};
const stW=()=>{const r=G.ev&&G.ev.who;return r&&G.staff[r]?r:null};
const stName=()=>{const r=stW();return r?G.staff[r].n:'—'};
EVENTS.push(
{id:'quit',req:()=>stf().length>0,t:B('Un cadre menace de partir','A senior staffer threatens to quit','Un cargo amenaza con irse'),
 pre(){G.ev.who=pickR(stf())},
 x:()=>t(`${stName()} (${stN(stW())}) a reçu une offre ailleurs et menace de partir en pleine campagne.`,`${stName()} (${stN(stW())}) got an offer elsewhere and threatens to leave mid-campaign.`,`${stName()} (${stN(stW())}) recibió una oferta en otro sitio y amenaza con irse en plena campaña.`),
 ch:[
 C_(B('Augmenter le salaire','Raise the salary','Subir el sueldo'),B('−1 M$, salaire +0,3 M$/sem.','−$1M, salary +$0.3M/wk','−1 M$, sueldo +0,3 M$/sem.'),()=>{const r=stW();if(!r)return B('Trop tard.','Too late.','Demasiado tarde.');H.pay(1);G.staff[r].sal=Math.round((G.staff[r].sal+.3)*10)/10;return B('Il reste, et reste motivé.','They stay, and stay motivated.','Se queda, y motivado.')}),
 C_(B('Promouvoir','Promote','Ascender'),B('−2 M$, niveau +1','−$2M, level +1','−2 M$, nivel +1'),()=>{const r=stW();if(!r)return B('Trop tard.','Too late.','Demasiado tarde.');H.pay(2);if(G.staff[r].sk<3){G.staff[r].sk++;G.staff[r].sal=Math.round((G.staff[r].sal+.4)*10)/10}return B('La promotion sert de message à toute l’équipe.','The promotion sends a message to the whole team.','El ascenso es un mensaje para todo el equipo.')}),
 C_(B('Le laisser partir','Let them go','Dejarlo marchar'),FREE,()=>{const r=stW();if(r)delete G.staff[r];return B('Le poste est vacant ; vous pourrez recruter.','The post is vacant; you can hire again.','El puesto queda vacante; podrás contratar.')})]},
{id:'leak',req:()=>stf().length>0,t:B('Fuite d’une note interne','Internal memo leaked','Se filtra una nota interna'),
 x:()=>t('Une note stratégique interne est publiée par la presse. Elle montre vos doutes sur certains États.','A confidential strategy memo is published by the press. It reveals your doubts about some states.','La prensa publica una nota estratégica interna. Revela tus dudas sobre algunos estados.'),
 pre(){G.ev.who=pickR(stf())},ch:[
 C_(B('Chercher la taupe','Hunt the leaker','Buscar al topo'),M1A,()=>{G.ap=Math.max(0,G.ap-1);if(rnd()<.6){H.img(.1);return B('La taupe est identifiée et écartée : l’équipe se resserre.','The leaker is found and removed: the team closes ranks.','El topo es identificado y apartado: el equipo se cohesiona.')}H.img(-.1);return B('Vous ne trouvez rien et le climat se dégrade.','You find nothing and morale sinks.','No encuentras nada y el clima se deteriora.')}),
 C_(B('Assumer publiquement','Own it publicly','Asumirlo en público'),FREE,()=>{H.img(-.05);return B('Vous minimisez : le sujet s’éteint vite.','You downplay it: the story fades fast.','Lo minimizas: el tema se apaga pronto.')}),
 C_(B('Contre-attaquer','Hit back','Contraatacar'),B('−1 M$','−$1M','−1 M$'),()=>{H.pay(1);H.oppImg(-.1);return B('Vous retournez l’affaire contre l’adversaire, soupçonné d’espionnage.','You turn it on your opponent, suspected of snooping.','Lo vuelves contra el rival, sospechoso de espionaje.')})]},
{id:'feud',req:()=>stf().length>=2,t:B('Conflit entre deux cadres','Two senior staffers clash','Choque entre dos cargos'),
 pre(){const a=stf().slice().sort(()=>rnd()-.5);G.ev.who=a[0];G.ev.who2=a[1]},
 x:()=>{const a=stW(),b=G.ev.who2&&G.staff[G.ev.who2]?G.ev.who2:null;return a&&b?t(`${G.staff[a].n} (${stN(a)}) et ${G.staff[b].n} (${stN(b)}) ne se parlent plus et se disputent la stratégie.`,`${G.staff[a].n} (${stN(a)}) and ${G.staff[b].n} (${stN(b)}) have stopped talking and fight over strategy.`,`${G.staff[a].n} (${stN(a)}) y ${G.staff[b].n} (${stN(b)}) han dejado de hablarse y se disputan la estrategia.`):t('Deux cadres se disputent la stratégie.','Two staffers fight over strategy.','Dos cargos se disputan la estrategia.')},
 ch:[
 C_(B('Arbitrer','Mediate','Mediar'),M1A,()=>{G.ap=Math.max(0,G.ap-1);return B('Vous les réconciliez ; l’équipe est soudée.','You reconcile them; the team is tight again.','Los reconcilias; el equipo vuelve a estar unido.')}),
 C_(B('Trancher pour l’un','Side with one','Tomar partido'),B('L’autre part','The other leaves','El otro se va'),()=>{const b=G.ev.who2;if(b&&G.staff[b])delete G.staff[b];H.img(.05);return B('Une voix l’emporte, l’autre quitte l’équipe.','One voice wins, the other leaves the team.','Una voz se impone, la otra deja el equipo.')}),
 C_(B('Laisser pourrir','Let it fester','Dejar que se pudra'),FREE,()=>{if(rnd()<.5){const a=stW();if(a)delete G.staff[a];H.img(-.1);return B('L’un d’eux claque la porte et le dit à la presse.','One slams the door and tells the press.','Uno da un portazo y se lo cuenta a la prensa.')}return B('La tension retombe d’elle-même.','The tension fades on its own.','La tensión se calma sola.')})]},
{id:'poach',req:()=>stf().length>0,t:B('L’adversaire débauche un de vos cadres','Your opponent poaches one of your staffers','El rival ficha a uno de tus cargos'),
 pre(){G.ev.who=pickR(stf())},
 x:()=>t(`L’équipe adverse propose un pont d’or à ${stName()} (${stN(stW())}).`,`The opposing team dangles a golden offer in front of ${stName()} (${stN(stW())}).`,`El equipo rival le ofrece un contrato de oro a ${stName()} (${stN(stW())}).`),
 ch:[
 C_(B('S’aligner sur l’offre','Match the offer','Igualar la oferta'),B('−1,5 M$','−$1.5M','−1,5 M$'),()=>{H.pay(1.5);return B('Il reste, et l’adversaire en est pour ses frais.','They stay, and your opponent wasted the effort.','Se queda y el rival pierde el esfuerzo.')}),
 C_(B('Le laisser partir','Let them go','Dejarlo marchar'),FREE,()=>{const r=stW();if(r){delete G.staff[r];G.cashO+=0}H.oppImg(.0);return B('Il rejoint l’adversaire ; vous devrez le remplacer.','They join your opponent; you will need a replacement.','Se une al rival; tendrás que sustituirlo.')}),
 C_(B('Révéler l’affaire','Go public','Hacerlo público'),FREE,()=>{if(rnd()<.55){H.oppImg(-.15);return B('La presse dénonce les méthodes de l’adversaire.','The press slams your opponent’s methods.','La prensa denuncia los métodos del rival.')}H.img(-.08);return B('Personne ne vous croit : vous passez pour fébrile.','Nobody buys it: you look rattled.','Nadie te cree: pareces nervioso.')})]},
{id:'star',t:B('Un vétéran propose ses services','A veteran offers to join','Un veterano ofrece sus servicios'),
 pre(){const miss=STAFF.filter(r=>!G.staff[r.id]);G.ev.who=null;G.ev.role=(miss.length?pickR(miss):pickR(STAFF)).id;G.ev.nm=genNamePick([])},
 x:()=>t(`${G.ev.nm}, ancien(ne) responsable de plusieurs grandes campagnes, propose de rejoindre votre équipe comme ${stN(G.ev.role).toLowerCase()}.`,`${G.ev.nm}, a veteran of several big campaigns, offers to join your team as ${stN(G.ev.role).toLowerCase()}.`,`${G.ev.nm}, veterano de varias grandes campañas, se ofrece a unirse a tu equipo como ${stN(G.ev.role).toLowerCase()}.`),
 ch:[
 C_(B('Recruter','Hire','Contratar'),B('−1,3 M$, niveau III','−$1.3M, level III','−1,3 M$, nivel III'),()=>{H.pay(1.3);G.staff[G.ev.role]={n:G.ev.nm,sk:3,sal:1.3};return B('Une recrue de choc qui rassure l’équipe.','A heavyweight hire who reassures the team.','Un fichaje de peso que tranquiliza al equipo.')}),
 C_(B('Décliner poliment','Politely decline','Declinar con cortesía'),FREE,()=>B('Vous gardez votre équipe telle quelle.','You keep the team as it is.','Mantienes el equipo como está.'))]},
{id:'burnout',req:()=>stf().length>=2&&G.wk>=5,t:B('L’équipe est épuisée','The team is exhausted','El equipo está agotado'),
 x:()=>t('Après des semaines à ce rythme, les cadres sont à bout. Les erreurs se multiplient.','After weeks at this pace, senior staff are running on fumes. Mistakes pile up.','Tras semanas a este ritmo, los cargos están al límite. Los errores se acumulan.'),
 ch:[
 C_(B('Week-end de repos','Rest weekend','Fin de semana de descanso'),B('−1 action cette semaine','−1 action this week','−1 acción esta semana'),()=>{G.apNext-=1;H.img(.08);return B('L’équipe reprend des forces ; la presse salue votre sens du collectif.','The team recharges; the press praises your team spirit.','El equipo recupera fuerzas; la prensa elogia tu espíritu de equipo.')}),
 C_(B('Serrer les rangs','Push through','Apretar los dientes'),FREE,()=>{if(rnd()<.5){H.img(-.12);return B('Une erreur de communication coûte cher.','A communications blunder costs you.','Un error de comunicación sale caro.')}return B('Ça passe, de justesse.','You get through, barely.','Se sale adelante, por los pelos.')})]}
);
