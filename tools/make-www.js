// Copy the built game into www/ for Capacitor (no service worker needed inside the app).
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..'),W=path.join(R,'www');
fs.rmSync(W,{recursive:true,force:true});fs.mkdirSync(W);
for(const f of ['index.html','manifest.webmanifest','icon-192.png','icon-512.png'])fs.copyFileSync(path.join(R,f),path.join(W,f));
console.log('www ready');
