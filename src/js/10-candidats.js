/* ---------- Candidats générés ---------- */
const FIRSTN={f:['Elena','Naomi','Carla','Joan','Maya','Priya','Rachel','Denise','Lucia','Hannah','Tamara','Grace','Irene','Nadia'],m:['Jack','Daniel','Tomas','Andre','Victor','Ethan','Raymond','Samuel','Julian','Curtis','Owen','Leo','Walter','Felix']};
const LASTN=['Marsh','Holloway','Okafor','Brennan','Castellano','Nakamura','Prescott','Delgado','Hartmann','Abernathy','Voss','Kowalski','Tran','Sutherland','Mbeki','Ferreira','Quinn','Stratton','Alvarez','Mercer','Thorne','Bellamy','Ishikawa','Donnelly'];
const MAYORS=[['Denver','CO'],['Houston','TX'],['Charlotte','NC'],['Phoenix','AZ'],['Cleveland','OH'],['Atlanta','GA'],['Milwaukee','WI'],['Detroit','MI'],['Las Vegas','NV'],['Pittsburgh','PA']];
const ROLES={
 gov:{f:B('Gouverneure','Governor'),m:B('Gouverneur','Governor'),st:1},
 sen:{f:B('Sénatrice','Senator'),m:B('Sénateur','Senator'),st:1},
 rep:{f:B('Députée fédérale','Congresswoman'),m:B('Député fédéral','Congressman'),st:1},
 may:{f:B('Maire','Mayor'),m:B('Maire','Mayor')},
 ceo:{f:B('Entrepreneuse','Entrepreneur'),m:B('Entrepreneur','Entrepreneur'),st:1},
 gen:{f:B('Ancienne générale','Retired general'),m:B('Ancien général','Retired general'),st:1},
 sec:{f:B('Ancienne secrétaire d’État','Former Secretary of State'),m:B('Ancien secrétaire d’État','Former Secretary of State'),st:1}
};
const TRAITS={
 charm:{n:B('Charismatique','Charismatic'),d:B('Image +0,4 en campagne générale.','Image +0.4 in the general election.')},
 funds:{n:B('Collecteur de fonds','Fundraiser'),d:B('+1,5 M$ par semaine, collectes plus fructueuses aux primaires.','+$1.5M per week, stronger fundraising in the primaries.')},
 org:{n:B('Organisateur','Organizer'),d:B('Bureaux de terrain 25 % moins chers, tournées plus efficaces.','Field offices 25% cheaper, more effective tours.')},
 debate:{n:B('Débatteur','Debater'),d:B('+0,3 aux débats.','+0.3 in debates.')},
 home:{n:B('Ancrage local','Home turf'),d:B('+2,5 dans son État d’origine.','+2.5 in its home state.')},
 media:{n:B('Télégénique','Telegenic','Telegénico'),d:B('Publicités télévisées 15 % plus efficaces.','TV ads 15% more effective.','Anuncios de TV un 15 % más eficaces.')},
 frugal:{n:B('Gestionnaire rigoureux','Tight ship','Gestor riguroso'),d:B('+0,5 M$ par semaine et salaires d’équipe −25 %.','+$0.5M per week and staff salaries −25%.','+0,5 M$ por semana y salarios del equipo −25 %.')},
 bridge:{n:B('Rassembleur','Bridge-builder','Conciliador'),d:B('L’indépendant s’effondre plus vite ; +0,1 aux primaires.','The independent fades faster; +0.1 in the primaries.','El independiente se desinfla antes; +0,1 en las primarias.')},
 vet:{n:B('Expérimenté','Seasoned','Veterano'),d:B('Image +0,2 ; +0,15 aux primaires.','Image +0.2; +0.15 in the primaries.','Imagen +0,2; +0,15 en las primarias.')},
 swing:{n:B('Voix des modérés','Voice of moderates','Voz de los moderados'),d:B('+0,6 dans les États serrés (marge de base sous 4 pts).','+0.6 in close states (baseline margin under 4 pts).','+0,6 en estados reñidos (margen base inferior a 4 pts).')},
 youth:{n:B('Idole des jeunes','Youth favorite','Ídolo de los jóvenes'),d:B('Les jeunes électeurs penchent pour vous dès le départ.','Young voters lean your way from the start.','Los jóvenes se inclinan por ti desde el principio.')},
 crisis:{n:B('Gestionnaire de crise','Crisis manager','Gestor de crisis'),d:B('Les tempêtes virales font 30 % moins de dégâts.','Viral storms do 30% less damage.','Las tormentas virales hacen un 30 % menos de daño.')}
};
const WEAKS={
 gaffe:{n:B('Gaffeur','Gaffe-prone'),d:B('Les grandes interviews dérapent plus souvent.','Major interviews slip more often.')},
 scandal:{n:B('Passé encombrant','Baggage'),d:B('Les révélations de dernière minute vous visent plus souvent.','Last-minute revelations hit you more often.')},
 unknown:{n:B('Peu connu','Low name ID'),d:B('Image −0,4 au départ, plus difficile aux primaires.','Image −0.4 at the start, harder in the primaries.')},
 broke:{n:B('Finances brouillonnes','Sloppy books','Cuentas desordenadas'),d:B('−1 M$ par semaine.','−$1M per week.','−1 M$ por semana.')},
 stiff:{n:B('Terne','Stiff on stage','Soso'),d:B('Image −0,25 au départ ; −0,15 aux primaires.','Image −0.25 at the start; −0.15 in the primaries.','Imagen −0,25 al inicio; −0,15 en las primarias.')},
 divisive:{n:B('Clivant','Divisive','Polarizador'),d:B('L’indépendant retient mieux ses électeurs.','The independent holds on to its voters better.','El independiente retiene mejor a sus votantes.')}
};
const pickR=a=>a[Math.floor(rnd()*a.length)];
function genCand(sd,used){
  const g=rnd()<.5?'f':'m';let n;
  do{n=pickR(FIRSTN[g])+' '+pickR(LASTN)}while(used.includes(n));used.push(n);
  const k=pickR(['gov','gov','sen','sen','rep','may','ceo','gen','sec']),sg=sd==='D'?1:-1;
  const okSt=ST_RAW.filter(r=>r[3]*sg>-12&&r[0]!=='DC').map(r=>r[0]);
  let hs,city=null;
  if(k==='may'){const m=pickR(MAYORS.filter(q=>okSt.includes(q[1])||sd==='D'));city=m[0];hs=m[1]}else hs=pickR(okSt);
  const keys=Object.keys(TRAITS),tr=[];
  while(tr.length<2){const q=pickR(keys);if(!tr.includes(q))tr.push(q)}
  return{n,g,k,hs,city,tr,wk:pickR(Object.keys(WEAKS))};
}
const stNameOf=ab=>{const r=ST_RAW.find(q=>q[0]===ab);return FR()?r[1]:LANG==='es'?(ES_NAMES[ab]||r[1]):(EN_NAMES[ab]||r[1])};
const roleTxt=c=>{const R=ROLES[c.k];return t(R[c.g])+(c.city?` · ${c.city}, ${c.hs}`:R.st?` · ${stNameOf(c.hs)}`:'')};
const trP=()=>G.cand?G.cand.tr:[],trO=()=>G.opp?G.opp.tr:[];
const wkP=()=>G.cand?G.cand.wk:null,wkO=()=>G.opp?G.opp.wk:null;
const fcost=(s,mine)=>fieldCost(s)*((mine?trP():trO()).includes('org')?.75:1)*(mine?1-.05*sk('fld'):1);
function applyCand(c,mine){
  if(!c)return;const sg=mine?G.me:-G.me;
  if(c.tr.includes('charm'))G.img+=sg*.4;
  if(c.wk==='unknown')G.img-=sg*.4;
  if(c.wk==='stiff')G.img-=sg*.25;
  if(c.tr.includes('vet'))G.img+=sg*.2;
  if(c.tr.includes('swing'))G.states.forEach(q=>{if(Math.abs(q.lean)<4)q[mine?'vpP':'vpO']+=.6});
  if(c.tr.includes('youth')&&mine)H.target('jeu',.5);
  if(c.tr.includes('home')){const q=ST(c.hs);if(q)q[mine?'vpP':'vpO']+=2.5}
}
function candCard(c,i){
  return`<div class="panel"><h2 style="font-size:26px">${c.n}</h2><span class="muted">${roleTxt(c)}</span>
  <ul class="trl">${c.tr.map(k=>`<li><b style="color:var(--good)">+ ${t(TRAITS[k].n)}</b><br><span class="muted">${t(TRAITS[k].d)}</span></li>`).join('')}<li><b style="color:var(--bad)">− ${t(WEAKS[c.wk].n)}</b><br><span class="muted">${t(WEAKS[c.wk].d)}</span></li></ul>
  ${i!=null?`<button class="btn full" data-act="pickc" data-i="${i}">${t('Choisir ce candidat','Choose this candidate')}</button>`:''}</div>`;
}
const candLine=c=>`${c.n} (${roleTxt(c)}) : ${c.tr.map(k=>t(TRAITS[k].n)).join(', ')} · ${t(WEAKS[c.wk].n)}`;
