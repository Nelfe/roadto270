/* ---------- Invitations médias ---------- */
// Each week 0–1 invitations show up (max 3 open, each valid for 2 weeks). Go yourself (1 action, bigger swing)
// or send a surrogate (free of actions, 0.4 M$, half the effect and half the risk).
const MEDIA=[
 {id:'late',n:B('Talk-show de fin de soirée','Late-night talk show','Programa nocturno de humor'),d:B('Les jeunes adorent, mais l’humoriste peut vous piéger.','Young viewers love it, but the host can trap you.','Los jóvenes lo adoran, pero el presentador puede tenderte una trampa.'),g:[['jeu',.4]],img:.2,risk:.25,loss:.3},
 {id:'pod',n:B('Podcast très écouté','Hit podcast','Pódcast muy escuchado'),d:B('Long format décontracté : bon pour les classes populaires et les jeunes.','Long, relaxed format: good for working-class and young voters.','Formato largo y relajado: bueno para clases populares y jóvenes.'),g:[['ouv',.4],['jeu',.2]],img:.15,risk:.2,loss:.25},
 {id:'cable',n:B('Chaîne câblée amicale','Friendly cable channel','Canal por cable afín'),d:B('Public acquis : renforce votre base, sans grand risque.','A friendly audience: firms up your base, low risk.','Audiencia afín: refuerza tu base, con poco riesgo.'),g:[['@base',.5]],img:.1,risk:.08,loss:.15},
 {id:'hostile',n:B('Chaîne câblée hostile','Hostile cable channel','Canal por cable hostil'),d:B('Un duel risqué : si vous tenez bon, les diplômés sont impressionnés.','A risky duel: if you hold your own, college graduates are impressed.','Un duelo arriesgado: si aguantas, los titulados quedan impresionados.'),g:[['dip',.3]],img:.4,risk:.45,loss:.5},
 {id:'local',n:B('Presse locale','Local press','Prensa local'),d:B('Un entretien chez des journalistes locaux : fait monter la rumeur dans un État serré.','A sit-down with local reporters: stirs buzz in a close state.','Una entrevista con periodistas locales: genera rumor en un estado reñido.'),g:[],img:.05,risk:.1,loss:.15,buzz:1.4},
 {id:'sunday',n:B('Émission politique du dimanche','Sunday political show','Programa político del domingo'),d:B('Vous imposez un enjeu dans le débat, mais les questions sont techniques.','You can put an issue on the agenda, but the questions are technical.','Puedes imponer un tema en la agenda, pero las preguntas son técnicas.'),g:[],img:.15,risk:.3,loss:.4,sal:true},
 {id:'radio',n:B('Radio rurale et religieuse','Rural and faith radio','Radio rural y religiosa'),d:B('Atteint les évangéliques, ruraux et seniors ; accueil plus froid pour les démocrates.','Reaches evangelicals, rural voters and seniors; a colder welcome for Democrats.','Llega a evangélicos, rurales y mayores; recibimiento más frío para los demócratas.'),g:[['evg',.5],['sen',.2]],img:.05,risk:.15,loss:.2}
];
function rollMedia(){
  G.media=(G.media||[]).filter(m=>m.until>=G.wk);
  if(G.wk<2||G.wk>11||G.media.length>=3||rnd()>.65)return;
  const have=G.media.map(m=>m.id),pool=MEDIA.filter(m=>!have.includes(m.id)&&!(m.id==='local'&&G.mode==='mid'&&false));
  if(!pool.length)return;const M=pickR(pool);let ab=null;
  if(M.id==='local'){const c=G.states.filter(s=>Math.abs(margin(s))<5).sort((a,b)=>b.ev-a.ev).slice(0,6);if(c.length)ab=pickR(c).ab}
  G.media.push({id:M.id,until:G.wk+1,ab});
  L('news',both(()=>t(`Invitation reçue : ${t(M.n)}.`,`Invitation received: ${t(M.n)}.`,`Invitación recibida: ${t(M.n)}.`)));
}
function mediaDo(i,sur){
  const iv=(G.media||[])[i];if(!iv||!can())return;const M=MEDIA.find(x=>x.id===iv.id);
  if(sur){if(!needCash(.4))return}else if(!needAP(1))return;
  const f=sur?.5:1,riskP=M.risk*(sur?.5:1)-.03*sk('com')+(wkP()==='gaffe'?.1:0)+(M.id==='radio'&&side()==='D'?.15:0);
  const bad=rnd()<riskP;
  if(bad){H.img(-M.loss*(sur?.5:1));L('you',both(()=>t(`${t(M.n)} : dérapage, l’extrait tourne en boucle.`,`${t(M.n)}: a slip-up, the clip goes around in a loop.`,`${t(M.n)}: un desliz, el fragmento se repite sin parar.`)))}
  else{
    H.img(M.img*f);
    M.g.forEach(([g,v])=>H.target(g==='@base'?GROUPS[bestGroup(side(),false)].id:g,v*f));
    if(M.buzz&&iv.ab)H.buzz(iv.ab,M.buzz*f);
    if(M.sal)H.sal(H.best().id,.12*f);
    L('you',both(()=>t(`${t(M.n)} : bien reçue${iv.ab?` (${sn(ST(iv.ab))})`:''}.`,`${t(M.n)}: well received${iv.ab?` (${sn(ST(iv.ab))})`:''}.`,`${t(M.n)}: bien recibida${iv.ab?` (${sn(ST(iv.ab))})`:''}.`)));
  }
  G.media.splice(i,1);save();render();
}
function mediaHTML(){
  const ok=can(),l=G.media||[];
  return`<div class="panel" id="pMedia"><h3 style="font-size:20px">${t('Invitations médias','Media invitations','Invitaciones de medios')}</h3>`+(l.length?l.map((iv,i)=>{const M=MEDIA.find(x=>x.id===iv.id);
   return`<div style="margin:10px 0 0;padding-top:10px;border-top:1px solid var(--line)"><b>${t(M.n)}</b>${iv.ab?` · ${sn(ST(iv.ab))}`:''} <span class="muted" style="font-size:12px">· ${iv.until>=G.wk?t(`jusqu’à la semaine ${iv.until}`,`until week ${iv.until}`,`hasta la semana ${iv.until}`):''}</span><p class="muted" style="margin:4px 0 8px;font-size:13px">${t(M.d)}</p><div class="irow"><button class="btn sm" data-act="mediago" data-i="${i}" ${ok&&G.ap>=1?'':'disabled'}><b>${t('Y aller','Go yourself','Ir en persona')}</b><small>${ONEA()}</small></button><button class="btn sm alt" data-act="mediasur" data-i="${i}" ${ok&&G.cash>=.4?'':'disabled'}><b>${t('Envoyer un porte-parole','Send a surrogate','Enviar a un sustituto')}</b><small>0,4 M$</small></button></div></div>`}).join(''):`<p class="muted" style="margin:6px 0 0;font-size:13px">${t('Aucune invitation pour le moment. Elles arrivent au fil des semaines.','No invitations right now. They arrive as the weeks go by.','No hay invitaciones por ahora. Llegan con las semanas.')}</p>`)+`</div>`;
}
