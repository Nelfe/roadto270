/* ---------- Mode Mandat : gouverner après l'élection ---------- */
const LAWS=[
 {id:'infra',k:'B',n:B('Plan d’infrastructures','Infrastructure plan','Plan de infraestructuras'),d:B('Routes, ponts, haut débit : le rare texte qui rassemble les deux camps.','Roads, bridges, broadband: the rare bill both camps can back.','Carreteras, puentes, banda ancha: el raro texto que une a ambos bandos.'),c:3,ap:.72,ec:.3,fil:true},
 {id:'vets',k:'B',n:B('Aide aux anciens combattants','Veterans support','Apoyo a los veteranos'),d:B('Soins et pensions renforcés. Très consensuel.','Stronger care and pensions. Highly consensual.','Más atención y pensiones. Muy consensuado.'),c:2,ap:.78,ec:0,fil:true},
 {id:'relance',k:'B',n:B('Plan de relance','Stimulus package','Plan de estímulo'),d:B('Chèques et aides aux entreprises pour soutenir la conjoncture. Passe par la procédure budgétaire.','Checks and business aid to prop up the economy. Goes through the budget process.','Cheques y ayudas a empresas para sostener la economía. Pasa por el proceso presupuestario.'),c:4,ap:.62,ec:.45,fil:false},
 {id:'permis',k:'B',n:B('Réforme des permis de construire','Permitting reform','Reforma de permisos de construcción'),d:B('Accélère les chantiers : logement, énergie, transports.','Speeds up building: housing, energy, transport.','Acelera las obras: vivienda, energía, transporte.'),c:2,ap:.6,ec:.2,fil:true},
 {id:'sante',k:'D',n:B('Assurance santé publique élargie','Expanded public health insurance','Seguro de salud público ampliado'),d:B('Ouvre l’assurance publique à des millions d’Américains de plus.','Opens public insurance to millions more Americans.','Abre el seguro público a millones de estadounidenses más.'),c:5,ap:.52,ec:-.1,fil:true},
 {id:'clima',k:'D',n:B('Plan climat et énergies propres','Climate and clean-energy plan','Plan de clima y energías limpias'),d:B('Crédits d’impôt et normes pour accélérer la transition.','Tax credits and standards to speed up the transition.','Créditos fiscales y normas para acelerar la transición.'),c:4,ap:.5,ec:.1,fil:false},
 {id:'dreamers',k:'D',n:B('Régularisation des « Dreamers »','Path to status for “Dreamers”','Regularización de los «Dreamers»'),d:B('Un statut légal pour les arrivés enfants.','Legal status for those who arrived as children.','Un estatus legal para quienes llegaron de niños.'),c:4,ap:.6,ec:0,fil:true},
 {id:'avortD',k:'D',n:B('Droit à l’avortement protégé par la loi','Abortion rights written into law','Derecho al aborto protegido por ley'),d:B('Inscrit le droit à l’avortement dans la loi fédérale.','Writes abortion rights into federal law.','Inscribe el derecho al aborto en la ley federal.'),c:5,ap:.55,ec:0,fil:true},
 {id:'dette',k:'D',n:B('Allègement de la dette étudiante','Student debt relief','Alivio de la deuda estudiantil'),d:B('Annule une partie des prêts étudiants.','Cancels part of student loans.','Cancela parte de los préstamos estudiantiles.'),c:3,ap:.5,ec:-.1,fil:false},
 {id:'smic',k:'D',n:B('Hausse du salaire minimum','Higher minimum wage','Subida del salario mínimo'),d:B('Salaire minimum fédéral relevé. Populaire, mais les patrons grincent.','Raises the federal minimum wage. Popular, though employers grumble.','Sube el salario mínimo federal. Popular, aunque los empresarios protestan.'),c:3,ap:.64,ec:-.05,fil:true},
 {id:'armes',k:'D',n:B('Contrôle des armes renforcé','Stricter gun control','Mayor control de armas'),d:B('Vérification des antécédents élargie.','Expanded background checks.','Verificación de antecedentes ampliada.'),c:4,ap:.6,ec:0,fil:true},
 {id:'ia',k:'D',n:B('Encadrement de l’intelligence artificielle','AI regulation','Regulación de la inteligencia artificial'),d:B('Règles de transparence et protection des salariés.','Transparency rules and worker protections.','Reglas de transparencia y protección de los trabajadores.'),c:3,ap:.58,ec:-.05,fil:true},
 {id:'impots',k:'R',n:B('Baisse d’impôts et dérégulation','Tax cuts and deregulation','Rebaja de impuestos y desregulación'),d:B('Allègements fiscaux pour les ménages et les entreprises. Procédure budgétaire.','Tax relief for households and firms. Budget process.','Alivios fiscales para hogares y empresas. Proceso presupuestario.'),c:4,ap:.5,ec:.35,fil:false},
 {id:'mur',k:'R',n:B('Sécurisation de la frontière','Border security','Seguridad fronteriza'),d:B('Plus d’agents, de barrières et de juges d’immigration.','More agents, barriers and immigration judges.','Más agentes, barreras y jueces de inmigración.'),c:4,ap:.52,ec:0,fil:true},
 {id:'santeR',k:'R',n:B('Marché de l’assurance santé','Health insurance market reform','Reforma del mercado de seguros de salud'),d:B('Fin des obligations, concurrence entre assureurs.','Ends mandates, more insurer competition.','Fin de los mandatos, más competencia entre aseguradoras.'),c:4,ap:.42,ec:.05,fil:false},
 {id:'forage',k:'R',n:B('Indépendance énergétique','Energy independence','Independencia energética'),d:B('Forage et oléoducs facilités.','Easier drilling and pipelines.','Perforación y oleoductos facilitados.'),c:4,ap:.47,ec:.2,fil:false},
 {id:'ecole',k:'R',n:B('Libre choix de l’école','School choice','Libre elección de escuela'),d:B('Bons scolaires et écoles à charte.','School vouchers and charter schools.','Cheques escolares y escuelas concertadas.'),c:3,ap:.5,ec:0,fil:true},
 {id:'avortR',k:'R',n:B('Restrictions fédérales de l’avortement','Federal abortion limits','Restricciones federales del aborto'),d:B('Limite nationale à l’avortement. Très clivant.','A national limit on abortion. Highly divisive.','Un límite nacional al aborto. Muy divisivo.'),c:5,ap:.4,ec:0,fil:true},
 {id:'defense',k:'R',n:B('Hausse du budget de la défense','Higher defense budget','Mayor presupuesto de defensa'),d:B('Plus de moyens pour l’armée. Procédure budgétaire.','More means for the military. Budget process.','Más medios para el ejército. Proceso presupuestario.'),c:3,ap:.55,ec:.05,fil:false},
 {id:'police',k:'R',n:B('Soutien accru à la police','More support for police','Más apoyo a la policía'),d:B('Financements et protection juridique pour les forces de l’ordre.','Funding and legal protection for law enforcement.','Financiación y protección legal para las fuerzas del orden.'),c:3,ap:.58,ec:0,fil:true}
];
const LAW=id=>LAWS.find(l=>l.id===id);
const TM=()=>G.term;
const adjT=(T,f)=>{
  if(f.pc)T.pc=clamp(T.pc+f.pc,0,12);
  if(f.pop)T.pop=clamp(T.pop+f.pop,25,75);
  if(f.econ)T.econ=clamp(T.econ+f.econ,-2,2);
  if(f.base)T.base=Math.max(0,T.base+f.base);
  if(f.back)T.back=Math.max(0,T.back+f.back);
  if(f.debt)T.debt+=f.debt;
  if(f.hard)T.hard=clamp(T.hard+f.hard,0,100);
  if(f.mod)T.mod=clamp(T.mod+f.mod,0,100);
};
const divided=T=>T.h[side()]<218||T.s[side()]<50;
const TEVENTS=[
 {id:'shut',req:T=>divided(T),n:B('Menace de paralysie budgétaire','Government shutdown looms','Amenaza de cierre del gobierno'),x:B('Le budget n’est pas voté et l’opposition pose ses conditions. L’administration risque de fermer.','The budget is stuck and the opposition sets its terms. Government may shut down.','El presupuesto está bloqueado y la oposición impone sus condiciones. El gobierno podría cerrar.'),ch:[
  {l:B('Céder sur l’essentiel','Give ground','Ceder en lo esencial'),f:T=>{adjT(T,{pop:-1,base:-.5});return B('Le budget passe. Votre base grince.','The budget passes. Your base grumbles.','El presupuesto pasa. Tu base protesta.')}},
  {l:B('Tenir bon','Hold firm','Mantenerse firme'),f:T=>{if(rnd()<.5){adjT(T,{pop:2,base:.5});return B('L’opposition recule : vous sortez renforcé(e).','The opposition backs down: you come out stronger.','La oposición retrocede: sales reforzado/a.')}adjT(T,{pop:-6,pc:-2});return B('Fermeture de plusieurs jours : l’opinion vous en veut.','Several days of shutdown: public opinion blames you.','Varios días de cierre: la opinión te culpa.')}}]},
 {id:'scand',n:B('Scandale dans l’administration','Scandal in the administration','Escándalo en la administración'),x:B('Un proche collaborateur est accusé d’avoir abusé de ses fonctions.','A close aide is accused of abusing the office.','Un colaborador cercano es acusado de abusar de su cargo.'),ch:[
  {l:B('Le limoger tout de suite','Fire them immediately','Despedirlo de inmediato'),f:T=>{adjT(T,{pop:-1,pc:-1});return B('Vous tournez la page rapidement.','You move on quickly.','Pasas página rápidamente.')}},
  {l:B('Le défendre','Stand by them','Defenderlo'),f:T=>{if(rnd()<.4){adjT(T,{pop:-6});return B('De nouvelles révélations : la défense tourne au fiasco.','More revelations: the defense turns into a fiasco.','Nuevas revelaciones: la defensa se convierte en un fiasco.')}adjT(T,{pop:-3});return B('L’affaire s’éteint, mais laisse des traces.','The story fades but leaves a mark.','El asunto se apaga pero deja huella.')}}]},
 {id:'crise',n:B('Crise internationale','International crisis','Crisis internacional'),x:B('Une tension militaire éclate à l’étranger. Le pays attend votre réaction.','A military standoff erupts abroad. The country awaits your reaction.','Estalla una tensión militar en el extranjero. El país espera tu reacción.'),ch:[
  {l:B('Réponse ferme','Firm response','Respuesta firme'),f:T=>{if(rnd()<.6){adjT(T,{pop:3});return B('La fermeté paie : l’opinion se rassemble.','Firmness pays off: the public rallies.','La firmeza funciona: la opinión se une.')}adjT(T,{pop:-3});return B('L’escalade tourne mal.','The escalation goes badly.','La escalada sale mal.')}},
  {l:B('Voie diplomatique','Diplomacy','Vía diplomática'),f:T=>{adjT(T,{pop:1,pc:-1});return B('Tension apaisée, sans gloire ni dégâts.','Tension eased, without glory or damage.','Tensión rebajada, sin gloria ni daños.')}}]},
 {id:'ouragan',n:B('Ouragan dévastateur','Devastating hurricane','Huracán devastador'),x:B('Une catastrophe naturelle frappe le Sud. Les secours sont sous pression.','A natural disaster hits the South. Relief efforts are strained.','Un desastre natural golpea el Sur. Los servicios de emergencia están desbordados.'),ch:[
  {l:B('Aide massive et visite sur place','Massive aid and a visit','Ayuda masiva y visita'),f:T=>{adjT(T,{pop:3,econ:-.1,pc:-1});return B('Votre réactivité est saluée.','Your responsiveness is praised.','Se elogia tu rapidez de reacción.')}},
  {l:B('Aide limitée','Limited aid','Ayuda limitada'),f:T=>{adjT(T,{pop:-3});return B('Vous êtes accusé(e) d’abandonner les sinistrés.','You are accused of abandoning the victims.','Te acusan de abandonar a los damnificados.')}}]},
 {id:'cour',n:B('Vacance à la Cour suprême','Supreme Court vacancy','Vacante en el Tribunal Supremo'),x:B('Un juge part à la retraite : à vous de nommer son successeur.','A justice retires: you must name a successor.','Un juez se jubila: te toca nombrar a su sucesor.'),ch:[
  {l:B('Un juge modéré','A moderate','Un juez moderado'),f:T=>{adjT(T,{pop:1});return B('Confirmé largement, sans histoire.','Confirmed widely, with no drama.','Confirmado con amplio apoyo, sin sobresaltos.')}},
  {l:B('Un juge très idéologue','A hard-line ideologue','Un juez muy ideológico'),f:T=>{if(T.s[side()]>=51||rnd()<.25){adjT(T,{base:1,back:1,pop:-1});return B('Confirmé de justesse : votre base exulte, l’autre camp se mobilise.','Narrowly confirmed: your base cheers, the other camp mobilizes.','Confirmado por los pelos: tu base exulta, el otro bando se moviliza.')}adjT(T,{pop:-3,pc:-1});return B('Le Sénat rejette la nomination.','The Senate rejects the nomination.','El Senado rechaza la nominación.')}}]},
 {id:'reces',n:B('Signaux de récession','Recession signals','Señales de recesión'),x:B('Les créations d’emplois s’effondrent et la Bourse chute.','Job creation collapses and stocks tumble.','La creación de empleo se desploma y la bolsa cae.'),ch:[
  {l:B('Plan de soutien d’urgence','Emergency support plan','Plan de apoyo de emergencia'),f:T=>{adjT(T,{pc:-3,econ:.5});return B('L’économie respire, au prix de votre capital politique.','The economy breathes, at the cost of political capital.','La economía respira, a costa de tu capital político.')}},
  {l:B('Laisser faire','Let it ride','Dejar hacer'),f:T=>{adjT(T,{pop:-3,econ:-.3});return B('Le ralentissement s’installe.','The slowdown sets in.','La desaceleración se instala.')}}],req:T=>T.econ<.8},
 {id:'aile',n:B('Fronde dans votre camp','Revolt in your own camp','Revuelta en tu bando'),x:B('L’aile dure de votre parti menace de bloquer vos textes si vous ne cédez pas.','The hard-liners in your party threaten to block your bills unless you give in.','El ala dura de tu partido amenaza con bloquear tus textos si no cedes.'),ch:[
  {l:B('Faire des concessions','Make concessions','Hacer concesiones'),f:T=>{adjT(T,{pc:-2,base:1});return B('La base est apaisée.','The base is appeased.','La base se calma.')}},
  {l:B('Les ignorer','Ignore them','Ignorarlos'),f:T=>{adjT(T,{pc:1,base:-1});return B('Vous gagnez en autorité, mais perdez des soutiens militants.','You gain authority but lose activist support.','Ganas autoridad pero pierdes apoyos militantes.')}}]},
 {id:'manif',n:B('Grandes manifestations','Mass protests','Grandes manifestaciones'),x:B('Des cortèges massifs défilent dans les grandes villes.','Massive marches fill major cities.','Multitudinarias marchas llenan las grandes ciudades.'),ch:[
  {l:B('Ouvrir le dialogue','Open a dialogue','Abrir el diálogo'),f:T=>{adjT(T,{pop:1,pc:-1});return B('Le calme revient peu à peu.','Calm gradually returns.','La calma vuelve poco a poco.')}},
  {l:B('Rester ferme','Stay firm','Mantenerse firme'),f:T=>{adjT(T,{pop:-1,base:1});return B('Votre camp applaudit, le pays est partagé.','Your camp applauds, the country is split.','Tu bando aplaude, el país está dividido.')}}]},
 {id:'oppbill',req:T=>divided(T),n:B('Un texte de l’opposition arrive','An opposition bill reaches your desk','Llega un texto de la oposición'),x:B('Le Congrès vous envoie une loi portée par l’autre camp.','Congress sends you a bill pushed by the other camp.','El Congreso te envía una ley impulsada por el otro bando.'),ch:[
  {l:B('La promulguer','Sign it','Promulgarla'),f:T=>{adjT(T,{pop:1,base:-1});return B('Vous évitez le conflit, votre base fait la moue.','You avoid a fight; your base pouts.','Evitas el conflicto; tu base hace muecas.')}},
  {l:B('Opposer son veto','Veto it','Vetarla'),f:T=>{const o=435-T.h[side()],os=100-T.s[side()];if(o>=290&&os>=67){adjT(T,{pop:-2,pc:-1});return B('Le Congrès passe outre votre veto.','Congress overrides your veto.','El Congreso anula tu veto.')}adjT(T,{pop:.5,base:.5,pc:-1});return B('Le veto tient.','The veto holds.','El veto se mantiene.')}}]},
 {id:'boom',req:T=>T.econ>-.5,n:B('Bonne surprise économique','Economic upside','Buena sorpresa económica'),x:B('Les chiffres de l’emploi et de la croissance dépassent les attentes.','Jobs and growth figures beat expectations.','Las cifras de empleo y crecimiento superan las expectativas.'),ch:[
  {l:B('Revendiquer le succès','Take credit','Atribuirte el éxito'),f:T=>{adjT(T,{pop:2,econ:.2});return B('Le pays vous en sait gré.','The country gives you credit.','El país te lo reconoce.')}},
  {l:B('Rester sobre','Stay modest','Mantener la sobriedad'),f:T=>{adjT(T,{pop:1,pc:1});return B('Vous gagnez en crédibilité auprès du Congrès.','You gain credibility with Congress.','Ganas credibilidad ante el Congreso.')}}]}
];
function seatsFrom(nat){ // nat = marge nationale (D+) de la présidentielle
  const m=G.me*nat,my=side();
  const h=clamp(Math.round(218+3.2*m+randn()*7),196,262),s=clamp(Math.round(50+.9*m+randn()*2),43,57);
  return{h:{[my]:h,[oside()]:435-h},s:{[my]:s,[oside()]:100-s}};
}
function newTerm(extra){
  const sd=seatsFrom(G.natM||0);
  return Object.assign({q:1,qmax:8,half:1,pc:6,pop:clamp(Math.round(50+1.5*G.me*(G.natM||0)),44,62),econ:clamp(G.econ||0,-1.5,1.5),base:0,back:0,acts:2,laws:[],failed:0,orders:[],nuke:false,ag:[],log:[],ev:null,evRes:null,h:sd.h,s:sd.s,cand:G.cand,midWon:null,bonus:0},extra||{},m2Init());
}
function mkShell(T,keep){
  const k=keep||G;
  G={dbg:k.dbg||T.dbg||false,v:3,mode:'term',me:k.me,diff:k.diff,seed:k.seed,slot:k.slot,inc:side(),phase:'term',term:T,rec:false,log:[],hist:[],wk:1,t:Date.now(),daily:null,pr:null,cand:T.cand,states:[],long:false};
  newAgenda();save();
}
function newAgenda(){
  const T=TM(),my=side();
  const pool=LAWS.filter(l=>(l.k==='B'||l.k===my)&&!T.laws.includes(l.id)),a=[];
  while(a.length<5&&pool.length){a.push(pool.splice(Math.floor(rnd()*pool.length),1)[0].id)}
  T.ag=a;
}
function lawOdds(l,push){
  const T=TM(),me=side(),hm=T.h[me],ho=435-hm,sm=T.s[me],so=100-sm;
  m2Ensure(T);const cross=clamp((l.ap-.48)*2.2*(l.k==='B'?1.25:1),0,.6),def=clamp((l.k==='B'?.02:.03+(.55-l.ap)*.5)+m2Def(T,l),0,.4);
  const bonus=(push?5:0)+(T.pop-47)*.12;
  const yh=hm*(1-def)+ho*cross+bonus*1.5,ys=sm*(1-def)+so*cross+bonus*.4+m2Sen(T,l);
  const need=(l.fil&&!T.nuke)?59.5:49.5;
  const ph=PHI((yh-217.5)/9),ps=PHI((ys-need)/2.2);
  return{p:ph*ps,ph,ps};
}
const lawPass=(T,l,ord)=>{
  const k=ord?.6:1,my=side();
  adjT(T,{pop:((l.ap-.5)*12+(l.k==='B'?1:0))*k,econ:l.ec*k});
  if(l.k===my)adjT(T,{base:.4*k,back:l.ap<.5?.5*k:0});
  T.laws.push(l.id);m2Pass(T,l,k);
};
function tLog(T,fn){T.log.unshift(both(fn));T.log=T.log.slice(0,6)}
function termTry(id,mode){ // mode: 'p' proposer, 'push', 'ord'
  const T=TM(),l=LAW(id);if(!l||T.acts<1||T.laws.includes(id)||T.ev)return;
  const ord=mode==='ord',push=mode==='push',cost=ord?Math.max(1,l.c-2):l.c+(push?2:0);
  if(T.pc<cost)return;
  T.pc-=cost;T.acts--;
  const nm=()=>t(l.n.fr,l.n.en,l.n.es);
  if(ord){
    lawPass(T,l,true);adjT(T,{pop:-.5});T.orders.push(id);
    tLog(T,()=>t(`Décret : « ${nm()} ».`,`Executive order: “${nm()}”.`,`Decreto: «${nm()}».`));
  }else{
    const o=lawOdds(l,push);
    if(rnd()<o.p){lawPass(T,l,false);tLog(T,()=>t(`Loi adoptée : « ${nm()} ».`,`Bill passed: “${nm()}”.`,`Ley aprobada: «${nm()}».`))}
    else{T.pc=clamp(T.pc+Math.floor(cost/2),0,12);adjT(T,{pop:-1});T.failed++;tLog(T,()=>t(`Échec au Congrès : « ${nm()} ».`,`Defeated in Congress: “${nm()}”.`,`Derrota en el Congreso: «${nm()}».`))}
  }
  save();render();
}
function termNuke(){
  const T=TM();if(T.nuke||T.pc<4||T.s[side()]<50||T.ev)return;
  T.pc-=4;T.nuke=true;adjT(T,{pop:-3,back:.5});
  tLog(T,()=>t('Le Sénat supprime le filibuster pour les lois ordinaires.','The Senate scraps the filibuster for ordinary bills.','El Senado elimina el filibusterismo para las leyes ordinarias.'));
  save();render();
}
function termEndQ(){
  const T=TM();if(T.ev)return;
  // décrets annulés
  T.orders=T.orders.filter(id=>{if(rnd()<.35){const l=LAW(id);T.laws=T.laws.filter(x=>x!==id);adjT(T,{pop:-1.5,pc:-1});tLog(T,()=>t(`Les tribunaux annulent le décret « ${t(l.n.fr,l.n.en,l.n.es)} ».`,`Courts strike down the order “${t(l.n.fr,l.n.en,l.n.es)}”.`,`Los tribunales anulan el decreto «${t(l.n.fr,l.n.en,l.n.es)}».`));return false}return false});
  // dérive
  adjT(T,{pop:T.econ*.9-(T.half===1?.9:.3)+(47-T.pop)*.12+randn()*1.8,econ:randn()*.35-.05*T.econ});
  T.pc=clamp(T.pc+2+(T.pop>55?1:0),0,12);
  m2Quarter(T);
  T.q++;T.acts=2;
  const pool=TEVENTS.filter(e=>!e.req||e.req(T));
  if(T.q<=T.qmax&&T.q%4===3){T.ev='budget';T.evRes=null;newAgenda();save();render();showTev();return}
  if(rnd()<.8&&pool.length){T.ev=pool[Math.floor(rnd()*pool.length)].id;T.evRes=null;newAgenda();save();render();showTev();return}
  afterQ();
}
function afterQ(){
  const T=TM();T.ev=null;T.evRes=null;
  if(T.q>T.qmax){save();render();showTermEnd();return}
  newAgenda();save();render();
}
function showTev(){
  const T=TM(),e=TEVENTS.find(q=>q.id===T.ev);if(!e){afterQ();return}
  if(T.evRes==null)showModal(`<h2>${t(e.n.fr,e.n.en,e.n.es)}</h2><p>${t(e.x.fr,e.x.en,e.x.es)}</p>${e.ch.map((c,i)=>`<button class="ch" data-act="tev" data-i="${i}"><b>${t(c.l.fr,c.l.en,c.l.es)}</b></button>`).join('')}`);
  else showModal(`<h2>${t(e.n.fr,e.n.en,e.n.es)}</h2><div class="res">${t(T.evRes.fr,T.evRes.en,T.evRes.es)}</div><button class="btn full" data-act="tevnext">${t('Continuer','Continue','Continuar')}</button>`);
}
function termResume(){
  const T=TM();if(!T)return;
  if(T.ev)showTev();else if(T.q>T.qmax)showTermEnd();else firstTip('term');
}
function tevChoose(i){
  const T=TM(),e=TEVENTS.find(q=>q.id===T.ev);if(!e||T.evRes!=null)return;
  const p0=T.pop;T.evRes=e.ch[i].f(T);m2Post(T,e,p0);save();showTev();render();
}
function shiftOf(T){return(T.pop-46)*.1+.15*Math.min(4,T.base)-.2*Math.min(4,T.back)+T.econ*.25+m2Shift(T)}
function recordSummary(T){
  const L=T.laws.map(id=>LAW(id)).filter(Boolean);
  return`<p>${t('Lois en vigueur','Laws in force','Leyes en vigor')} : <b>${L.length}</b>${L.length?' — '+L.map(l=>t(l.n.fr,l.n.en,l.n.es)).join(' · '):''}.<br>${t('Popularité','Approval','Aprobación')} : <b>${Math.round(T.pop)} %</b>. ${t('Économie','Economy','Economía')} : ${T.econ>.6?t('bonne','good','buena'):T.econ<-.6?t('mauvaise','poor','mala'):t('moyenne','average','media')}.</p>`;
}
function showTermEnd(){
  const T=TM(),first=T.half===1;
  showModal(`<h2>${first?t('Mi-mandat','Midterm moment','A mitad de mandato'):t('Fin du mandat','End of the term','Fin del mandato')}</h2>${recordSummary(T)}<p>${first?t('Les midterms arrivent : le bilan de ces deux années pèsera sur le résultat, ainsi que votre capacité à mobiliser votre base.','The midterms are here: your two-year record will weigh on the result, along with your ability to energize your base.','Llegan las elecciones intermedias: el balance de estos dos años pesará en el resultado, junto con tu capacidad de movilizar a tu base.'):t('La réélection se joue maintenant : vos lois, la popularité et l’économie dessineront le climat de la campagne.','Re-election is on the line: your laws, approval and the economy will set the campaign’s climate.','La reelección está en juego: tus leyes, la aprobación y la economía marcarán el clima de la campaña.')}</p><button class="btn full" data-act="${first?'termmid':'termreel'}">${first?t('Lancer la campagne des midterms','Launch the midterm campaign','Lanzar la campaña de las intermedias'):t('Lancer la campagne de réélection','Launch the re-election campaign','Lanzar la campaña de reelección')}</button>`);
}
function termToMid(){
  const T=TM(),me=G.me,diff=G.diff,slot=G.slot,seed=G.seed,dbg=G.dbg;
  newGame(me,diff,(seed|0)+101,null,'mid');
  G.dbg=dbg;G.slot=slot;G.chain=T;G.inc=side();G.econ=T.econ;
  G.env=PARAM.neutral-me*(PARAM.midEnv+randn()*1.4)+me*({0:1.2,1:0,2:-1.2}[diff])+me*shiftOf(T);
  UI.tutoPending=!SIM;save();hideModal();render();showBrief();
}
function chainNext(){ // après les midterms : seconde moitié du mandat
  const T0=G.chain,R=G.res,my=side();
  const T=Object.assign({},T0,{half:2,q:1,qmax:4,acts:2,ev:null,evRes:null,ag:[],log:[],orders:[],h:{[my]:my==='D'?R.hD:R.hR,[oside()]:my==='D'?R.hR:R.hD},s:{[my]:my==='D'?R.sD:R.sR,[oside()]:my==='D'?R.sR:R.sD},midWon:R.hCtl===my,pc:clamp(T0.pc+2,0,12)});
  adjT(T,{pop:R.hCtl===my?1.5:-1});
  hideModal();mkShell(T,G);render();
}
function termToReel(){
  const T=TM(),me=G.me,diff=G.diff,slot=G.slot,seed=G.seed,cand=T.cand,dbg=G.dbg;
  newGame(me,diff,(seed|0)+202,null,'pres');
  G.dbg=dbg;G.slot=slot;G.reel=true;G.inc=side();G.econ=T.econ;
  G.env=PARAM.neutral+me*((T.pop-45)*.09+.12*Math.min(4,T.base)-.15*Math.min(4,T.back)+T.econ*.3+(T.midWon?.4:-.2)+m2Shift(T)*1.3+randn()*.9)+me*({0:1.2,1:0,2:-1.2}[diff])*.5;
  G.cand=cand;G.cands=[cand];G.pr=null;applyCand(G.cand,true);applyCand(G.opp,false);
  G.cash=PARAM.pcash+4+DM.cash[diff];G.cashO=PARAM.pcash+4+(diff===2?3:0);G.phase='vp';
  if(m2Chal(T)){G.chal=true;G.env-=G.me*.7;G.cash=Math.max(8,G.cash-4)}
  UI.tab='map';UI.sel=null;save();hideModal();render();showBrief();
}
function termStart(){ // appelé depuis la soirée électorale (victoire)
  const T=newTerm();hideModal();mkShell(T,G);render();firstTip('term');
}
