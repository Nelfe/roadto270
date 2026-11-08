/* ---------- Mesure anonyme (opt-in) ---------- */
// Off by default. Active only if (a) CFG.telemetryUrl is set at build time AND (b) the player turned it on in Settings.
// Sends: random anonymous id, game version, language, mode, difficulty, side, week reached, win/EV. Never any personal data.
const TEL={
  v:'1',
  id(){try{let i=localStorage.getItem('cap270.aid');if(!i){i=Math.random().toString(36).slice(2,10);localStorage.setItem('cap270.aid',i)}return i}catch(e){return'x'}},
  send(type,d){
    if(SIM||!CFG.telemetryUrl||!SET.tel)return;
    try{
      const body=JSON.stringify(Object.assign({e:type,id:TEL.id(),v:TEL.v,lang:LANG,t:Date.now()},d||{}));
      if(navigator.sendBeacon)navigator.sendBeacon(CFG.telemetryUrl,new Blob([body],{type:'text/plain'}));
      else fetch(CFG.telemetryUrl,{method:'POST',body,keepalive:true,mode:'no-cors'}).catch(()=>{});
    }catch(e){}
  }
};
