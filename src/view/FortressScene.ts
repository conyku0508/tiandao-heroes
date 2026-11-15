import Phaser from 'phaser';
import {World,type Tile} from '../systems/world';
import {definitions,heroDefinitions,SIZE,type BuildingKind} from '../data/rules';
export const project=(x:number,y:number,z=0)=>({x:(x-y)*32+2048,y:(x+y)*16-z*16+80});
export class FortressScene extends Phaser.Scene {
 world!:World; onSelect:(x:number,y:number,hero:number|null)=>void=()=>{}; ready:()=>void=()=>{};
 objects:Phaser.GameObjects.GameObject[]=[]; heroes:Phaser.GameObjects.Image[]=[];
 marker!:Phaser.GameObjects.Graphics; selected:{x:number;y:number}|null=null; preview:BuildingKind|null=null;
 private start={x:0,y:0};private moved=false;private pinch=0;private elapsed=0; speed=0;
 preload(){for(const key of ['plain','forest','hill','rock','river','road','tree',...Object.keys(definitions).filter(k=>k!=='road'),...heroDefinitions.map((_,i)=>'hero-'+i)])this.load.image(key,`${import.meta.env.BASE_URL}assets/${key}.png`);}
 create(){this.input.addPointer(2);this.cameras.main.setBackgroundColor('#233e38');
 for(const t of this.world.tiles){const p=project(t.x,t.y,t.z);this.add.image(p.x,p.y,t.kind).setOrigin(.5,0).setDepth(t.x+t.y);
 if(t.kind==='forest'){this.add.image(p.x,p.y+15,'tree').setOrigin(.5,1).setDepth(t.x+t.y+.4);}}
 this.marker=this.add.graphics().setDepth(1000);this.refreshBuildings();this.heroes=this.world.state.heroes.map(h=>{const p=project(h.x,h.y,this.world.tile(h.x,h.y).z);return this.add.image(p.x,p.y+16,'hero-'+h.id).setOrigin(.5,1).setDepth(h.x+h.y+2);});
 this.center();this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.start={x:p.x,y:p.y};this.moved=false;this.pinch=0;});
 this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{const touches=this.input.manager.pointers.filter(q=>q.isDown);if(touches.length>1){const distance=Phaser.Math.Distance.Between(touches[0].x,touches[0].y,touches[1].x,touches[1].y);if(this.pinch)this.zoomAt(this.cameras.main.zoom*distance/this.pinch,(touches[0].x+touches[1].x)/2,(touches[0].y+touches[1].y)/2);this.pinch=distance;this.moved=true;return;}if(p.isDown){if(Math.hypot(p.x-this.start.x,p.y-this.start.y)>7)this.moved=true;const c=this.cameras.main;c.scrollX-=(p.x-p.prevPosition.x)/c.zoom;c.scrollY-=(p.y-p.prevPosition.y)/c.zoom;}});
 this.input.on('pointerup',(p:Phaser.Input.Pointer)=>{if(this.moved||this.pinch){this.pinch=0;return;}const v=this.cameras.main.getWorldPoint(p.x,p.y);let best:Tile|undefined;
 for(const t of this.world.tiles){const point=project(t.x,t.y,t.z);if(Math.abs(v.x-point.x)/32+Math.abs(v.y-point.y-16)/16<=1&&(!best||t.x+t.y>best.x+best.y))best=t;}
 if(best){let hero:number|null=null;let distance=25;for(const h of this.world.state.heroes){const pos=project(h.x,h.y,this.world.tile(h.x,h.y).z);const dist=Math.hypot(v.x-pos.x,v.y-(pos.y+2));if(dist<distance){hero=h.id;distance=dist;}}this.selected={x:best.x,y:best.y};this.onSelect(best.x,best.y,hero);}});
 this.input.on('wheel',(_p:unknown,_o:unknown,_dx:number,dy:number)=>this.zoomAt(this.cameras.main.zoom*(dy>0?.9:1.1),this.input.activePointer.x,this.input.activePointer.y));this.ready();}
 center(){const p=project(28,28);this.cameras.main.setZoom(Math.min(1.15,Math.max(.55,this.scale.width/1100)));this.cameras.main.centerOn(p.x,p.y);}
 zoomAt(zoom:number,x=this.scale.width/2,y=this.scale.height/2){const c=this.cameras.main,old=c.getWorldPoint(x,y);c.setZoom(Phaser.Math.Clamp(zoom,.35,2));const next=c.getWorldPoint(x,y);c.scrollX+=old.x-next.x;c.scrollY+=old.y-next.y;}
 refreshBuildings(){this.objects.forEach(o=>o.destroy());this.objects=[];for(const b of this.world.state.buildings){const p=project(b.x+.5,b.y+.5,this.world.tile(b.x,b.y).z);const image=this.add.image(p.x,p.y+32,b.kind).setOrigin(.5,1).setDepth(b.x+b.y+2).setAlpha(b.progress<1?.6:1);if(b.kind==='road')image.setScale(1);this.objects.push(image);if(b.progress<1){const text=this.add.text(p.x,p.y-55,Math.round(b.progress*100)+'%',{fontSize:'13px',backgroundColor:'#172c29',color:'#efdca7'}).setOrigin(.5).setDepth(900);this.objects.push(text);}}}
 update(_time:number,delta:number){this.elapsed+=Math.min(delta,250)*this.speed;while(this.elapsed>=100){this.world.advance(1);this.elapsed-=100;}for(const h of this.world.state.heroes){const p=project(h.x,h.y,this.world.tile(h.x,h.y).z),sprite=this.heroes[h.id];sprite.setPosition(p.x,p.y+16).setDepth(h.x+h.y+3);sprite.setTint(h.status==='乘船'?0x91dfe0:0xffffff);}
 this.marker.clear();if(this.selected){const {x,y}=this.selected,n=this.preview&& !['road','fence','bridge','housing'].includes(this.preview)?2:1;const valid=!this.preview||!this.world.canBuild(this.preview,x,y);this.marker.lineStyle(2,valid?0xe6cb7c:0xe27d69,.9);for(let j=0;j<n;j++)for(let i=0;i<n;i++){if(x+i>=SIZE||y+j>=SIZE)continue;const p=project(x+i,y+j,this.world.tile(x+i,y+j).z);this.marker.strokePoints([{x:p.x,y:p.y},{x:p.x+32,y:p.y+16},{x:p.x,y:p.y+32},{x:p.x-32,y:p.y+16}],true);}}
 }
}
