/* ---------- Convention (mode long) ---------- */
// Step 1: settle the party platform (one issue moves your position). Step 2: the acceptance speech (convention bounce).
function convApply(issueIdx,speech){
  const sd=side();
  if(issueIdx>=0){const i=issueIdx;G.pos[sd][i]=clamp(G.pos[sd][i]+(sd==='D'?1:-1),-2,2);H.sal(ISSUES[i].id,.08)}
  const negs=G.pr?G.pr.negs:0;let bounce=.3+randn()*.2;
  if(speech===0){bounce+=.1+Math.min(.35,.12*negs);G.cash+=2}
  else if(speech===1){const base=sd==='D'?['jeu','noi','dip']:['evg','ouv','sen'];base.forEach(g=>H.target(g,.3));G.cash+=3}
  else{G.env+=G.me*.25;bounce+=.05}
  H.img(clamp(bounce,-.2,.8));G.convDone=true;
}
function showConv(){
  if(SIM)return;const c=G.conv;
  if(c.step===0){
    const ord=ISSUES.map((q,i)=>({q,i})).filter(x=>G.pos[side()][x.i]*(side()==='D'?1:-1)<2).sort((a,b)=>G.sal[b.i]-G.sal[a.i]).slice(0,3);
    showModal(`<h2>${t('Convention du parti','Party convention','Convención del partido')}</h2><p>${t('La plateforme du parti se joue en coulisses. Quel combat voulez-vous gagner ? Votre position sur cet enjeu se déplace d’un cran vers la ligne du parti.','The party platform is settled behind the scenes. Which fight do you want to win? Your position on that issue moves one notch toward the party line.','La plataforma del partido se decide entre bastidores. ¿Qué batalla quieres ganar? Tu posición en ese tema se desplaza un punto hacia la línea del partido.')}</p>${ord.map(x=>`<button class="ch" data-act="convplat" data-i="${x.i}"><b>${t(x.q.n)}</b><small>${t(side()==='D'?x.q.hi:x.q.lo)}</small></button>`).join('')}<button class="ch" data-act="convplat" data-i="-1"><b>${t('Rester flou','Stay vague','Mantenerse ambiguo')}</b><small>${t('Aucune position ne bouge','No position moves','Ninguna posición cambia')}</small></button>`);
  }else{
    showModal(`<h2>${t('Discours d’investiture','Acceptance speech','Discurso de aceptación')}</h2><p>${t('Le discours devant la convention donne le ton de l’automne.','The convention speech sets the tone for the fall.','El discurso ante la convención marca el tono del otoño.')}</p>
    <button class="ch" data-act="convspeech" data-i="0"><b>${t('Unité','Unity','Unidad')}</b><small>${t('Répare les dégâts des primaires, +2 M$','Heals primary wounds, +$2M','Repara las heridas de las primarias, +2 M$')}</small></button>
    <button class="ch" data-act="convspeech" data-i="1"><b>${t('Mobiliser la base','Fire up the base','Movilizar a la base')}</b><small>${t('Trois groupes de votre camp, +3 M$','Three groups of your side, +$3M','Tres grupos de tu bando, +3 M$')}</small></button>
    <button class="ch" data-act="convspeech" data-i="2"><b>${t('Tendre la main','Reach across the aisle','Tender la mano')}</b><small>${t('Humeur nationale un peu meilleure','Slightly better national mood','Clima nacional algo mejor')}</small></button>`);
  }
}
Object.assign(A,{
  convplat(x){G.conv.plat=+x.i;G.conv.step=1;save();showConv()},
  convspeech(x){convApply(G.conv.plat,+x.i);G.conv=null;L('news',both(()=>t('La convention vous offre un regain de popularité.','The convention gives you a polling bump.')));const v=VPS[side()].find(q=>q.n===G.vpName)||VPS[side()][0];vpTail(v,ST(G.convOv));}
});
