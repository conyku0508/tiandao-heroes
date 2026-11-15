import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
test('map satisfies the requested test-map dimensions',()=>{const m=read('../src/data/map.json');assert.equal(m.width*m.height,4096);assert.equal(m.tileWidth/m.tileHeight,2)});
test('every requested asset has its own replaceable provenance record',()=>{const a=read('../src/data/assets.json');for(const id of ['headquarters','housing','farmland','fishery','tavern','market','barracks','training-ground','road','fence','bridge'])assert.equal(a.filter(x=>x.id===id).length,1);assert.ok(a.every(x=>x.status==='planned'&&x.path===null))});
