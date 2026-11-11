/* ---------- Colistier ---------- */
const VPS={D:[
 {n:'Dana Whitfield',r:B('Sénatrice de Pennsylvanie','Senator from Pennsylvania'),k:'region',st:'PA',ne:['OH','MI','NJ'],d:B('+2,0 en Pennsylvanie, +0,6 autour','+2.0 in Pennsylvania, +0.6 nearby')},
 {n:'Tara Lindqvist',r:B('Ancienne secrétaire d’État','Former Secretary of State'),k:'image',d:B('Image nationale +0,5','National image +0.5')},
 {n:'Marcus Reyes',r:B('Gouverneur et ancien banquier','Governor and former banker'),k:'funds',d:B('+8 M$ de fonds de départ','+$8M in starting funds')}],
 R:[
 {n:'Ryan Calloway',r:B('Gouverneur de Géorgie','Governor of Georgia'),k:'region',st:'GA',ne:['NC','SC','AL'],d:B('+2,0 en Géorgie, +0,6 autour','+2.0 in Georgia, +0.6 nearby')},
 {n:'Beth Aldridge',r:B('Ancienne ambassadrice','Former ambassador'),k:'image',d:B('Image nationale +0,5','National image +0.5')},
 {n:'Tom Vasquez',r:B('Entrepreneur et donateur','Entrepreneur and donor'),k:'funds',d:B('+8 M$ de fonds de départ','+$8M in starting funds')}]};
function pickVP(i){
  const v=VPS[side()][i];G.vpName=v.n;
  if(v.k==='region'){ST(v.st).vpP+=2;v.ne.forEach(a=>ST(a).vpP+=.6)}else if(v.k==='image')G.img+=G.me*.5;else G.cash+=8;
  const ov=ST(['PA','AZ','GA','WI','MI','NC'][Math.floor(rnd()*6)]);ov.vpO+=2;
  if(G.long&&!G.convDone){G.convOv=ov.ab;if(SIM){convApply(-1,1)}else{G.phase='conv';G.conv={step:0};L('news',both(()=>t(`${v.n} est annoncé(e) comme colistier à la convention.`,`${v.n} is announced as running mate at the convention.`)));save();render();showConv();return}}
  vpTail(v,ov)
}
function vpTail(v,ov){
  G.phase='play';snap();L('news',both(()=>t(`${v.n} rejoint votre ticket. L’adversaire choisit un colistier lié à ${sn(ov)}.`,`${v.n} joins your ticket. Your opponent picks a running mate tied to ${sn(ov)}.`)));
  hideModal();save();UI.tutoPending=!SIM;render();
}
