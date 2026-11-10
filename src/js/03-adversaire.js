/* ---------- Adversaire ---------- */
function oppTurn(){
  const o=-G.me,wl=12-G.wk+1,pub=[];
  G.cashO+=(trO().includes('funds')?1.5:0)+7+(G.diff===0?-.5:G.diff===2?PARAM.oppHard:0)+PARAM.oppIncome+rnd()*3+(pfO()==='moneyed'?1.5:0);
  const ad=PARAM.adapt*[0,.5,1][G.diff],push=s=>clamp(s.adsP/(2+s.ev*.15),0,1.5)+.4*s.fieldP+.3*s.buzzP;
  const sc=G.states.map(s=>{const adv=o*margin(s)+randn()*2;
    return{s,adv,pu:push(s),w:(adv>-14&&adv<9)?valOf(s)*(1+ad*push(s))/(1+Math.pow(Math.max(0,Math.abs(adv)-1)/5,2)):0}}).sort((a,b)=>b.w-a.w);
  const top=sc.slice(0,7).filter(x=>x.w>0),tw=top.reduce((a,x)=>a+x.w,0)||1;
  if(ad>0){const hot=top.filter(x=>x.pu>.7).slice(0,2);if(hot.length)pub.push(both(()=>t(`L’adversaire riposte à votre offensive en ${hot.map(x=>sn(x.s)).join(', ')}.`,`Your opponent hits back at your push in ${hot.map(x=>sn(x.s)).join(', ')}.`)))}
  const pk=pfO(),bm=pk==='careful'?(G.wk>=9?1.35:.88):1,budget=Math.max(0,Math.min(G.cashO-1,G.cashO/wl*1.25*bm));let spent=0;const ads=[];
  top.forEach(x=>{const share=budget*x.w/tw,u=share/adCost(x.s);if(u>.2){x.s.adsO+=u;spent+=share;ads.push([x.s,share])}});
  if(ads.length){ads.sort((a,b)=>b[1]-a[1]);const tot=ads.reduce((a,x)=>a+x[1],0),names=ads.slice(0,3).map(x=>x[0]);
    pub.push(both(()=>t(`Campagne TV adverse (≈ ${fM(tot)}) surtout en ${names.map(sn).join(', ')}.`,`Opposing TV campaign (≈ ${fM(tot)}) mainly in ${names.map(sn).join(', ')}.`)))}
  if(G.wk<=8)top.slice(0,4).forEach(x=>{if(!(pk==='moneyed'&&rnd()<.5)&&!(pk==='attack'&&rnd()<.3)&&x.s.fieldO<2&&G.cashO-spent>fcost(x.s,false)+5){x.s.fieldO++;spent+=fcost(x.s,false);pub.push(both(()=>t(`L’adversaire ouvre un bureau de campagne en ${sn(x.s)}.`,`Your opponent opens a campaign office in ${sn(x.s)}.`)))}});
  const v=top.slice(0,4).sort(()=>rnd()-.5).slice(0,pk==='populist'?3:pk==='careful'?1:2);
  v.forEach(x=>{x.s.buzzO=Math.min(2.4,x.s.buzzO+1.3);spent+=.3;pub.push(both(()=>t(`Meeting de l’adversaire en ${sn(x.s)}.`,`Opponent rally in ${sn(x.s)}.`)))});
  G.cashO=Math.max(0,G.cashO-spent-.08*G.states.reduce((a,s)=>a+s.fieldO*fieldCost(s),0));G.spentO+=spent;
  if(rnd()<.5&&G.cashO-spent>3){let gi=bestGroup(oside(),true);
    if(ad>0&&rnd()<.6*ad){const mx=Math.max(...G.tgtP);if(mx>.5)gi=G.tgtP.indexOf(mx)}G.tgtO[gi]=Math.min(2,G.tgtO[gi]+1);spent+=1.5;if(rnd()<.5)pub.push(both(()=>t(`Campagne de l’adversaire auprès des ${t(GROUPS[gi].n).toLowerCase()}.`,`Opponent outreach to ${t(GROUPS[gi].n).toLowerCase()}.`)))}
  if(G.wk>=8)top.slice(0,3).forEach(x=>{if(x.s.ebO<3&&rnd()<.5&&G.cashO-spent>2){x.s.ebO++;spent+=1.5}});
  spent+=rivalWeek(pub,top);G.cashO=Math.max(0,G.cashO-0);
  if(PARAM.pivotWeeks.includes(G.wk)||(pk==='centrist'&&G.wk>1&&G.wk%3===1))oppPivot(pub);
  else if(pk!=='careful'&&ad>0&&(G.posMoves||0)>(G.posSeen||0)&&rnd()<(pk==='centrist'?.85:.5)*ad){G.posSeen=G.posMoves;oppPivot(pub)}
  pub.forEach(x=>L('opp',x));
}
function bestShift(sd){
  const pos=G.pos[sd].slice();
  const bg=G.states.filter(s=>Math.abs(margin(s))<8),bev=bg.reduce((a,s)=>a+s.ev,0)||1;
  let best=null;
  ISSUES.forEach((is,i)=>[-1,1].forEach(d=>{const np=clamp(pos[i]+d,-2,2);if(np===pos[i])return;
    const tr=pos.slice();tr[i]=np;let g=0;
    bg.forEach(s=>{const a=issueEff(s,sd==='D'?tr:G.pos.D,sd==='R'?tr:G.pos.R),b=issueEff(s,G.pos.D,G.pos.R);g+=(sd==='D'?1:-1)*(a-b)*s.ev});
    g/=bev;const df=sd==='D'?is.dD:is.dR;g-=.25*is.s0*(Math.abs(np-df)-Math.abs(pos[i]-df));
    if(!best||g>best.g)best={i,np,g}}));
  return best;
}
function bestGroup(sd,rr){
  const bg=G.states.filter(s=>Math.abs(margin(s))<8),sc=GROUPS.map((q,gi)=>({gi,v:bg.reduce((a,s)=>a+s.ev*s.mix[gi],0)*(1+Math.max(0,groupPref(gi,sd)))*(1+(rr?rnd()*.4:0))}));
  return sc.sort((a,b)=>b.v-a.v)[0].gi;
}
function oppPivot(pub){
  const osd=oside(),best=bestShift(osd);
  if(best&&best.g>PARAM.pivotMin*(pfO()==='centrist'?.5:1)){G.pos[osd][best.i]=best.np;const nm=ISSUES[best.i].n;pub.push(B(`L’adversaire ajuste sa position sur « ${nm.fr} ».`,`Your opponent adjusts its position on “${nm.en}”.`))}
}
