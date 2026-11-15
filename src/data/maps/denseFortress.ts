/** Reference-directed art layout. All collidable scenery is explicit, never random. */
export const STARTING_BUILDINGS = [
 ['headquarters',25,23],['tavern',22,25],['market',30,25],
 ['barracks',29,21],['training-ground',32,21],
 ['housing',21,28],['housing',23,29],['housing',25,28],['housing',27,30],
 ['housing',24,26],['housing',26,25],['housing',28,25],['housing',37,25],
 ['housing',37,30],['housing',39,35],['housing',28,39],
 ['farmland',22,35],['farmland',25,35],['farmland',22,38],
 ['fishery',28,34],['market',36,27],['tavern',36,35]
] as const;
export const BRIDGE_GROUPS=[
 {x:27,y:32,width:2,height:2,flip:false},
 {x:34,y:28,width:2,height:2,flip:true},
 {x:34,y:36,width:2,height:2,flip:true}
];
export type Scenery={key:'wall-ne'|'wall-se'|'gate'|'workshop'|'plot'|'tree';x:number;y:number;width:number;height:number;blocking:boolean;name:string};
export const FORTRESS_SCENERY:Scenery[]=[
 ...[[24,22],[28,23],[24,25],[29,23],[26,29],[31,29],[32,26],[38,26],[36,31],[24,34],[21,34],[32,34],[36,39],[26,40],[28,40]].map(([x,y])=>({key:'tree' as const,x,y,width:1,height:1,blocking:true,name:'街巷花木（景觀）'})),

 ...Array.from({length:21},(_,i)=>({key:'wall-se' as const,x:20+i,y:19,width:1,height:1,blocking:true,name:'北寨牆'})).filter(s=>s.x<26||s.x>28),
 ...Array.from({length:21},(_,i)=>({key:'wall-se' as const,x:20+i,y:41,width:1,height:1,blocking:true,name:'南寨牆'})).filter(s=>s.x<28||s.x>30),
 ...Array.from({length:21},(_,i)=>({key:'wall-ne' as const,x:19,y:20+i,width:1,height:1,blocking:true,name:'西寨牆'})).filter(s=>s.y<31||s.y>34),
 ...Array.from({length:21},(_,i)=>({key:'wall-ne' as const,x:41,y:20+i,width:1,height:1,blocking:true,name:'東寨牆'})).filter(s=>(s.y<27||s.y>30)&&(s.y<32||s.y>34)),
 {key:'gate',x:27,y:19,width:1,height:1,blocking:false,name:'北寨門'},
 {key:'gate',x:29,y:41,width:1,height:1,blocking:false,name:'南寨門'},
 {key:'gate',x:41,y:29,width:1,height:1,blocking:false,name:'東寨門'},
 {key:'workshop',x:21,y:21,width:2,height:2,blocking:true,name:'糧倉與工坊（景觀）'},
 {key:'workshop',x:36,y:22,width:2,height:2,blocking:true,name:'倉儲院落（景觀）'},
 {key:'workshop',x:37,y:38,width:2,height:2,blocking:true,name:'工匠院落（景觀）'},
 {key:'plot',x:30,y:35,width:2,height:2,blocking:false,name:'預留建地'},
 {key:'plot',x:30,y:38,width:2,height:2,blocking:false,name:'預留建地'},
 {key:'plot',x:37,y:31,width:2,height:2,blocking:false,name:'預留建地'}
];
export function sceneryAt(x:number,y:number){return FORTRESS_SCENERY.find(s=>x>=s.x&&x<s.x+s.width&&y>=s.y&&y<s.y+s.height);}

export function denseFortressTile(x:number,y:number){
 const noise=((x*37+y*61+x*y*3)%101)/100;
 let z=0;
 for(const [cx,cy,h,rx,ry] of [[16,22,7,6,10],[28,15,8,12,5],[45,26,6,6,13],[16,40,5,5,9]]){
  z=Math.max(z,Math.floor(h*Math.max(0,1-Math.hypot((x-cx)/rx,(y-cy)/ry))));
 }
 if(x<8)z=Math.max(z,Math.floor((10-x)/2));
 let kind:'plain'|'forest'|'hill'|'river'|'rock'|'road'=z>=3?'rock':noise>.38?'forest':z?'hill':'plain';
 if(x>=20&&x<=40&&y>=20&&y<=40){z=y<25?2:y<30?1:0;kind='plain';}
 // Narrow lanes divide inhabited quarters, instead of a huge empty cross-shaped lawn.
 if((y===24&&x>=20&&x<=40)||(y===27&&x>=20&&x<=40)||
    (y===30&&x>=20&&x<=40)||(y===37&&x>=20&&x<=40)||
    (x===27&&y>=19&&y<=41)||(x===33&&y>=20&&y<=40)||(x===39&&y>=20&&y<=41))kind='road';
 for(const [kindId,bx,by] of STARTING_BUILDINGS){
  const size=kindId==='housing'?1:2;
  if(x>=bx&&x<bx+size&&y>=by&&y<by+size){z=by<25?2:by<30?1:0;kind='plain';}
 }
 // A two-tile stream cuts through the village; its branch connects both banks.
 if((y>=32&&y<=33&&x>=18&&x<=44)||(x>=34&&x<=35&&y>=25&&y<=42)){z=0;kind='river';}
 // Accessible banks grade into crossings, rather than placing a bridge below a cliff.
 if((x>=26&&x<=29&&y>=30&&y<=31)||(x>=32&&x<=33&&y>=27&&y<=30)){z=0;if(kind!=='river')kind='road';}
 if(x>=20&&x<=40&&y===31)z=0;
 if(x>=20&&x<=40&&y===25&&kind==='road')z=1;
 // Keep the new-build acceptance area level and free.
 if(x>=30&&x<=31&&y>=35&&y<=36){z=0;kind='plain';}
 return {x,y,z,kind};
}
