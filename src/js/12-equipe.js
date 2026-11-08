/* ---------- Équipe, indépendant, médias ---------- */
const STAFF=[
 {id:'mgr',n:B('Directeur de campagne','Campaign manager'),e:B('Ciblage des groupes +10 % par niveau, et 10 % moins cher.','Group targeting +10% per level, and 10% cheaper.')},
 {id:'pol',n:B('Sondeur','Pollster'),e:B('Sondages internes moins chers, sondages publics moins bruités ; dès le niveau 2, estimation du biais des sondages.','Cheaper internal polls, less noisy public polls; from level 2, an estimate of the polling bias.')},
 {id:'fld',n:B('Directeur de terrain','Field director'),e:B('Bureaux de terrain +10 % d’efficacité et 5 % moins chers par niveau.','Field offices 10% more effective and 5% cheaper per level.')},
 {id:'com',n:B('Directeur de la communication','Communications director'),e:B('Publicité +6 % d’efficacité par niveau, interviews plus sûres.','Ads 6% more effective per level, safer interviews.')},
 {id:'fin',n:B('Directeur financier','Finance director'),e:B('+0,5 M$ par collecte et +0,3 M$ par semaine, par niveau.','+$0.5M per fundraiser and +$0.3M per week, per level.')}
];
const SKN=['','I','II','III'];
const sk=id=>G&&G.staff&&G.staff[id]?G.staff[id].sk:0;
const staffCost=()=>Object.values(G.staff||{}).reduce((a,x)=>a+x.sal,0);
const pollCost=()=>1-.2*sk('pol');
function genNamePick(used){let n;do{n=pickR(FIRSTN[rnd()<.5?'f':'m'])+' '+pickR(LASTN)}while(used.includes(n));used.push(n);return n}
function genOffers(used){
  const o={};STAFF.forEach(r=>{o[r.id]=[0,1].map(()=>{const k=pickR([1,1,2,2,2,3]);return{n:genNamePick(used),sk:k,sal:Math.round(([0,.4,.8,1.3][k]+(rnd()-.5)*.2)*10)/10}})});return o}
function teamHTML(){
  const ok=can();
  return`<p class="muted" style="margin:14px 0 8px">${t('Recrutez des cadres pour renforcer la campagne. Chaque recrue coûte une semaine de salaire à l’embauche puis son salaire chaque semaine. Un nouveau recrutement remplace le précédent.','Hire staff to strengthen the campaign. Each hire costs one week of salary up front, then the salary every week. A new hire replaces the previous one.')}</p>
  <div class="kv" style="border:0"><span>${t('Masse salariale','Weekly payroll')}</span><span>${fM(staffCost())}</span></div>`+STAFF.map(r=>{
    const cur=G.staff[r.id];
    return`<div class="panel staff"><h3 style="font-size:20px">${t(r.n)}</h3><p class="muted" style="margin:2px 0 8px;font-size:13px">${t(r.e)}</p>
    ${cur?`<div class="kv" style="border:0"><span><b>${cur.n}</b> · ${t('niveau','level')} ${SKN[cur.sk]}</span><span>${fM(cur.sal)}${t('/sem.','/wk')}</span></div><button class="btn sm alt" data-act="fire" data-r="${r.id}">${t('Licencier','Dismiss')}</button>`:`<p class="muted" style="margin:0 0 6px;font-size:13px">${t('Poste vacant.','Vacant.')}</p>`}
    <div class="pg">${G.offers[r.id].map((o,i)=>`<button class="btn sm" data-act="hire" data-r="${r.id}" data-i="${i}" ${ok&&!(cur&&cur.n===o.n)&&G.cash>=o.sal?'':'disabled'}><b>${o.n}</b><small>${t('Niveau','Level')} ${SKN[o.sk]} · ${fM(o.sal)}${t('/sem.','/wk')}</small></button>`).join('')}</div></div>`}).join('');
}
function thirdEff(s){
  const T=G.third;if(!T||!T.on||G.mode==='mid')return 0;
  const f=T.side==='D'?(s.mix[1]+s.mix[3])/.31:(s.mix[6]+s.mix[0])/.5;
  return(T.side==='D'?-1:1)*T.pow*f*.9;
}
function thirdHTML(){
  const T=G.third;if(!T||!T.on)return'';
  const hurt=T.side===side(),ok=can();
  return`<div class="panel"><h3 style="font-size:20px">${t('Candidat indépendant','Independent candidate')}</h3><p style="margin:6px 0 0">${T.name} · ${t('attire surtout des électeurs','draws mostly')} ${T.side==='D'?t('démocrates','Democratic'):t('républicains','Republican')}${t('',' voters')}. <b>${hurt?t('Cela vous coûte','This costs you'):t('Cela vous profite','This helps you')}</b>.</p><p class="muted" style="margin:4px 0 8px;font-size:13px">${t('Poids actuel','Current weight')} : <span class="mono">${f1(T.pow)}</span> ${t('point(s), en baisse à l’approche du vote','point(s), fading toward election day')}.</p>
  ${hurt?`<button class="btn sm" data-act="usefulvote" ${ok&&T.pow>.2?'':'disabled'}>${t('Appeler au vote utile','Urge strategic voting')}<small>1 action</small></button>`:''}</div>`;
}
const VIR=[
 {v:-.35,t:B('Un ancien message de votre campagne ressurgit et circule en boucle.','An old post from your campaign resurfaces and circulates in a loop.')},
 {v:-.3,t:B('Une vidéo de meeting montre un incident et devient virale.','A rally video shows an incident and goes viral.')},
 {v:-.3,t:B('Un partisan tient des propos choquants en votre nom.','A supporter says something shocking in your name.')},
 {v:-.3,t:B('Une vidéo de l’adversaire fait un carton sur les réseaux.','A video from your opponent is a hit on social media.')},
 {v:.3,t:B('Un moment sincère de votre campagne devient viral.','A heartfelt moment from your campaign goes viral.')},
 {v:.3,t:B('Une électrice vous interpelle et votre réponse est saluée.','A voter challenges you and your answer is praised.')},
 {v:.35,t:B('Une phrase de l’adversaire est détournée en mème.','A line from your opponent is turned into a meme.')},
 {v:.3,t:B('L’adversaire gaffe en direct lors d’un événement.','Your opponent stumbles live at an event.')}
];
function rollViral(){if(rnd()<.45){const q=pickR(VIR);G.viral={t:q.t,v:q.v,resp:false}}else G.viral=null}
function applyViral(){
  const V=G.viral;if(!V)return;
  const k=V.resp?(V.v<0?.35:1.6):1,v=V.v*k;H.img(v);
  L('news',both(()=>t(`${t(V.t)} ${v>0?'(effet favorable)':'(effet défavorable)'}`,`${t(V.t)} ${v>0?'(favorable effect)':'(unfavorable effect)'}`)));
  G.viral=null;
}
function viralHTML(){
  const V=G.viral;if(!V)return'';
  return`<div class="panel" style="border-left:4px solid var(--gold)"><h3 style="font-size:20px">${t('Polémique sur les réseaux','Social media storm')}</h3><p style="margin:6px 0 8px">${t(V.t)}</p><p class="muted" style="margin:0 0 8px;font-size:13px">${V.v<0?t('Réagir limite les dégâts.','Responding limits the damage.'):t('Réagir amplifie l’effet favorable.','Responding amplifies the favorable effect.')}</p><button class="btn sm" data-act="viral" ${can()&&!V.resp?'':'disabled'}>${V.resp?t('Réaction lancée','Response sent'):t('Réagir','Respond')}<small>${V.resp?'':'1 action'}</small></button></div>`;
}
