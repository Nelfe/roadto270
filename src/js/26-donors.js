/* ---------- Donateurs et super PAC ---------- */
// Offers show up in the Actions tab. Money comes with strings: a position shift, an image cost, or a risk of exposure.
// Each deal with strings raises “dependence”; a high dependence makes a lobbying exposé likelier.
const DONORS=[
 {id:'oil',n:B('Lobby de l’énergie fossile','Fossil-fuel lobby','Lobby de la energía fósil'),d:B('7 M$ contre un durcissement de votre position sur le climat.','$7M in exchange for a harder line on climate.','7 M$ a cambio de endurecer tu postura sobre el clima.'),cash:7,pos:['cli','opp'],dep:1},
 {id:'tech',n:B('Mécène de la tech','Tech billionaire','Mecenas tecnológico'),d:B('6 M$ contre une position plus souple sur la régulation de l’IA.','$6M in exchange for a lighter stance on AI regulation.','6 M$ a cambio de una postura más laxa sobre la regulación de la IA.'),cash:6,pos:['ai','opp'],dep:1},
 {id:'wall',n:B('Grands donateurs financiers','Big finance donors','Grandes donantes financieros'),d:B('8 M$ contre un recentrage économique, et une image d’élites (−0,15).','$8M in exchange for an economic shift, and an elitist image (−0.15).','8 M$ a cambio de un giro económico y una imagen elitista (−0,15).'),cash:8,pos:['eco','opp'],img:-.15,dep:1},
 {id:'union',n:B('Syndicats et associations','Unions and advocacy groups','Sindicatos y asociaciones'),d:B('4,5 M$ et des militants dans deux États, contre une position plus tranchée sur le commerce.','$4.5M and volunteers in two states, in exchange for a sharper trade stance.','4,5 M$ y militantes en dos estados, a cambio de una postura más firme sobre comercio.'),cash:4.5,pos:['com','own'],field:2,dep:0},
 {id:'small',n:B('Petits donateurs en ligne','Small online donors','Pequeños donantes en línea'),d:B('Une vague de dons sans condition : de 2 à 5 M$ selon votre image.','A wave of no-strings donations: $2M to $5M depending on your image.','Una ola de donaciones sin condiciones: de 2 a 5 M$ según tu imagen.'),cash:0,small:true,dep:0},
 {id:'pac',n:B('Super PAC allié','Allied super PAC','Super PAC aliado'),d:B('Finance trois semaines de publicités dans vos États clés, mais 20 % de risque de soupçon de coordination (image −0,3).','Funds three weeks of ads in your key states, but a 20% risk of a coordination scandal (image −0.3).','Financia tres semanas de anuncios en tus estados clave, pero con un 20 % de riesgo de escándalo de coordinación (imagen −0,3).'),cash:0,pac:true,dep:.5}
];
function rollDonors(){
  G.donors=(G.donors||[]).filter(x=>x.until>=G.wk);
  if(G.wk>=2&&G.wk<=11&&G.donors.length<3&&rnd()<.55){
    const have=G.donors.map(x=>x.id),pool=DONORS.filter(x=>!have.includes(x.id)&&!(x.id==='pac'&&G.pac&&G.pac.left>0));
    if(pool.length){const D=pickR(pool);G.donors.push({id:D.id,until:G.wk+1});L('news',both(()=>t(`Nouvelle offre : ${t(D.n)}.`,`New offer: ${t(D.n)}.`,`Nueva oferta: ${t(D.n)}.`)))}
  }
  // pac spending
  if(G.pac&&G.pac.left>0){const hot=G.states.filter(s=>Math.abs(margin(s))<6).sort((a,b)=>valOf(b)-valOf(a)).slice(0,4);hot.forEach(s=>{s.tvP+=.55*3.5/Math.max(1,hot.length)});G.pac.left--}
  // exposé
  if((G.dep||0)>=2&&(G.expo||0)<2&&rnd()<.07*G.dep){G.expo=(G.expo||0)+1;H.img(-.35);L('news',B('Un reportage dénonce vos liens avec des lobbies et des gros donateurs.','A report exposes your ties to lobbies and big donors.','Un reportaje denuncia tus vínculos con lobbies y grandes donantes.'))}
}
function posToward(id,how){
  const sd=side(),i=ISSUES.findIndex(q=>q.id===id),own=sd==='D'?ISSUES[i].dD:ISSUES[i].dR,dir=Math.sign(own)||1;
  const np=clamp(G.pos[sd][i]+(how==='own'?dir:-dir),-2,2);if(np!==G.pos[sd][i]){G.pos[sd][i]=np;G.posMoves=(G.posMoves||0)+1}
  return ISSUES[i].n;
}
function donorDo(i,yes){
  const iv=(G.donors||[])[i];if(!iv)return;const D=DONORS.find(x=>x.id===iv.id);
  if(!yes){G.donors.splice(i,1);save();render();return}
  let gain=D.cash;if(D.small)gain=2+3*clamp((G.img*G.me)/1.2,0,1);
  G.cash+=gain;let nm=null;
  if(D.pos)nm=posToward(D.pos[0],D.pos[1]);
  if(D.img)H.img(D.img);
  if(D.field){G.states.filter(s=>Math.abs(margin(s))<5).sort((a,b)=>b.ev-a.ev).slice(0,D.field).forEach(s=>{s.fieldP=Math.min(3,s.fieldP+1)})}
  if(D.pac){G.pac={left:3};if(rnd()<.2){H.img(-.3);L('news',B('Soupçons de coordination avec votre super PAC : la polémique enfle.','Suspicions of coordination with your super PAC: controversy grows.','Sospechas de coordinación con tu super PAC: crece la polémica.'))}}
  G.dep=(G.dep||0)+D.dep;
  L('you',both(()=>t(`Accord : ${t(D.n)}${gain?` (+${fM(gain)})`:''}${nm?` · position « ${t(nm)} » modifiée`:''}.`,`Deal: ${t(D.n)}${gain?` (+${fM(gain)})`:''}${nm?` · position on “${t(nm)}” changed`:''}.`,`Acuerdo: ${t(D.n)}${gain?` (+${fM(gain)})`:''}${nm?` · postura sobre «${t(nm)}» modificada`:''}.`)));
  G.donors.splice(i,1);save();render();
}
function donorHTML(){
  const l=G.donors||[],ok=can();
  return`<div class="panel"><h3 style="font-size:20px">${t('Donateurs et super PAC','Donors and super PACs','Donantes y super PAC')}</h3>`+
  (G.pac&&G.pac.left>0?`<p class="muted" style="margin:6px 0 0;font-size:13px">${t(`Votre super PAC finance encore ${G.pac.left} semaine(s) de publicités.`,`Your super PAC keeps funding ads for ${G.pac.left} more week(s).`,`Tu super PAC sigue financiando anuncios ${G.pac.left} semana(s) más.`)}</p>`:'')+
  ((G.dep||0)>=1?`<p class="muted" style="margin:6px 0 0;font-size:13px">${t('Dépendance aux gros donateurs','Dependence on big donors','Dependencia de grandes donantes')} : <b>${'●'.repeat(Math.min(5,Math.round(G.dep)))}${'○'.repeat(Math.max(0,5-Math.round(G.dep)))}</b> · ${t('plus elle monte, plus un scandale devient probable.','the higher it goes, the likelier a scandal.','cuanto más sube, más probable es un escándalo.')}</p>`:'')+
  (l.length?l.map((iv,i)=>{const D=DONORS.find(x=>x.id===iv.id);return`<div style="margin:10px 0 0;padding-top:10px;border-top:1px solid var(--line)"><b>${t(D.n)}</b> <span class="muted" style="font-size:12px">· ${t(`jusqu’à la semaine ${iv.until}`,`until week ${iv.until}`,`hasta la semana ${iv.until}`)}</span><p class="muted" style="margin:4px 0 8px;font-size:13px">${t(D.d)}</p><div class="irow"><button class="btn sm" data-act="donoryes" data-i="${i}" ${ok?'':'disabled'}><b>${t('Accepter','Accept','Aceptar')}</b></button><button class="btn sm alt" data-act="donorno" data-i="${i}" ${ok?'':'disabled'}><b>${t('Refuser','Decline','Rechazar')}</b></button></div></div>`}).join(''):`<p class="muted" style="margin:6px 0 0;font-size:13px">${t('Aucune offre pour le moment. Elles arrivent au fil des semaines.','No offers right now. They arrive as the weeks go by.','No hay ofertas por ahora. Llegan con las semanas.')}</p>`)+`</div>`;
}
