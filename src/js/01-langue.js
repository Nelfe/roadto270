/* ---------- Langue ---------- */
let LANG='en';
try{const l=localStorage.getItem('cap270.lang');if(l==='fr'||l==='en'||l==='es')LANG=l}catch(e){}
const FR=()=>LANG==='fr';
const COMMA=()=>LANG!=='en'; // decimal comma, “M$” amounts (fr, es)
const ONEA=()=>t('1 action','1 action','1 acción');
let SET={cb:0,txt:0,vib:1,tel:0,snd:1,mus:0,anim:1,nohint:0};
try{Object.assign(SET,JSON.parse(localStorage.getItem('cap270.set')||'{}'))}catch(e){}
function applySet(){const r=document.documentElement;r.dataset.anim=SET.anim?'1':'0';r.dataset.cb=SET.cb?'1':'0';r.style.zoom=[1,1.12,1.25][SET.txt]||1}
const B=(fr,en,es)=>({fr,en,es});
const t=(a,b,c)=>b===undefined?(a&&typeof a==='object'?(a[LANG]??a.en):a):(LANG==='fr'?a:LANG==='es'?(c??b):b);
const both=fn=>{const o=LANG;LANG='fr';const a=fn();LANG='en';const b=fn();LANG='es';const c=fn();LANG=o;return B(a,b,c)};
const f1=x=>{const s=x.toFixed(1);return COMMA()?s.replace('.',','):s};
const fS=x=>(x>=0?'+':'−')+f1(Math.abs(x));
const fM=x=>COMMA()?f1(x)+' M$':'$'+f1(x)+'M';
const fm0=x=>{const s=Number.isInteger(x)?String(x):f1(x);return COMMA()?s+' M$':'$'+s+'M'};
const pct=s=>COMMA()?s+' %':s+'%';
const fD=m=>(m>=0?'D+':'R+')+f1(Math.abs(m));

const ISSUES=[
 {id:'eco',n:B('Économie & inflation','Economy & inflation'),lo:B('Baisses d’impôts, dérégulation','Tax cuts, deregulation'),hi:B('Redistribution, plus d’État','Redistribution, bigger government'),own:-.3,s0:1.0,dD:1,dR:-1},
 {id:'imm',n:B('Immigration','Immigration'),lo:B('Fermeté aux frontières','Tougher borders'),hi:B('Voies de régularisation','Paths to legal status'),own:-.5,s0:.8,dD:1,dR:-2},
 {id:'san',n:B('Santé','Health care'),lo:B('Marché et assurances privées','Market and private insurance'),hi:B('Assurance publique élargie','Expanded public insurance'),own:.7,s0:.55,dD:2,dR:-1},
 {id:'avo',n:B('Avortement','Abortion'),lo:B('Restrictions','Restrictions'),hi:B('Droit protégé au niveau fédéral','Federally protected right'),own:.5,s0:.5,dD:2,dR:-2},
 {id:'sec',n:B('Sécurité & police','Crime & policing'),lo:B('Fermeté, répression','Tough enforcement'),hi:B('Réformes, prévention','Reform and prevention'),own:-.5,s0:.5,dD:1,dR:-1},
 {id:'cli',n:B('Climat & énergie','Climate & energy'),lo:B('Priorité aux énergies fossiles','Fossil fuels first'),hi:B('Transition accélérée','Faster transition'),own:.4,s0:.35,dD:1,dR:-2},
 {id:'com',n:B('Commerce & alliances','Trade & alliances'),lo:B('« L’Amérique d’abord », droits de douane','“America First”, tariffs'),hi:B('Alliances et libre-échange','Alliances and free trade'),own:0,s0:.35,dD:1,dR:-1},
 {id:'edu',n:B('Éducation & coût des études','Education & college costs'),lo:B('Libre choix de l’école, marché','School choice, market reforms'),hi:B('Financement public, dette étudiante allégée','Public funding, student debt relief'),own:.3,s0:.4,dD:1,dR:-1},
 {id:'ai',n:B('Technologie & IA','Technology & AI'),lo:B('Régulation légère, innovation d’abord','Light regulation, innovation first'),hi:B('Encadrement strict, protection des salariés','Strict rules, worker protections'),own:0,s0:.25,dD:1,dR:0},
 {id:'def',n:B('Défense & politique étrangère','Defense & foreign policy'),lo:B('Retrait, moins d’engagements','Restraint, fewer commitments'),hi:B('Alliances fortes, présence mondiale','Strong alliances, global presence'),own:-.2,s0:.35,dD:1,dR:-1},
];
const S0=ISSUES.map(i=>i.s0);
// ab, nom, grands électeurs, marge de fond (D+), ligne, colonne, tags
const sn=s=>FR()?s.name:LANG==='es'?(ES_NAMES[s.ab]||s.name):(EN_NAMES[s.ab]||s.name);

const GROUPS=[
 {id:'ouv',n:B('Classes populaires','Working class'),d:B('Ouvriers et employés sans diplôme supérieur','Workers and employees without a college degree'),ideal:[.5,-1.2,.8,-.3,-.8,-.8,-1,0.2,0.8,-0.6],w:[1.3,1.1,.8,.6,1,.6,1.2,0.6,0.9,0.6]},
 {id:'dip',n:B('Diplômés','College graduates'),d:B('Cadres, professions intellectuelles, banlieues aisées','Managers, professionals, affluent suburbs'),ideal:[.3,1.2,1,1.6,.5,1.4,1,1.2,0.4,0.8],w:[.8,.8,.9,1.3,.6,1.3,.9,1,0.8,0.9]},
 {id:'sen',n:B('Seniors','Seniors'),d:B('65 ans et plus, attachés à Medicare et aux retraites','Ages 65 and up, attached to Medicare and pensions'),ideal:[0,-.5,1.5,-.2,-.6,-.2,0,0,0.5,0.6],w:[1,.9,1.6,.6,1,.5,.6,0.3,0.5,1]},
 {id:'jeu',n:B('Jeunes','Young voters'),d:B('18 à 29 ans, étudiants et premiers emplois','Ages 18 to 29, students and first jobs'),ideal:[1,1,1.1,1.5,.6,1.5,.5,1.5,0.6,-0.2],w:[1.1,.6,.8,1.3,.6,1.4,.4,1.5,0.9,0.7]},
 {id:'lat',n:B('Latinos','Latino voters'),d:B('Électorat hispanique, très divers selon les États','Hispanic electorate, very diverse across states'),ideal:[.6,.3,1,.4,-.2,.3,-.2,0.8,0.5,0],w:[1.4,1.1,.9,.7,.8,.5,.5,0.8,0.6,0.5]},
 {id:'noi',n:B('Électorat noir','Black voters'),d:B('Très mobilisé localement, sensible à la sécurité et à la santé','Highly mobilized locally, sensitive to policing and health care'),ideal:[1,.7,1.3,.8,.8,.5,.2,1,0.6,-0.2],w:[1.2,.5,1.1,.8,1.4,.5,.4,0.9,0.6,0.5]},
 {id:'evg',n:B('Évangéliques et ruraux','Evangelicals & rural'),d:B('Communautés religieuses et zones rurales','Religious communities and rural areas'),ideal:[-.6,-1.5,-.5,-1.7,-1,-1.2,-.6,-1,0.3,0.2],w:[.8,1.1,.5,1.6,1,.4,.6,0.9,0.5,0.8]},
];
const DW=[.7,1.4,.5,1.8,1.1,1.2,.5],RW=[1.1,.6,1.2,.5,1,1.4,1.6],EARLY=[.45,.6,.8,.3,.4,.45,.5];
const TURN=[.52,.78,.85,.38,.45,.55,.68]; // turnout propensity by group (low-propensity groups react more to field work and to turnout swings)
const REG={ME:'NE',NH:'NE',VT:'NE',MA:'NE',RI:'NE',CT:'NE',NY:'NE',NJ:'NE',PA:'NE',DE:'NE',MD:'NE',DC:'NE',VA:'SE',NC:'SE',SC:'SE',GA:'SE',FL:'SE',AL:'SE',MS:'SE',TN:'SE',KY:'SE',WV:'SE',AR:'SE',LA:'SE',OH:'MW',MI:'MW',IN:'MW',IL:'MW',WI:'MW',MN:'MW',IA:'MW',MO:'MW',TX:'SW',OK:'SW',NM:'SW',AZ:'SW',NV:'SW',CA:'W',OR:'W',WA:'W',HI:'W',AK:'W',ID:'PL',MT:'PL',WY:'PL',UT:'PL',CO:'PL',ND:'PL',SD:'PL',NE:'PL',KS:'PL'};
const REGN={NE:B('le Nord-Est','the Northeast','el Noreste'),SE:B('le Sud','the South','el Sur'),MW:B('le Midwest','the Midwest','el Medio Oeste'),SW:B('le Sud-Ouest','the Southwest','el Suroeste'),W:B('la côte Ouest','the West Coast','la costa Oeste'),PL:B('les Plaines et les Rocheuses','the Plains and Mountain West','las Planicies y las Rocosas')};
const DIST={ME:[[2,0,''],[1,8,'ME-1'],[1,-16,'ME-2']],NE:[[2,0,''],[1,8,'NE-1'],[1,25,'NE-2'],[1,-38,'NE-3']]};
const comps=s=>DIST[s.ab]||[[s.ev,0,'']];

const HOLD={D:34,R:31};
const PHI=x=>{const q=1/(1+.2316419*Math.abs(x)),d=.3989423*Math.exp(-x*x/2),pp=d*q*(.3193815+q*(-.3565638+q*(1.781478+q*(-1.821256+q*1.330274))));return x>0?1-pp:pp};
const senAdj=s=>s.sen?(s.sen==='D'?1.5:-1.5)+s.sq:0;
const valOf=s=>G.mode==='mid'?s.hs+(s.sen?6:0)+1:s.ev;
function midInit(){
  G.cands=[];G.opp=null;G.cand=null;G.third=null;G.phase='vp';
  G.states.forEach(s=>{s.hs=HSEATS[s.ab]||0;s.sen=SEN_UP[s.ab]||null;s.dz=Array.from({length:s.hs},()=>randn()*10);s.sq=s.sen?randn()*2.5:0});
  seedGerry();
  let lo=-15,hi=15;for(let i=0;i<30;i++){const K=(lo+hi)/2;let e=0;G.states.forEach(s=>s.dz.forEach(z=>e+=PHI((s.lean+K+z+(s.gm||0))/3.5)));if(e>PARAM.midBase)hi=K;else lo=K}
  G.HK=(lo+hi)/2-PARAM.neutral;
}
function projMid(){
  const H=[0,0,0,0,0],S=[0,0,0,0,0];let eH=0,eS=0;
  const cat=(p,a)=>{a[p>=4?0:p>=1.5?1:p>-1.5?2:p>-4?3:4]++};
  G.states.forEach(s=>{const pl=pollOf(s);
    s.dz.forEach(z=>{const m=pl+G.HK+z+(s.gm||0);eH+=PHI(G.me*m/3.5);cat(G.me*m,H)});
    if(s.sen){const m=pl+senAdj(s);eS+=PHI(G.me*m/3.2);cat(G.me*m,S)}});
  S[0]+=HOLD[side()];S[4]+=HOLD[oside()];
  return{H,S,youH:Math.round(eH),youS:Math.round(HOLD[side()]+eS)};
}
function midResult(){
  let hD=0,sD=HOLD.D;G.states.forEach(s=>{hD+=s.hD;if(s.sen&&s.sD==='D')sD++});
  const sCtl=sD>50?'D':sD<50?'R':G.inc;
  return{hD,hR:435-hD,sD,sR:100-sD,hCtl:hD>=218?'D':'R',sCtl};
}
const CHC={tv:1,dig:.8,rad:.5};
const chPow=(s,c)=>c==='dig'?s.fd*.95*(1+.08*sk('dig')):c==='rad'?.55*s.fr:1;
const GCOL=['hsl(28 62% 48%)','hsl(200 56% 45%)','hsl(268 40% 56%)','hsl(150 48% 38%)','hsl(46 76% 48%)','hsl(338 52% 50%)','hsl(95 40% 38%)'];
const PARAM={prep:.25,pivotWeeks:[3,6,9],kIss:1.0,neutral:2.6,income:7,pivotMin:.2,oppIncome:3.5,oppHard:1.2,tgtCoef:4,adapt:1,midEnv:2.4,midBase:226,pk:1.5,adG:.35,adG2:.2,rivM:.22,rivR:.25,dec:.65,pcash:24};
let SIM=false;
let G=null,UI={tab:'map',sel:null,night:null};
try{UI.skipPrim=!!localStorage.getItem('cap270.skipPrim')}catch(e){}
const KEY='cap270.save.v4',slotKey=n=>KEY+'.'+n;
const ST=ab=>G.states.find(s=>s.ab===ab);
const side=()=>G.me===1?'D':'R', oside=()=>G.me===1?'R':'D';
function save(){if(SIM||!G)return;G.rs=_s;G.t=Date.now();try{localStorage.setItem(slotKey(G.slot),JSON.stringify(G))}catch(e){}}
function loadSaves(){
  try{const leg=localStorage.getItem(KEY);if(leg){if(!localStorage.getItem(slotKey(1)))localStorage.setItem(slotKey(1),leg);localStorage.removeItem(KEY)}}catch(e){}
  const out=[];for(let n=1;n<=3;n++){try{const r=localStorage.getItem(slotKey(n));if(r){const o=JSON.parse(r);o.slot=n;out.push(o)}}catch(e){}}return out}
function dropSave(n){try{localStorage.removeItem(slotKey(n))}catch(e){}}
function pickSlot(){const ss=loadSaves();for(let n=1;n<=3;n++)if(!ss.find(q=>q.slot===n))return n;return ss.sort((a,b)=>(a.t||0)-(b.t||0))[0].slot}
function copyText(x){try{navigator.clipboard.writeText(x).then(()=>toast(t('Copié','Copied')),()=>toast(x))}catch(e){toast(x)}}
function mkDeck(){const a=EVENTS.filter(e=>!['debate','vpdebate','surprise','third',...Object.values(YEV).flat(),...(G.mode==='mid'?['gaffe','scandal','deepfake','taxes','oldrival','interview']:[]),...(G.scn&&!G.long?['oldrival']:[])].includes(e.id)).map(e=>e.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function snap(){G.hist=G.hist||[];G.hist.push({w:G.wk,y:G.mode==='mid'?projMid().youH:proj().you})}
function L(kind,tx){G.log.unshift({w:G.wk,k:kind,t:tx})}
function toast(msg){if(SIM)return;const e=$('#toast');e.textContent=msg;e.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>e.hidden=true,2200)}
const incName=()=>t(G.inc==='D'?'démocrate':'républicain',G.inc==='D'?'Democratic':'Republican',G.inc==='D'?'demócrata':'republicano');
