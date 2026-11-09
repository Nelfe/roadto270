#!/usr/bin/env node
// List every 2-argument t()/B() call in src/js with its English key (used by the Spanish dictionary src/i18n/es.json).
// usage: node tools/i18n-extract.js [--missing]   -> prints JSON {key:{fr,file}} (only keys absent from es.json with --missing)
const acorn=require('acorn'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','src','js');
function keyOf(n,src){if(n.type==='Literal'&&typeof n.value==='string')return n.value;if(n.type==='TemplateLiteral')return src.slice(n.start+1,n.end-1);return null}
function scan(){const out=[];
 for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort()){const src=fs.readFileSync(path.join(dir,f),'utf8');
  const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script'});
  (function walk(n){if(!n||typeof n.type!=='string')return;
   if(n.type==='CallExpression'&&n.callee.type==='Identifier'&&(n.callee.name==='t'||n.callee.name==='B')&&n.arguments.length===2){
    const en=keyOf(n.arguments[1],src);if(en!=null)out.push({file:f,en,fr:keyOf(n.arguments[0],src),end:n.arguments[1].end,isTpl:n.arguments[1].type==='TemplateLiteral'})}
   for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v)}})(ast)}
 return out}
module.exports={scan};
if(require.main===module){
 const es=fs.existsSync(path.join(__dirname,'..','src/i18n/es.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'..','src/i18n/es.json'),'utf8')):{};
 const m={};for(const c of scan()){if((process.argv.includes('--missing')||process.argv.includes('--check'))&&es[c.en]!=null)continue;if(!m[c.en])m[c.en]={fr:c.fr,file:c.file}}
 if(process.argv.includes('--check')){const n=Object.keys(m).length;console.log(n?n+' strings without Spanish translation:\n'+Object.keys(m).slice(0,20).join('\n'):'i18n ok');process.exit(n?1:0)}
 console.log(JSON.stringify(m,null,1));
}
