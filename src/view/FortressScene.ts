import Phaser from 'phaser';
import {ATLAS_CELLS} from '../data/art';
import {World,type Tile} from '../systems/world';
import {definitions,heroDefinitions,SIZE,type BuildingKind} from '../data/rules';
export const project=(x:number,y:number,z=0)=>({x:(x-y)*32+2048,y:(x+y)*16-z*16+80});
export class FortressScene extends Phaser.Scene {
 world!:World; onSelect:(x:number,y:number,hero:number|null)=>void=()=>{}; ready:()=>void=()=>{};
 objects:Phaser.GameObjects.GameObject[]=[]; heroes:Phaser.GameObjects.Image[]=[];
 marker!:Phaser.GameObjects.Graphics; selected:{x:number;y:number}|null=null; preview:BuildingKind|null=null;
 private start={x:0,y:0};private moved=false;private pinch=0;private elapsed=0; speed=0;
 preload(){this.load.image('fortress-atlas',`${import.meta.env.BASE_URL}assets/fortress-atlas.png`);for(const key of ['plain','forest','hill','rock','river','road',...heroDefinitions.map((_,i)=>'hero-'+i)])this.load.image(key,`${import.meta.env.BASE_URL}assets/${key}.png`);}
 create(){
 const atlas=this.textures.get('fortress-atlas').getSourceImage() as HTMLImageElement;
 ATLAS_CELLS.forEach(([key,w,h],i)=>{const texture=this.textures.createCanvas(key,w,h)!;texture.getContext().imageSmoothingEnabled=false;texture.getContext().drawImage(atlas,(i%4)*atlas.width/4,Math.floor(i/4)*atlas.height/4,atlas.width/4,atlas.height/4,0,0,w,h);texture.refresh();});
 this.input.addPointer(2);this.cameras.main.setBackgroundColor('#233e38');
 const ground=this.textures.createCanvas('ground',4096,2200)!;const ctx=ground.getContext();
 for(const t of [...this.world.tiles].sort((a,b)=>a.x+a.y-b.x-b.y)){const p=project(t.x,t.y,t.z);const image=this.textures.get(t.kind).getSourceImage() as HTMLImageElement;
 // Expose cliff faces only at a real height difference, not under every grass tile.
 for(const [dx,dy,shade] of [[1,0,'#59604b'],[0,1,'#74755a']] as [number,number,string][]){const neighbor=this.world.tiles[(t.y+dy)*SIZE+t.x+dx];const drop=Math.max(0,t.z-(neighbor?.z??0))*16;if(drop){const left=dx===0;const ax=p.x+(left?-32:32),ay=p.y+16;ctx.fillStyle=shade;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(p.x,p.y+32);ctx.lineTo(p.x,p.y+32+drop);ctx.lineTo(ax,ay+drop);ctx.closePath();ctx.fill();ctx.strokeStyle='#383e3180';for(let k=5;k<drop;k+=7){ctx.beginPath();ctx.moveTo(ax,ay+k);ctx.lineTo(p.x,p.y+32+k);ctx.stroke();}}}
 ctx.drawImage(image,0,0,64,32,p.x-32,p.y,64,32);
 if(t.kind==='river'){ctx.strokeStyle='#a4d7c44a';ctx.beginPath();ctx.moveTo(p.x-15,p.y+17);ctx.lineTo(p.x-7,p.y+17);ctx.moveTo(p.x+6,p.y+11);ctx.lineTo(p.x+18,p.y+11);ctx.stroke();}
 }
 ground.refresh();this.add.image(0,0,'ground').setOrigin(0).setDepth(-1);
 for(const t of this.world.tiles){if(t.kind==='forest'){const p=project(t.x,t.y,t.z);this.add.image(p.x,p.y+15,'tree').setOrigin(.5,1).setDepth(t.x+t.y+.4);}else if(t.kind==='rock'&&(t.x*7+t.y*13)%4===0){const p=project(t.x,t.y,t.z);this.add.image(p.x,p.y+24,'outcrop').setOrigin(.5,1).setDepth(t.x+t.y+.3);}else if(t.kind==='plain'&&(t.x*19+t.y*7)%23===0&&!this.world.at(t.x,t.y)){const p=project(t.x,t.y,t.z);this.add.image(p.x,p.y+24,'undergrowth').setOrigin(.5,1).setDepth(t.x+t.y+.2);}}
 this.marker=this.add.graphics().setDepth(1000);this.refreshBuildings();this.heroes=this.world.state.heroes.map(h=>{const p=project(h.x,h.y,this.world.tile(h.x,h.y).z);return this.add.image(p.x,p.y+16,'hero-'+h.id).setOrigin(.5,1).setDepth(h.x+h.y+2);});
 this.center();this.scale.on('resize',()=>this.center());this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.start={x:p.x,y:p.y};this.moved=false;this.pinch=0;});
 this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{const touches=this.input.manager.pointers.filter(q=>q.isDown);if(touches.length>1){const distance=Phaser.Math.Distance.Between(touches[0].x,touches[0].y,touches[1].x,touches[1].y);if(this.pinch)this.zoomAt(this.cameras.main.zoom*distance/this.pinch,(touches[0].x+touches[1].x)/2,(touches[0].y+touches[1].y)/2);this.pinch=distance;this.moved=true;return;}if(p.isDown){if(Math.hypot(p.x-this.start.x,p.y-this.start.y)>7)this.moved=true;const c=this.cameras.main;c.scrollX-=(p.x-p.prevPosition.x)/c.zoom;c.scrollY-=(p.y-p.prevPosition.y)/c.zoom;}});
 this.input.on('pointerup',(p:Phaser.Input.Pointer)=>{if(this.moved||this.pinch){this.pinch=0;return;}const v=this.cameras.main.getWorldPoint(p.x,p.y);let best:Tile|undefined;
 for(const t of this.world.tiles){const point=project(t.x,t.y,t.z);if(Math.abs(v.x-point.x)/32+Math.abs(v.y-point.y-16)/16<=1&&(!best||t.x+t.y>best.x+best.y))best=t;}
 if(best){let hero:number|null=null;let distance=25;for(const h of this.world.state.heroes){const pos=project(h.x,h.y,this.world.tile(h.x,h.y).z);const dist=Math.hypot(v.x-pos.x,v.y-(pos.y+2));if(dist<distance){hero=h.id;distance=dist;}}this.selected={x:best.x,y:best.y};this.onSelect(best.x,best.y,hero);}});
 this.input.on('wheel',(_p:unknown,_o:unknown,_dx:number,dy:number)=>this.zoomAt(this.cameras.main.zoom*(dy>0?.9:1.1),this.input.activePointer.x,this.input.activePointer.y));this.ready();}
 center(){const p=project(28,28);this.cameras.main.setZoom(this.scale.width<1050?1.05:1.4);this.cameras.main.centerOn(p.x,p.y);}
 zoomAt(zoom:number,x=this.scale.width/2,y=this.scale.height/2){const c=this.cameras.main,old=c.getWorldPoint(x,y);c.setZoom(Phaser.Math.Clamp(zoom,.35,2));const next=c.getWorldPoint(x,y);c.scrollX+=old.x-next.x;c.scrollY+=old.y-next.y;}
 refreshBuildings(){this.objects.forEach(o=>o.destroy());this.objects=[];for(const b of this.world.state.buildings){const p=project(b.x+.5,b.y+.5,this.world.tile(b.x,b.y).z);const image=this.add.image(p.x,p.y+32,b.kind).setOrigin(.5,1).setDepth(b.x+b.y+2).setAlpha(b.progress<1?.6:1);if(['fence','bridge'].includes(b.kind))image.setScale(.52);this.objects.push(image);if(b.progress<1){const text=this.add.text(p.x,p.y-55,Math.round(b.progress*100)+'%',{fontSize:'13px',backgroundColor:'#172c29',color:'#efdca7'}).setOrigin(.5).setDepth(900);this.objects.push(text);}}}
 update(_time:number,delta:number){this.elapsed+=Math.min(delta,250)*this.speed;while(this.elapsed>=100){this.world.advance(1);this.elapsed-=100;}for(const h of this.world.state.heroes){const p=project(h.x,h.y,this.world.tile(h.x,h.y).z),sprite=this.heroes[h.id];sprite.setPosition(p.x,p.y+16).setDepth(h.x+h.y+3);sprite.setTexture(this.world.tile(h.x,h.y).kind==='river'&&!this.world.at(h.x,h.y)?'boat':'hero-sample');sprite.setTint([0xffd2bb,0xc5e6ff,0xffedb2,0xd5edb9,0xe4c9ff,0xffd9ae,0xb6ead8,0xd2d8ff][h.id]);}
 this.marker.clear();if(this.selected){const {x,y}=this.selected,n=this.preview&& !['road','fence','bridge','housing'].includes(this.preview)?2:1;const valid=!this.preview||!this.world.canBuild(this.preview,x,y);this.marker.lineStyle(2,valid?0xe6cb7c:0xe27d69,.9);for(let j=0;j<n;j++)for(let i=0;i<n;i++){if(x+i>=SIZE||y+j>=SIZE)continue;const p=project(x+i,y+j,this.world.tile(x+i,y+j).z);this.marker.strokePoints([{x:p.x,y:p.y},{x:p.x+32,y:p.y+16},{x:p.x,y:p.y+32},{x:p.x-32,y:p.y+16}],true);}}
 }
}
