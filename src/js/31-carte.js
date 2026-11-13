/* ---------- Profondeur de la carte : districts ME/NE, Chambre par district, redécoupage ---------- */
const dsv=(s,k)=>(s.ds&&s.ds[k[2]])||0;
function distCampaign(code){
  if(!can())return;const s=G.states.find(q=>DIST[q.ab]&&comps(q).some(k=>k[2]===code));if(!s)return;
  if(G.ap<1){noAP();return}if(!needCash(2))return;
  G.ap--;s.ds=s.ds||{};s.ds[code]=clamp((s.ds[code]||0)+G.me*1.1,-4,4);
  L('you',both(()=>t(`Campagne ciblée dans le district ${code}.`,`Targeted campaign in district ${code}.`,`Campaña dirigida en el distrito ${code}.`)));
  save();render();
}
function distRowHTML(s){
  if(!DIST[s.ab]||G.mode==='mid')return'';
  return`<div class="irow" style="margin:4px 0 0">${comps(s).slice(1).map(c=>`<button class="btn sm alt" data-act="dist" data-code="${c[2]}" ${can()&&G.ap>=1?'':'disabled'}>${t('Cibler','Target','Dirigir')} ${c[2]}<small>${ONEA()} · ${fm0(2)}</small></button>`).join('')}</div>`;
}
function chipsHTML(s){ // Chambre district par district (mode midterms)
  if(G.mode!=='mid'||!s.hs)return'';
  const pl=pollOf(s),L2=s.dz.map(z=>G.me*(pl+G.HK+z+(s.gm||0))).sort((a,b)=>b-a);
  const col=m=>m>=4?`background:${myC()}`:m>=1.5?`background:${myC()};opacity:.55`:m>-1.5?'background:var(--tu)':m>-4?`background:${opC()};opacity:.55`:`background:${opC()}`;
  return`<div style="display:flex;flex-wrap:wrap;gap:2px;margin:4px 0 0" role="img" aria-label="${t('Districts de la Chambre','House districts','Distritos de la Cámara')}">${L2.map(m=>`<i style="display:inline-block;width:11px;height:11px;border-radius:2px;${col(m)}"></i>`).join('')}</div>${s.gm?`<p class="muted" style="margin:2px 0 0;font-size:12px">${t('Circonscriptions redessinées en faveur du camp','Districts redrawn in favor of','Distritos redibujados a favor de')} ${s.gm>0?'D':'R'}.</p>`:''}`;
}
// redécoupage : déjà en place pour certains États au départ ; vous pouvez en redessiner quelques-uns tôt dans la campagne
function seedGerry(){
  const big=G.states.filter(s=>s.hs>=8).sort(()=>rnd()-.5).slice(0,5);
  big.forEach(s=>{s.gm=(s.lean>=0?1:-1)*2.5})
}
const rdOk=s=>G.mode==='mid'&&s.hs>=5&&G.me*s.lean>1&&!s.gm&&(G.rd||0)<2&&G.wk<=4;
const rdCost=s=>Math.round((3+s.hs*.3)*10)/10;
function redistHTML(){
  if(G.mode!=='mid')return'';
  const list=G.states.filter(rdOk).sort((a,b)=>b.hs-a.hs).slice(0,4),done=G.states.filter(s=>s.gm&&G.me*s.gm>0&&s.gmMine).length;
  return`<div class="panel" id="pRedist"><h3 style="font-size:20px">${t('Redécoupage électoral','Redistricting','Redistribución de distritos')}</h3><p class="muted" style="font-size:13px;margin:0 0 6px">${t('Dans les États où votre camp tient la législature, vous pouvez redessiner les circonscriptions : plus de sièges pour les mêmes voix. Seulement avant la semaine 5, deux États au plus, et la justice peut annuler la carte.','In states where your side runs the legislature you can redraw districts: more seats for the same votes. Only before week 5, two states at most, and courts can strike the map down.','En los estados donde tu bando controla la legislatura puedes redibujar los distritos: más escaños con los mismos votos. Solo antes de la semana 5, dos estados como máximo, y los tribunales pueden anular el mapa.')}</p>
  ${list.length?list.map(s=>`<div class="irow" style="margin:4px 0"><button class="btn sm alt" data-act="redraw" data-ab="${s.ab}" ${can()&&G.ap>=1&&G.cash>=rdCost(s)?'':'disabled'}>${sn(s)} · ${s.hs} ${t('sièges','seats','escaños')}<small>${ONEA()} · ${fM(rdCost(s))}</small></button></div>`).join(''):`<p class="muted" style="font-size:13px;margin:0">${(G.rd||0)>=2||G.wk>4?t('Plus de carte à redessiner.','No more maps to redraw.','No quedan mapas por redibujar.'):t('Aucun État éligible.','No eligible state.','Ningún estado elegible.')}</p>`}</div>`;
}
function redraw(ab){
  if(!can())return;const s=ST(ab);if(!s||!rdOk(s))return;if(G.ap<1){noAP();return}if(!needCash(rdCost(s)))return;
  G.ap--;G.rd=(G.rd||0)+1;
  if(rnd()<.25){H.img(-.25);L('news',both(()=>t(`Les tribunaux annulent la nouvelle carte de ${sn(s)}.`,`Courts strike down ${sn(s)}’s new map.`,`Los tribunales anulan el nuevo mapa de ${sn(s)}.`)))}
  else{s.gm=G.me*3.5;s.gmMine=true;L('you',both(()=>t(`Nouvelle carte adoptée en ${sn(s)} : elle vous favorise.`,`New map adopted in ${sn(s)}: it favors you.`,`Nuevo mapa aprobado en ${sn(s)}: te favorece.`)))}
  save();render();
}
