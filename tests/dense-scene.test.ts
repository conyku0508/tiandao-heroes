import {test} from 'node:test';
import assert from 'node:assert/strict';
import {World,generateMap} from '../src/systems/world';
import {BRIDGE_GROUPS,FORTRESS_SCENERY} from '../src/data/maps/denseFortress';
import {validateSave} from '../src/services/save';
test('the authored stream crosses the settlement and every initial bridge sits on water',()=>{
 const w=new World();assert.equal(w.tile(25,32).kind,'river');assert.equal(w.tile(34,29).kind,'river');
 for(const b of w.state.buildings.filter(b=>b.kind==='bridge'))assert.equal(w.tile(b.x,b.y).kind,'river');
});
test('scenery wall and workshop footprints block walking and construction but gates are open',()=>{
 const w=new World(),money=w.state.money;
 for(const s of FORTRESS_SCENERY.filter(s=>s.blocking)){
  assert.equal(w.walkable(s.x,s.y),false,s.name);
  assert.ok(w.build('road',s.x,s.y),s.name);
 }
 assert.equal(w.state.money,money);
 for(const s of FORTRESS_SCENERY.filter(s=>s.key==='gate'))assert.equal(w.walkable(s.x,s.y),true,s.name);
});
test('reserved construction plots remain buildable and scenery does not overlap occupied facilities',()=>{
 const w=new World();assert.equal(w.canBuild('farmland',30,35),null);
 for(const s of FORTRESS_SCENERY.filter(s=>s.blocking))for(let y=s.y;y<s.y+s.height;y++)for(let x=s.x;x<s.x+s.width;x++)assert.equal(w.at(x,y),undefined,s.name);
});
test('removing a grouped bridge removes the whole segment and cancels jobs on its cells',()=>{
 const w=new World(),g=BRIDGE_GROUPS[0],b=w.at(g.x,g.y)!;
 w.state.heroes[0].target=w.at(g.x+1,g.y+1)!.id;assert.equal(w.demolish(b.id),null);
 for(let y=g.y;y<g.y+g.height;y++)for(let x=g.x;x<g.x+g.width;x++)assert.equal(w.at(x,y),undefined);
 assert.equal(w.state.heroes[0].target,null);
});
test('v1 v2 v3 saves retain their exact geometry after the art layout changes',()=>{
 const w=new World();for(const version of [1,2,3] as const){const old={...w.state,mapVersion:version};const restored=new World(validateSave(old));assert.deepEqual(restored.tiles,generateMap(version));}
 assert.equal(new World(validateSave(w.state)).state.mapVersion,4);
});
