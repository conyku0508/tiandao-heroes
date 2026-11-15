import {qinglingTile,qinglingNaturalTile} from '../data/maps/qingling';
import {SIZE,RULES,definitions,heroDefinitions,type BuildingKind} from '../data/rules';
export type Tile={x:number;y:number;z:number;kind:'plain'|'forest'|'hill'|'river'|'rock'|'road'};
export type Building={id:number;kind:BuildingKind;x:number;y:number;progress:number;scale:number;level:1|2|3};
export type Hero={id:number;x:number;y:number;target:number|null;path:number[];stamina:number;status:string};
export type State={version:1;mapVersion?:1|2|3;ruleset:string;tick:number;seed:number;money:number;food:number;population:number;satisfaction:number;tax:number;buildings:Building[];heroes:Hero[];nextId:number;log:string[]};
export const index=(x:number,y:number)=>y*SIZE+x;
export function generateMap(version:1|2|3=3):Tile[]{
 if(version===3)return Array.from({length:SIZE*SIZE},(_,i)=>qinglingNaturalTile(i%SIZE,Math.floor(i/SIZE)));
 if(version===2)return Array.from({length:SIZE*SIZE},(_,i)=>qinglingTile(i%SIZE,Math.floor(i/SIZE)));
 return Array.from({length:SIZE*SIZE},(_,i)=>{const x=i%SIZE,y=Math.floor(i/SIZE),noise=((x*73+y*131+x*y*7)%101)/100;
 const river=41+Math.round(Math.sin(y/8)*3),water=Math.abs(x-river)<2;
 const z=x<13?Math.max(1,Math.floor((17-x)/4)):y<12?Math.floor((14-y)/4):0;
 let kind:Tile['kind']=water?'river':z>1?'rock':z?'hill':noise>.74?'forest':'plain';
 if(x>17&&x<38&&y>18&&y<40)kind='plain';
 if(!water&&z===0&&(y===28||x===27))kind='road';
 return {x,y,z,kind};});
}
export const footprint=(kind:BuildingKind)=>['road','fence','bridge','housing'].includes(kind)?1:2;
export class World {
 tiles:Tile[]; state:State;
 constructor(state?:State){this.tiles=generateMap(state?(state.mapVersion??1):3);this.state=state??{version:1,mapVersion:3,ruleset:RULES.version,tick:0,seed:108,money:2400,food:1600,population:240,satisfaction:82,tax:15,buildings:[],heroes:heroDefinitions.map((_,id)=>({id,x:26+(id%4),y:29+Math.floor(id/4),target:null,path:[],stamina:100,status:'待命'})),nextId:1,log:['青嶺寨初立。選一片空地，開始第一座耕地。']};
 if(!state){for(const [kind,x,y] of [['headquarters',25,23],['farmland',32,25],['market',31,22],['tavern',22,25],['housing',22,30],['housing',23,31],['housing',24,32],['housing',21,32],['barracks',31,31],['training-ground',34,29]] as [BuildingKind,number,number][])this.state.buildings.push({id:this.state.nextId++,kind,x,y,progress:1,scale:1,level:1});
 for(let y=26;y<=30;y++)for(let x=34;x<=44;x++)if(this.tile(x,y)?.kind==='river'&&y===28)this.state.buildings.push({id:this.state.nextId++,kind:'bridge',x,y,progress:1,scale:1,level:1});}}
 tile(x:number,y:number){return this.tiles[index(x,y)];}
 at(x:number,y:number){return this.state.buildings.find(b=>x>=b.x&&x<b.x+footprint(b.kind)&&y>=b.y&&y<b.y+footprint(b.kind));}
 note(s:string){this.state.log.unshift(s);this.state.log=this.state.log.slice(0,30);}
 canBuild(kind:BuildingKind,x:number,y:number):string|null {
 const n=footprint(kind);if(x<0||y<0||x+n>SIZE||y+n>SIZE)return '超出山寨邊界';
 if(this.state.buildings.filter(b=>footprint(b.kind)>1).length>=RULES.facilityLimit&&n>1)return '主要設施容量已滿';
 const z=this.tile(x,y).z;
 for(let yy=y;yy<y+n;yy++)for(let xx=x;xx<x+n;xx++){
 const t=this.tile(xx,yy);if(this.at(xx,yy))return '地塊已有建築';if(t.z!==z)return '需要平坦的同高地塊';
 if(!(definitions[kind].terrain as readonly string[]).includes(t.kind))return t.kind==='forest'?'森林需先整地（後續功能）':'地形不適合';
 if(this.state.heroes.some(h=>h.x===xx&&h.y===yy))return '好漢正在此處，請換一個位置';}
 if(kind==='fishery'&&!this.near(x,y,'river',2))return '漁場必須鄰近河流';
 if(this.state.money<definitions[kind].cost)return '金錢不足';return null;
 }
 near(x:number,y:number,kind:string,r=2){return this.tiles.some(t=>t.kind===kind&&Math.abs(t.x-x)<=r&&Math.abs(t.y-y)<=r);}
 build(kind:BuildingKind,x:number,y:number){const error=this.canBuild(kind,x,y);if(error)return error;this.state.money-=definitions[kind].cost;this.state.buildings.push({id:this.state.nextId++,kind,x,y,progress:0,scale:1,level:1});this.note(`${definitions[kind].name}已規劃，請指派好漢施工。`);return null;}
 walkable(x:number,y:number){if(x<0||y<0||x>=SIZE||y>=SIZE)return false;const t=this.tile(x,y),b=this.at(x,y);return t.kind!=='rock'&&(!b||b.kind==='road'||(b.kind==='bridge'&&b.progress===1));}
 path(h:Hero,tx:number,ty:number):number[]|null {
 const start=index(h.x,h.y),goal=index(tx,ty);if(!this.walkable(tx,ty))return null;
 const open=new Set([start]),cost=new Map([[start,0]]),prev=new Map<number,number>();
 while(open.size){let current=-1,best=Infinity;for(const i of open){const estimate=cost.get(i)!+Math.abs(i%SIZE-tx)+Math.abs(Math.floor(i/SIZE)-ty);if(estimate<best){best=estimate;current=i;}}if(current===goal){const path:number[]=[];while(current!==start){path.unshift(current);current=prev.get(current)!;}return path;}
 open.delete(current);const x=current%SIZE,y=Math.floor(current/SIZE);
 for(const [xx,yy] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){if(!this.walkable(xx,yy)||Math.abs(this.tile(xx,yy).z-this.tile(x,y).z)>1)continue;const i=index(xx,yy),t=this.tile(xx,yy),bridge=this.at(xx,yy)?.kind==='bridge';const next=cost.get(current)!+(t.kind==='river'&&!bridge?5:t.kind==='forest'?3:1);if(next<(cost.get(i)??Infinity)){cost.set(i,next);prev.set(i,current);open.add(i);}}
 }return null;
 }
 assign(ids:number[],buildingId:number){const b=this.state.buildings.find(b=>b.id===buildingId);if(!b)return '建築不存在';let assigned=0;
 for(const id of ids){const h=this.state.heroes.find(h=>h.id===id);if(!h)continue;const n=footprint(b.kind),candidates:number[][]=[];for(let j=0;j<n;j++)candidates.push([b.x-1,b.y+j],[b.x+n,b.y+j],[b.x+j,b.y-1],[b.x+j,b.y+n]);let best:number[]|null=null;for(const [x,y]of candidates){const p=this.path(h,x,y);if(p&&(!best||p.length<best.length))best=p;}if(best){h.target=b.id;h.path=best;h.status=best.length?'前往工作':'工作';assigned++;}}
 this.note(`${assigned} 位好漢已接令。`);return assigned?null:'無法到達建築附近';}
 demolish(id:number){const b=this.state.buildings.find(b=>b.id===id);if(!b||b.kind==='headquarters')return '聚義堂不能拆除';this.state.buildings=this.state.buildings.filter(b=>b.id!==id);for(const h of this.state.heroes)if(h.target===id){h.target=null;h.path=[];h.status='待命';}if(b.kind==='housing')this.state.satisfaction=Math.max(0,this.state.satisfaction-5);this.note('已拆除；住宅容量不足時人口將逐日外流。');return null;}
 rest(id:number){const h=this.state.heroes.find(h=>h.id===id);if(h){h.target=null;h.path=[];h.status='休息';}}
 setTax(value:number){this.state.tax=Math.max(0,Math.min(50,value));}
 capacity(){return this.state.buildings.filter(b=>b.kind==='housing'&&b.progress===1).length*80;}
 yield(b:Building){const market=this.state.buildings.some(m=>m.kind==='market'&&m.progress===1&&Math.abs(m.x-b.x)<=4&&Math.abs(m.y-b.y)<=4);return Math.floor((b.kind==='farmland'?400:b.kind==='fishery'?240:160)*b.scale*(b.kind==='farmland'&&market?1.25:1)*(b.kind==='tavern'||b.kind==='market'?this.state.tax/15:1));}
 advance(ticks:number){for(let i=0;i<ticks;i++)this.step();}
 step(){const s=this.state;s.tick++;
 for(const h of s.heroes){if(h.path.length){if(s.tick%2===0){const next=h.path[0],x=next%SIZE,y=Math.floor(next/SIZE);if(!this.walkable(x,y)){const target=h.target;h.path=[];h.target=null;h.status='道路受阻';if(target)this.assign([h.id],target);continue;}if(this.tile(x,y).kind==='river'&&!this.at(x,y)&&s.tick%6!==0)continue;h.path.shift();h.x=x;h.y=y;h.status=this.tile(x,y).kind==='river'&&!this.at(x,y)?'乘船':'前往工作';}continue;}
 const b=s.buildings.find(b=>b.id===h.target);if(!b){h.status='待命';h.stamina=Math.min(100,h.stamina+.04);continue;}
 if(h.stamina<10){h.status='休息';h.stamina+=.4;continue;}h.status='工作';h.stamina=Math.max(0,h.stamina-.015);const def=heroDefinitions[h.id],fit=(b.kind==='farmland'&&def.profession==='村民')||(b.kind==='fishery'&&def.profession==='船夫')||(b.kind==='market'&&def.profession==='商人')||(b.kind==='tavern'&&def.profession==='酒商');
 if(b.progress<1){b.progress=Math.min(1,b.progress+(1+def.strength/100)/(definitions[b.kind].days*RULES.dayTicks));if(b.progress===1)this.note(`${definitions[b.kind].name}完工。`);}else b.scale=Math.min(b.level*2,b.scale+(fit?.002:.001));}
 if(s.tick%RULES.dayTicks===0){const day=s.tick/RULES.dayTicks;s.food=Math.max(0,s.food-Math.ceil(s.population/80));
 if(s.food===0)s.satisfaction=Math.max(0,s.satisfaction-2);else s.satisfaction=Math.min(100,s.satisfaction+(s.tax>25?-1:.2));
 if(s.population>this.capacity()||s.food===0)s.population=Math.max(0,s.population-4);else if(s.satisfaction>60&&s.tax<=25)s.population+=2;
 if(s.population>this.capacity()-30&&s.food>100&&s.satisfaction>60){for(let y=30;y<42;y++){let added=false;for(let x=20;x<35;x++)if(!this.canBuild('housing',x,y)){s.buildings.push({id:s.nextId++,kind:'housing',x,y,progress:1,scale:1,level:1});this.note('人口成長，新的民居已自動生成。');added=true;break;}if(added)break;}}
 for(const b of s.buildings){if(b.progress!==1)continue;b.scale=Math.min(b.level*2,b.scale+.0005*s.population/240);const period=b.kind==='farmland'?RULES.harvestDays:RULES.seasonDays;if(day%period===0){if(['farmland','fishery'].includes(b.kind)){const amount=this.yield(b);s.food+=amount;this.note(`${definitions[b.kind].name}收成 +${amount} 糧食。`);}if(['market','tavern'].includes(b.kind)){const amount=this.yield(b);s.money+=amount;this.note(`${definitions[b.kind].name}季稅 +${amount} 金錢。`);}}}
 }
 }
}
