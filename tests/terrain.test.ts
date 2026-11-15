import {test} from 'node:test';
import assert from 'node:assert/strict';
import {World,footprint,generateMap} from '../src/systems/world';
import {validateSave} from '../src/services/save';
test('authored fortress has visible upper keep, lower courts, river valley and surrounding peaks',()=>{const w=new World();assert.equal(w.tile(25,23).z,2);assert.equal(w.tile(23,31).z,1);assert.equal(w.tile(32,36).z,0);assert.ok(w.tiles.some(t=>t.x>=17&&t.x<=39&&t.y>=14&&t.y<=25&&t.z>=8));});
test('all initial buildings have flat foundations and reachable work positions',()=>{const w=new World();for(const b of w.state.buildings){const z=w.tile(b.x,b.y).z;for(let y=b.y;y<b.y+footprint(b.kind);y++)for(let x=b.x;x<b.x+footprint(b.kind);x++)assert.equal(w.tile(x,y).z,z,b.kind);assert.equal(w.assign([0],b.id),null,b.kind);}});
test('ramp permits ascent while a sheer terrace wall prevents direct crossing',()=>{const w=new World(),h=w.state.heroes[0];const p=w.path(h,25,22);assert.ok(p);let previous=w.tile(h.x,h.y);for(const i of p){const t=w.tiles[i];assert.ok(Math.abs(t.z-previous.z)<=1);previous=t;}assert.ok(w.tiles.some(t=>t.kind==='plain'&&t.x>0&&Math.abs(t.z-w.tile(t.x-1,t.y).z)>1));});
test('legacy save retains its old terrain; new save preserves authored map version',()=>{const w=new World();const legacy={...w.state};delete legacy.mapVersion;const restored=new World(validateSave(legacy));assert.deepEqual(restored.tiles,generateMap(1));assert.equal(restored.tile(25,23).z,0);assert.equal(new World(validateSave(w.state)).tile(25,23).z,2);assert.throws(()=>validateSave({...w.state,mapVersion:99}));});

test('v2 saves retain raised terraces when v3 is the default',()=>{const w=new World();const old={...w.state,mapVersion:2 as const};const restored=new World(validateSave(old));assert.equal(restored.tile(25,23).z,4);assert.equal(w.tile(25,23).z,2);});
