/** Authored scene composition, not economy rules. Elevation units are 16px. */
export function qinglingTile(x:number,y:number){
 const noise=((x*73+y*131+x*y*7)%101)/100;
 // An irregular horseshoe of mountains embraces a stepped inhabited basin.
 const peaks=[[18,22,9,6,9],[27,16,11,10,5],[37,21,8,5,7],[17,34,7,4,8],[39,36,6,4,6]];
 let z=0;
 for(const [cx,cy,height,rx,ry] of peaks){const d=Math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2);z=Math.max(z,Math.floor(height*(1-d)));}
 if(x<8)z=Math.max(z,Math.floor((10-x)/2));
 let kind:'plain'|'forest'|'hill'|'river'|'rock'|'road'=z>=4?'rock':z>0?'hill':noise>.66?'forest':'plain';
 // Retaining walls, working terraces and small flat building pads.
 const terrace=(x0:number,y0:number,x1:number,y1:number,height:number)=>{if(x>=x0&&x<=x1&&y>=y0&&y<=y1){z=height;kind='plain';}};
 terrace(21,20,29,26,4); // upper keep terrace
 terrace(20,27,29,34,1); // inhabited slope
 terrace(30,21,35,27,2); // market / crop terrace
 terrace(30,29,36,33,1); // lower military court
 terrace(26,34,36,40,0); // open farm valley and player expansion
 // A road descends in individual elevation steps; other edges remain sheer cliffs.
 if(x>=26&&x<=28&&y>=25&&y<=29){z=Math.max(1,4-(y-25));kind='road';}
 if(y===28&&x>=20&&x<=39){z=1;kind='road';}
 if(x===30&&y>=24&&y<=33){z=y<=26?2:y<=33?1:0;kind='road';}
 // Grade-separated ramp to the eastern terrace, reachable from the courtyard.
 if(y===27&&x>=29&&x<=32){z=x===29?1:2;kind='road';}
 if(x===27&&y>=30&&y<=40){z=y<=33?1:0;kind='road';}
 // River winds through the foot of the valley, close enough to frame the main view.
 const riverX=38+Math.round(Math.sin((y-15)/6)*2);
 if(Math.abs(x-riverX)<=1&&y>=19){z=0;kind='river';}
 if(kind==='plain'&&((x*11+y*17)%31===0)&&!(x>=20&&x<=36&&y>=20&&y<=40))kind='forest';
 return {x,y,z,kind};
}
export const SCENE_LANDMARKS=[
 {name:'青嶺後山',x:27,y:17,z:10},
 {name:'聚義高台',x:25,y:24,z:4},
 {name:'山居坡地',x:23,y:32,z:1},
 {name:'河谷沃田',x:32,y:36,z:0}
];
/** Scenery anchors lie on the non-buildable perimeter. Shared terrain remains authoritative. */
export const MOUNTAIN_SCENERY=[
 {key:'ridge',cell:0,x:19,y:25,z:3,width:380,height:340},
 {key:'backridge',cell:0,x:28,y:19,z:4,width:400,height:350},
 {key:'eastcliff',cell:1,x:37,y:26,z:1,width:280,height:240},
 {key:'wooded-slope',cell:2,x:19,y:34,z:1,width:300,height:280}
];
