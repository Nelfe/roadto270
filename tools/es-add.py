#!/usr/bin/env python3
# usage: python3 tools/es-add.py 'English|Español' ...   (adds entries to src/i18n/es.json)
import json,sys
p='src/i18n/es.json';d=json.load(open(p,encoding='utf-8'))
for a in sys.argv[1:]:
    k,v=a.split('|',1);d[k]=v
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
