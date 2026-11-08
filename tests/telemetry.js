// Telemetry must be silent unless enabled. Run against a build made with TELEMETRY_URL set.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
 await p.addInitScript(()=>{window.__b=[];navigator.sendBeacon=(u,d)=>{window.__b.push(u);return true}});
 await p.goto('file://'+path.join(__dirname,'..','index.html'));
 const r=await p.evaluate(()=>{
  newGame(1,1,1,null,'mid');newGame(1,1,2,null,'mid');const off=__b.length;   // opt-out: nothing sent
  SET.tel=1;newGame(1,1,3,null,'mid');const on=__b.length;                    // abandon of previous game
  return{off,on,settingsHasToggle:/anonymous stats|statistiques anonymes/.test(settingsHTML())}});
 console.log(JSON.stringify(r));const ok=r.off===0&&r.on===1&&r.settingsHasToggle;
 await b.close();process.exit(ok?0:1)})();
