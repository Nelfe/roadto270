/* ---------- Débat interactif ---------- */
// 3 topic questions (drawn among the most salient issues) + a closing statement. Each answer has a style with its own risk/reward.
const DEB_GRP={eco:'ouv',imm:'lat',san:'sen',avo:'jeu',sec:'noi',cli:'jeu',com:'ouv',edu:'jeu',ai:'dip',def:'evg'};
const DEB_TOPIC=[
 {id:'atk',n:B('Attaquer','Attack'),d:B('Fort risque, fort gain','High risk, high reward'),m:.2,sd:1.3},
 {id:'plan',n:B('Détailler votre plan','Lay out your plan'),d:B('Mieux si l’enjeu vous est favorable','Better on issues that favor you'),m:.2,sd:.7},
 {id:'story',n:B('Raconter un vécu','Tell a personal story'),d:B('Sûr, parle à un groupe','Safe, speaks to one group'),m:.15,sd:.5},
 {id:'pivot',n:B('Recentrer sur votre terrain','Pivot to your strong ground'),d:B('Esquive un enjeu défavorable','Dodges an unfavorable issue'),m:0,sd:.5}];
const DEB_CLOSE=[
 {id:'vis',n:B('Vision positive','Positive vision'),d:B('Sûr, profite d’une bonne image','Safe, helped by a good image'),m:.2,sd:.6},
 {id:'con',n:B('Contraste frontal','Sharp contrast'),d:B('Risqué, peut faire le buzz','Risky, can go viral'),m:.1,sd:1.2},
 {id:'ask',n:B('Appel à voter','Call to vote'),d:B('Mobilise votre camp','Energizes your base'),m:.15,sd:.5}];
function debStart(){
  const w=ISSUES.map((q,i)=>G.sal[i]+.15),qs=[];
  while(qs.length<3){let tot=w.reduce((a,b)=>a+b,0)*rnd(),i=0;for(;i<w.length-1;i++){tot-=w[i];if(tot<=0)break}if(!qs.includes(i))qs.push(i)}
  G.ev.deb={q:0,qs,tot:0,opp:0,last:null,nth:G.wk===5?1:2};
}
function debQuestion(){const d=G.ev.deb;return d.q<3?{topic:ISSUES[d.qs[d.q]],set:DEB_TOPIC}:{topic:null,set:DEB_CLOSE}}
function debAnswer(i){
  const d=G.ev.deb,Q=debQuestion(),a=Q.set[i];if(!a)return;
  let m=a.m+PARAM.prep*G.prep/2+(trP().includes('debate')?.075:0)-(trO().includes('debate')?.075:0),sd=a.sd;
  if(Q.topic){
    const fav=G.me*Q.topic.own>.15,unf=G.me*Q.topic.own<-.15;
    if(a.id==='plan'){m+=fav?.35:unf?-.2:.1;H.sal(Q.topic.id,.06)}
    if(a.id==='pivot'){m+=unf?.4:fav?-.1:.1;const b=H.best();H.sal(b.id,.07);if(unf)H.sal(Q.topic.id,-.05)}
    if(a.id==='story'){H.target(DEB_GRP[Q.topic.id],.3)}
  }else{
    if(a.id==='vis')m+=clamp(G.me*G.img*.1,-.2,.2);
    if(a.id==='ask'){H.target('jeu',.15);H.target('ouv',.15)}
  }
  const sc=m+randn()*sd;
  if(a.id==='con'&&sc>.9){const s=G.states.filter(q=>q.ev>=10).sort(()=>rnd()-.5)[0];if(s)H.buzz(s.ab,.5)}
  d.tot+=sc;d.opp+=randn()*.6+(trO().includes('debate')?.1:0);
  d.last={sc,a:a.id,rx:sc>.7?0:sc>-.4?1:2};
  d.q++;
  if(d.q>=4){
    const r=d.tot-d.opp*.5-.7,img=clamp(r*.35,-1.4,1.4);H.img(img);G.prep=0;
    const res=r>1.2?B('Vous dominez le débat. Les éditorialistes sont unanimes.','You dominate the debate. Pundits are unanimous.','Dominas el debate. Los analistas coinciden.'):r>-.6?B('Un débat sans vainqueur net.','A debate with no clear winner.','Un debate sin ganador claro.'):B('Vous perdez le débat. Les images tournent en boucle.','You lose the debate. The clips play on a loop.','Pierdes el debate. Los vídeos se repiten sin parar.');
    G.ev.res=res;d.done=true;d.r=r;L('news',B(`Débat : ${res.fr}`,`Debate: ${res.en}`,`Debate: ${res.es}`));
  }
  save();showEvent();
}
// bots / quick resolution: style 0 = attack, 1 = plan or pivot, 2 = safe
function debAuto(style){
  if(!G.ev.deb)debStart();
  while(G.ev.deb.q<4){const Q=debQuestion();let i=style===0?0:style===1?(Q.topic?(G.me*Q.topic.own<-.15?3:1):0):(Q.topic?2:2);debAnswer(i)}
}
function showDebate(){
  const d=G.ev.deb,title=G.wk===5?t('Premier débat','First debate','Primer debate'):t('Second débat','Second debate','Segundo debate');
  if(!d){showModal(`<h2>${title}</h2><p>${t(`Face à face télévisé devant des dizaines de millions de personnes. Trois questions, puis une conclusion. Préparation : ${G.prep}/3.`,`A televised face-off before tens of millions of viewers. Three questions, then a closing statement. Preparation: ${G.prep}/3.`,`Cara a cara televisado ante decenas de millones de personas. Tres preguntas y una conclusión. Preparación: ${G.prep}/3.`)}</p><button class="btn full" data-act="dstart">${t('Monter sur scène','Step on stage','Subir al escenario')}</button>`);return}
  const RX=[t('Applaudissements dans la salle.','The room responds warmly.','La sala responde con aplausos.'),t('Réponse correcte, sans plus.','A solid but unremarkable answer.','Una respuesta correcta, sin más.'),t('Réponse maladroite, l’adversaire en profite.','A clumsy answer, your opponent pounces.','Una respuesta torpe; tu rival lo aprovecha.')];
  const prev=d.last&&!d.done?`<div class="res" style="margin-bottom:10px">${RX[d.last.rx]}</div>`:'';
  if(d.done){showModal(`<h2>${title}</h2><div class="res">${t(G.ev.res)}</div><p class="muted" style="font-size:13px">${t('Score cumulé','Total score','Puntuación total')} : ${d.r>=0?'+':''}${f1(d.r)}</p><button class="btn full" data-act="evnext">${t('Continuer','Continue','Continuar')}</button>`);return}
  const Q=debQuestion(),n=d.q+1;
  const head=Q.topic?t(`Question ${n}/4 · ${Q.topic.n.fr}`,`Question ${n}/4 · ${Q.topic.n.en}`,`Pregunta ${n}/4 · ${Q.topic.n.es||Q.topic.n.en}`):t('Conclusion · 4/4','Closing statement · 4/4','Conclusión · 4/4');
  const prompt=Q.topic?t(`Le modérateur vous interroge sur « ${Q.topic.n.fr} ». Comment répondez-vous ?`,`The moderator asks about “${Q.topic.n.en}”. How do you answer?`,`El moderador pregunta sobre «${Q.topic.n.es||Q.topic.n.en}». ¿Cómo respondes?`):t('Deux minutes pour convaincre avant la fin du débat.','Two minutes to make your case before the debate ends.','Dos minutos para convencer antes del final del debate.');
  showModal(`<h2>${title}</h2>${prev}<p class="muted" style="font-size:13px;margin-bottom:4px">${head}</p><p>${prompt}</p>${Q.set.map((a,i)=>`<button class="ch" data-act="dans" data-i="${i}"><b>${t(a.n)}</b><small>${t(a.d)}</small></button>`).join('')}`);
}
Object.assign(A,{dstart(){debStart();save();showEvent()},dans(x){debAnswer(+x.i)}});
