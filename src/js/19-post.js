/* ---------- Après le scrutin : recomptage, Cour suprême, électeurs infidèles ---------- */
// Triggered at the end of election night (presidential modes only) when the result is razor-thin.
const COURT={R:.45,D:.18}; // chance a litigant wins in court (6–3 conservative bench): by litigant's party
function pTally(){let d=0,r=0;G.states.forEach(s=>comps(s).forEach((k,i)=>{if(s.final+(s.dn?s.dn[i]:0)>0)d+=k[0];else r+=k[0]}));if(G.fl){d+=G.fl.d||0;r+=G.fl.r||0}
  return{d,r,mine:G.me===1?d:r,theirs:G.me===1?r:d}}
function pDecisive(maxAbs){
  const T=pTally();let best=null;
  G.states.forEach(s=>{if(DIST[s.ab]||Math.abs(s.final)>=maxAbs)return;
    const mineNow=(s.final>0?1:-1)===G.me,after=mineNow?T.mine-s.ev:T.mine+s.ev;
    if((T.mine>=270)!==(after>=270)&&(!best||Math.abs(s.final)<Math.abs(best.final)))best=s});
  return best}
function pois(l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=rnd()}while(p>L&&k<8);return k-1}
// which step comes next (null = nothing more to do)
function pNext(){
  const p=G.post,T=pTally();
  if(!p.rc){const s=pDecisive(.5);if(s)return{k:'rc',ab:s.ab}}
  if(!p.ct){const s=pDecisive(.2);if(s&&p.rc!=='skip')return{k:'ct',ab:s.ab}}
  if(!p.fe&&Math.max(T.d,T.r)<=282&&Math.max(T.d,T.r)>=270)return{k:'fe'};
  return null}
function postPending(){
  if(SIM||G.mode==='mid')return false;
  if(!G.post){G.post={log:[],cur:null,rc:0,ct:0,fe:0,fin:false}}
  const p=G.post;if(p.fin)return false;
  if(!p.cur){const n=pNext();if(!n){
      // cosmetic: a stray faithless elector
      if(!p.fe&&rnd()<.25){const k=1+(rnd()<.3?1:0);p.log.push(B(`${k} grand(s) électeur(s) rompent la consigne de leur État, sans conséquence sur le résultat.`,`${k} elector${k>1?'s':''} break${k>1?'':'s'} with their state’s vote, with no effect on the outcome.`,`${k} elector${k>1?'es':''} rompe${k>1?'n':''} con el voto de su estado, sin consecuencias para el resultado.`));p.fe=1}
      p.fin=true;return false}p.cur=n}
  return true}
function pWho(s){const mineNow=(s.final>0?1:-1)===G.me;return{defending:mineNow,dir:mineNow?-G.me:G.me}} // dir = direction (D=+1) of the challenger
function showPost(){
  const p=G.post,c=p.cur,title=t('Après le scrutin','After election night','Después del escrutinio');
  let h=`<h2>${title}</h2>`;
  if(c.res){showModal(h+`<div class="res">${t(c.res)}</div><button class="btn full" data-act="postnext">${t('Continuer','Continue','Continuar')}</button>`);return}
  const ch=(i,a,b,cost)=>`<button class="ch" data-act="postch" data-i="${i}"><b>${t(a)}</b><small>${t(b)}${cost?' · '+fm0(cost):''}</small></button>`;
  if(c.k==='rc'){const s=ST(c.ab),w=pWho(s);
    h+=`<p>${t(`${sn(s)} se joue à ${f1(Math.abs(s.final))} point d’écart et ce seul État décide de la présidence. Le recomptage automatique est ouvert.`,`${sn(s)} is within ${f1(Math.abs(s.final))} points, and that one state decides the presidency. An automatic recount is under way.`,`${sn(s)} se decide por ${f1(Math.abs(s.final))} puntos y ese único estado define la presidencia. Se abre un recuento automático.`)}</p>`;
    h+=w.defending?ch(0,B('Rester calme','Stay calm','Mantener la calma'),B('Le décompte suit son cours','The count runs its course','El recuento sigue su curso'))+ch(1,B('Équipe juridique','Legal defense','Equipo jurídico'),B('Limite les basculements','Limits swings against you','Limita los vuelcos en tu contra'),3)
      :ch(0,B('Reconnaître la défaite','Concede','Reconocer la derrota'),B('Fin de l’histoire','Case closed','Caso cerrado'))+ch(1,B('Demander un recomptage','Request a recount','Pedir un recuento'),B('Chances modestes','Modest odds','Posibilidades modestas'),2)+ch(2,B('Offensive totale','All-out challenge','Ofensiva total'),B('Meilleures chances','Best odds','Mejores posibilidades'),6)}
  else if(c.k==='ct'){const s=ST(c.ab),w=pWho(s);
    h+=`<p>${t(`Le recomptage ne tranche pas : ${sn(s)} reste à ${f1(Math.abs(s.final))} point. La contestation arrive devant la Cour suprême (6 juges conservateurs contre 3).`,`The recount settles nothing: ${sn(s)} stays within ${f1(Math.abs(s.final))} point. The dispute lands before the Supreme Court (6 conservative justices to 3).`,`El recuento no resuelve nada: ${sn(s)} sigue a ${f1(Math.abs(s.final))} punto. La disputa llega a la Corte Suprema (6 jueces conservadores contra 3).`)}</p>`;
    h+=w.defending?ch(0,B('Laisser la Cour trancher','Let the Court rule','Dejar que la Corte decida'),B('Sans renfort','No extra help','Sin refuerzos'))+ch(1,B('Mobiliser les meilleurs avocats','Bring in top litigators','Reunir a los mejores abogados'),B('Réduit le risque','Reduces the risk','Reduce el riesgo'),4)
      :ch(0,B('Renoncer','Drop it','Renunciar'),B('Accepter le résultat','Accept the result','Aceptar el resultado'))+ch(1,B('Saisir la Cour','Take it to court','Acudir a la Corte'),B('Pari judiciaire','A legal gamble','Una apuesta judicial'),4)}
  else{const T=pTally(),win=T.mine>=270;
    h+=`<p>${win?t(`Votre avance tient à ${T.mine-269} grand(s) électeur(s) : l’adversaire fait pression sur les électeurs de votre camp avant le vote du collège.`,`Your lead rests on ${T.mine-269} electoral vote${T.mine-269>1?'s':''}: your opponent is pressuring your electors before the college votes.`,`Tu ventaja depende de ${T.mine-269} voto${T.mine-269>1?'s':''} electoral${T.mine-269>1?'es':''}: tu rival presiona a tus electores antes de la votación del colegio.`):t('L’écart est de quelques grands électeurs : des électeurs adverses pourraient rompre la consigne.','The gap is a handful of electoral votes: some opposing electors might break ranks.','La diferencia es de unos pocos votos electorales: algunos electores rivales podrían romper la disciplina.')}</p>`;
    h+=win?ch(0,B('Laisser faire','Do nothing','No hacer nada'),B('Risque de défections','Risk of defections','Riesgo de deserciones'))+ch(1,B('Verrouiller vos électeurs','Lock down your electors','Blindar a tus electores'),B('Limite les défections','Limits defections','Limita las deserciones'),3)
      :ch(0,B('Laisser le collège voter','Let the college vote','Dejar que vote el colegio'),B('Rien de plus à faire','Nothing more to do','Nada más que hacer'))+ch(1,B('Courtiser les électeurs adverses','Lobby opposing electors','Cortejar a electores rivales'),B('Zone grise, résultat incertain','Gray area, uncertain payoff','Zona gris, resultado incierto'),4)}
  showModal(h);
}
A.postch=function(x){
  const p=G.post,c=p.cur,i=+x.i,T0=pTally();
  if(c.k==='rc'){const s=ST(c.ab),w=pWho(s);p.rc=1;let res;
    const cost=w.defending?[0,3][i]:[0,2,6][i];G.cash=Math.max(0,G.cash-cost);
    if(!w.defending&&i===0){res=B('Vous reconnaissez votre défaite.','You concede the race.','Reconoces la derrota.');p.rc='skip'}
    else{
      let sh=randn()*.14+(w.defending?.05:[0,.04,.09][i])+(w.defending?0:.02*sk('leg'));if(w.defending&&i===1&&sh>0)sh*=.5;
      const before=Math.sign(s.final);s.final+=w.dir*sh;const flipped=Math.sign(s.final)!==before;
      if(flipped){if(w.defending){res=B(`Le recomptage fait basculer ${sn(s).replace(/^/,'')} : le résultat s’inverse.`,`The recount flips ${sn(s)}: the result reverses.`,`El recuento vuelca ${sn(s)}: el resultado se invierte.`)}else{res=B(`Le recomptage vous donne ${sn(s)} : le résultat s’inverse en votre faveur !`,`The recount gives you ${sn(s)}: the result flips your way!`,`¡El recuento te da ${sn(s)}: el resultado se invierte a tu favor!`);p.wonRecount=1}}
      else res=B(`Le recomptage confirme le résultat dans ${sn(s)} (écart ${f1(Math.abs(s.final))} point).`,`The recount confirms the result in ${sn(s)} (${f1(Math.abs(s.final))} point margin).`,`El recuento confirma el resultado en ${sn(s)} (diferencia de ${f1(Math.abs(s.final))} punto).`);
      p.rcFlip=flipped}
    c.res=res;p.log.push(res);
  }else if(c.k==='ct'){const s=ST(c.ab),w=pWho(s);p.ct=1;let res;
    G.cash=Math.max(0,G.cash-(w.defending?[0,4][i]:[0,4][i]));
    if(!w.defending&&i===0){res=B('Vous renoncez à contester. Le résultat est acquis.','You drop the challenge. The result stands.','Renuncias a impugnar. El resultado queda firme.')}
    else{
      const chal=w.dir===1?'D':'R';let pr=COURT[chal];if(w.defending&&i===1)pr-=.08;
      if(rnd()<pr){s.final=w.dir*.02;res=w.defending?B(`La Cour suprême donne ${sn(s)} à l’adversaire, 6 voix contre 3. Le résultat bascule.`,`The Supreme Court hands ${sn(s)} to your opponent, 6–3. The result flips.`,`La Corte Suprema le da ${sn(s)} a tu rival, 6 a 3. El resultado se invierte.`):B(`La Cour suprême vous donne raison dans ${sn(s)}, 6 voix contre 3. Le résultat bascule en votre faveur !`,`The Supreme Court rules your way in ${sn(s)}, 6–3. The result flips in your favor!`,`La Corte Suprema te da la razón en ${sn(s)}, por 6 a 3. ¡El resultado se invierte a tu favor!`);p.wonCourt=!w.defending;p.lostCourt=w.defending}
      else res=w.defending?B('La Cour suprême rejette le recours de l’adversaire. Le résultat est confirmé.','The Supreme Court rejects your opponent’s appeal. The result is confirmed.','La Corte Suprema rechaza el recurso de tu rival. El resultado se confirma.'):B('La Cour suprême rejette votre recours. Le résultat est confirmé.','The Supreme Court rejects your appeal. The result is confirmed.','La Corte Suprema rechaza tu recurso. El resultado se confirma.')}
    c.res=res;p.log.push(res);
  }else{
    const win=T0.mine>=270;p.fe=1;G.cash=Math.max(0,G.cash-(i===1?(win?3:4):0));
    const lam=win?(i===1?.3:1.0):(i===1?1.0:0);let k=lam?pois(lam):0;
    const gap=win?T0.mine-269:269-T0.mine+1;k=Math.min(k,6);
    let res;
    if(!k)res=B('Aucun électeur ne rompt la consigne. Le collège confirme le résultat.','No elector breaks ranks. The college confirms the result.','Ningún elector rompe la disciplina. El colegio confirma el resultado.');
    else{
      // k electors move from the leader to the other side
      const leaderD=T0.d>T0.r;G.fl=G.fl||{d:0,r:0};if(leaderD){G.fl.d-=k;G.fl.r+=k}else{G.fl.r-=k;G.fl.d+=k}
      const T1=pTally(),rev=(T1.mine>=270)!==(T0.mine>=270);
      res=B(`${k} grand(s) électeur(s) rompent la consigne.${rev?' Le résultat s’inverse !':' Le résultat tient.'}`,`${k} elector${k>1?'s':''} break${k>1?'':'s'} ranks.${rev?' The result reverses!':' The result holds.'}`,`${k} elector${k>1?'es':''} rompe${k>1?'n':''} la disciplina.${rev?' ¡El resultado se invierte!':' El resultado se mantiene.'}`);
      if(rev&&!win)p.wonFE=1}
    c.res=res;p.log.push(res);
  }
  save();showPost();
};
A.postnext=function(){const p=G.post;p.cur=null;save();if(postPending())showPost();else nightTick()};
