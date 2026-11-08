// Build-time Spanish injection: every 2-argument t()/B() call gets a 3rd argument from src/i18n/es.json
// (key = the English text, templates included). Missing keys stay English at runtime (and are reported).
const acorn=require('acorn');
const keyOf=(n,src)=>n.type==='Literal'&&typeof n.value==='string'?n.value:n.type==='TemplateLiteral'?src.slice(n.start+1,n.end-1):null;
const lit=(es,isTpl)=>'`'+(isTpl?es:es.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${'))+'`';
function inject(src,es,missing){
  for(let pass=0;pass<6;pass++){
    const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script'});const ins=[];
    (function walk(n){if(!n||typeof n.type!=='string')return;
      if(n.type==='CallExpression'&&n.callee.type==='Identifier'&&(n.callee.name==='t'||n.callee.name==='B')&&n.arguments.length===2){
        const a=n.arguments[1],k=keyOf(a,src);
        if(k!=null){const v=es[k];if(v!=null)ins.push([a.end,','+lit(v,a.type==='TemplateLiteral')]);else if(missing)missing.add(k)}}
      for(const x in n){const v=n[x];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v)}})(ast);
    if(!ins.length)break;
    ins.sort((a,b)=>b[0]-a[0]);for(const [p,s] of ins)src=src.slice(0,p)+s+src.slice(p);
  }
  return src;
}
module.exports={inject};
