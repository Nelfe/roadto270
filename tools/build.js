#!/usr/bin/env node
// Assemble src/ -> index.html (PWA) and dist/artifact.html (single file, no service worker)
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..'),S=p=>path.join(R,'src',p);
const rd=p=>fs.readFileSync(S(p),'utf8');
const j=n=>fs.readFileSync(S('data/'+n+'.json'),'utf8').trim();
const cfg=JSON.parse(rd('config.json'));
if(process.env.TELEMETRY_URL)cfg.telemetryUrl=process.env.TELEMETRY_URL;
const data=`const ST_RAW=${j('states')};
const EN_NAMES=${j('en_names')};
const HSEATS=${j('house_seats')};
const SEN_UP=${j('senate_up')};
const DEMO=${j('demo')};
const CFG=${JSON.stringify(cfg)};
`;
const files=fs.readdirSync(S('js')).filter(f=>f.endsWith('.js')).sort();
let js=files.map(f=>rd('js/'+f)).join('');
// data goes right after 'use strict' (first line of 00-core.js)
js=js.replace("'use strict';\n","'use strict';\n"+data);
const core=rd('head.html')+'<style>\n'+rd('style.css')+'</style>\n'+rd('body.html')+'<script>\n'+js+'</script>\n';
const tail=`\n<script>if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>\n</body>\n</html>\n`;
// head.html = "<title>…\n<meta>\n<link>" ; pwa-head holds doctype/meta
const title=rd('head.html');
const pwa=rd('pwa-head.html')+title+'<style>\n'+rd('style.css')+'</style>\n</head>\n<body>\n'+rd('body.html')+'<script>\n'+js+'</script>\n'+tail;
fs.writeFileSync(path.join(R,'index.html'),pwa);
fs.mkdirSync(path.join(R,'dist'),{recursive:true});
fs.writeFileSync(path.join(R,'dist/artifact.html'),core);
console.log('built',pwa.length,'bytes;',files.length,'modules');
