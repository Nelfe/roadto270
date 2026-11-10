/* ---------- Modèle ---------- */
function mixOf(s){
  const[b,l]=DEMO[s.ab],tg=s.tags,rem=1-(b+l)/100;
  let evg=tg.includes('evang')?.34:tg.includes('ag')?.2:.12;if(s.ab==='UT')evg=.35;
  const dip=(tg.includes('urban')?.3:.2)+(s.lean>10?.05:0)-(s.lean<-25?.04:0);
  const sen=tg.includes('retire')?.3:.21,jeu=tg.includes('urban')?.17:.14;
  const ouv=Math.max(.1,1-evg-dip-sen-jeu)*(tg.includes('rust')?1.25:1);
  const k=rem/(evg+dip+sen+jeu+ouv);
  return[ouv*k,dip*k,sen*k,jeu*k,l/100,b/100,evg*k];
}
function adjOf(s){
  const a=ISSUES.map(()=>s.lean/30),tg=s.tags,add=(id,v)=>{a[ISSUES.findIndex(i=>i.id===id)]+=v};
  if(tg.includes('energy'))add('cli',-.6);if(tg.includes('border'))add('imm',-.4);if(tg.includes('rust')){add('com',-.3);add('imm',-.2)}
  return a;
}
function sectorOf(s){const g=s.tags;return g.includes('energy')?t('Énergie','Energy'):g.includes('rust')?t('Industrie','Manufacturing'):g.includes('ag')?t('Agriculture','Agriculture'):g.includes('retire')?t('Retraités et tourisme','Retirees & tourism'):g.includes('urban')?t('Services et technologies','Services & technology'):t('Services','Services')}
const ecoOf=s=>s.eco0+s.beta*G.econ*.5+s.shock;
const unemp=s=>clamp(4.2-.55*ecoOf(s)+(s.tags.includes('rust')?.3:0),2.4,8);
const econSign=()=>G.inc==='D'?1:-1;
function tgtEff(s){let x=0;for(let g=0;g<GROUPS.length;g++)x+=s.mix[g]*(G.tgtP[g]-G.tgtO[g]);return PARAM.tgtCoef*G.me*x*(1+.1*sk('mgr'))}
function groupPref(g,sd){
  const m=sd==='D'?G.pos.D:G.pos.R,o=sd==='D'?G.pos.R:G.pos.D,Q=GROUPS[g];let a=0,n=0;
  for(let i=0;i<ISSUES.length;i++){a+=Q.w[i]*G.sal[i]*(Math.abs(o[i]-Q.ideal[i])-Math.abs(m[i]-Q.ideal[i]));n+=Q.w[i]*G.sal[i]}
  return a/n;
}
const adCost=s=>.8+s.ev*.1, fieldCost=s=>1.2+s.ev*.08;
const adsEff=(a,ev)=>3*(1-Math.exp(-a/(2+ev*.15)));
const fieldEff=n=>.55*Math.pow(n,.85);
function dev(sd){const d=ISSUES.map(i=>sd==='D'?i.dD:i.dR);return ISSUES.reduce((a,i,k)=>a+i.s0*Math.abs(G.pos[sd][k]-d[k]),0)}
function ownEff(){return 5*ISSUES.reduce((a,i,k)=>a+(G.sal[k]-i.s0)*i.own,0)}
function issueEff(s,pD,pR){let x=0;
  for(let g=0;g<GROUPS.length;g++){const Q=GROUPS[g];let u=0;
    for(let i=0;i<ISSUES.length;i++){const id=clamp(Q.ideal[i]+s.adj[i],-2,2),I=ISSUES[i];
      u+=Q.w[i]*G.sal[i]*((Math.abs(pR[i]-id)-Math.abs(pD[i]-id))-(Math.abs(I.dR-id)-Math.abs(I.dD-id)))}
    x+=s.mix[g]*u}
  return PARAM.kIss*x}
const PL={pimg:B('Image du parti','Party image'),eb:B('Vote anticipé','Early voting'),third:B('Candidat indépendant','Independent candidate'),base:B('Tendance de fond','Baseline lean'),env:B('Climat national','National mood'),eco:B('Économie locale','Local economy'),iss:B('Positions sur les enjeux','Issue positions'),
  enth:B('Mobilisation de la base','Base turnout'),img:B('Image des candidats','Candidate image'),tgt:B('Ciblage des groupes','Group outreach'),ads:B('Publicité nette','Net advertising'),
  fld:B('Bureaux de terrain','Field offices'),bz:B('Visites et buzz','Visits & buzz'),vp:B('Colistiers','Running mates')};
function parts(s){const me=G.me;return[
 [PL.base,s.lean],[PL.env,G.env+ownEff()],[PL.eco,econSign()*.8*ecoOf(s)],[PL.iss,issueEff(s,G.pos.D,G.pos.R)],
 [PL.enth,-.25*dev('D')+.25*dev('R')],[G.mode==='mid'?PL.pimg:PL.img,G.img],[PL.tgt,tgtEff(s)],
 [PL.ads,me*(adsEff(s.adsP,s.ev)*(1+.06*sk('com'))-adsEff(s.adsO,s.ev))],[PL.fld,me*(fieldEff(s.fieldP)*(1+.1*sk('fld'))-fieldEff(s.fieldO))*(s.fm||1)],
 [PL.eb,me*.55*(s.ebP-s.ebO)*s.ei],[PL.third,thirdEff(s)],
 [PL.bz,me*(s.buzzP-s.buzzO)],[PL.vp,me*(s.vpP-s.vpO)]]}
const margin=s=>parts(s).reduce((a,x)=>a+x[1],0);
const pollOf=s=>margin(s)+G.pbNat+s.pb+s.noise*(1-.2*sk('pol'));

function newGame(me,diff,seed,daily,mode){
  if(typeof UNDO!=='undefined')UNDO.used=0;
  const scn=/^h20/.test(mode||'')?mode.slice(1):null;if(scn)mode='pres';const lng=mode==='long';if(lng)mode='pres';
  if(typeof G!=='undefined'&&G&&G.phase&&G.phase!=='over'&&!G.rec)TEL.send('abandon',{mode:G.scn?'h'+G.scn:G.mode,diff:G.diff,week:G.week,phase:G.phase});
  const sd=seed!=null?seed:Math.floor(Math['random']()*SEEDS);_s=sd>>>0;
  const RPB={},RSH={};['NE','SE','MW','SW','W','PL'].forEach(k=>{RPB[k]=randn()*1.6;RSH[k]=randn()*1.4});
  const states=ST_RAW.map(r=>{const s={ab:r[0],name:r[1],ev:r[2],lean:r[3],r:r[4],c:r[5],tags:r[6]?r[6].split(' '):[],
    adsP:0,adsO:0,tvP:0,dgP:0,raP:0,ebP:0,ebO:0,fieldP:0,fieldO:0,buzzP:0,buzzO:0,vpP:0,vpO:0,pb:RPB[REG[r[0]]||'MW']+randn()*1.2,reg:REG[r[0]]||'MW',noise:randn()*1.2,spP:0,internal:null,shock:0,eco0:randn()*.5};
    const g=s.tags;s.beta=g.includes('energy')?1.4:g.includes('rust')?1.2:g.includes('urban')?.9:g.includes('retire')?.6:g.includes('ag')?.8:1;
    s.mix=mixOf(s);s.tl=s.mix.reduce((a,v,g)=>a+v*(1-TURN[g]),0);s.fm=1+1.2*(s.tl-.42);s.adj=adjOf(s);s.fd=s.mix.reduce((a,v,g)=>a+v*DW[g],0);s.fr=s.mix.reduce((a,v,g)=>a+v*RW[g],0);s.ei=s.mix.reduce((a,v,g)=>a+v*EARLY[g],0)/.5;return s});
  const mid=mode==='mid';
  const inc0=rnd()<.5?'D':'R';
  const raw=(mid?(inc0==='D'?-1:1)*(PARAM.midEnv+randn()*1.4):randn()*(scn?1.0:1.6))+me*({0:1.2,1:0,2:-1.2}[diff]),env=raw+PARAM.neutral+(scn?SCN[scn].env:0);
  const inc=mid?inc0:(raw<0?(rnd()<.7?'D':'R'):(rnd()<.7?'R':'D'));
  G={v:3,mode:mid?'mid':'pres',me,diff,wk:1,ap:3,apNext:0,cash:40+DM.cash[diff],cashO:40+(diff===2?3:0),env,img:0,inc,pbNat:randn()*1.5*DM.nat[diff],sal:S0.slice(),
     econ:clamp(randn()*.8,-2,2),tgtP:GROUPS.map(()=>0),tgtO:GROUPS.map(()=>0),seen:0,
     pos:{D:ISSUES.map(i=>i.dD),R:ISSUES.map(i=>i.dR)},states,prep:0,log:[],used:[],ev:null,phase:'cand',spentP:0,spentO:0,analyst:true,hint:null,vpName:'',seed:sd,daily:daily||null,slot:SIM?1:pickSlot(),t:Date.now(),hist:[],rec:false};
  G.deck=mkDeck();
  {const used=[];G.cands=[0,1,2].map(()=>genCand(me===1?'D':'R',used));G.opp=genCand(me===1?'R':'D',used);G.cand=null;G.pr=null;G.staff={};G.offers=genOffers(used);G.viral=null;G.posMoves=0;
    G.third=rnd()<.7?{name:genNamePick(used),side:pickR(['D','R']),pow:0,on:false,wk:3+Math.floor(rnd()*3)}:null}
  if(mid)midInit();
  G.regSh=RSH;G.tur=randn();
  if(lng)G.long=true;
  if(scn){applyScn(G,scn);G.cand=G.cands[0];G.pr=null;applyCand(G.cand,true);applyCand(G.opp,false);G.cash=PARAM.pcash+4+DM.cash[diff];G.cashO=PARAM.pcash+4+(diff===2?3:0);G.phase='vp'}
  UI={tab:'map',sel:null,night:null};
  save();
}
