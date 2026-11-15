import type {FortressScene} from './FortressScene';
const colors={plain:'#7b9353',forest:'#365b37',hill:'#667b45',rock:'#8b8d78',river:'#38889e',road:'#c4b18d'};
/** Overview is derived from the live world and camera, including loaded legacy maps. */
export class Minimap {
 constructor(private canvas:HTMLCanvasElement,private scene:FortressScene){
  canvas.addEventListener('pointerdown',e=>{if(!scene.marker)return;const r=canvas.getBoundingClientRect();scene.cameras.main.centerOn((e.clientX-r.left)/r.width*4096,(e.clientY-r.top)/r.height*2200);});
 }
 draw(){const c=this.canvas.getContext('2d')!,w=this.canvas.width,h=this.canvas.height,world=this.scene.world;
  c.fillStyle='#344636';c.fillRect(0,0,w,h);
  for(const t of world.tiles){const x=((t.x-t.y)*32+2048)/4096*w,y=((t.x+t.y)*16-t.z*16+96)/2200*h;c.fillStyle=colors[t.kind];c.fillRect(x-2,y-1,4,2);}
  c.fillStyle='#e4be62';for(const b of world.state.buildings){const x=((b.x-b.y)*32+2048)/4096*w,y=((b.x+b.y)*16-world.tile(b.x,b.y).z*16+96)/2200*h;c.fillRect(x-1,y-1,3,2);}
  c.fillStyle='#f3e9cb';for(const hero of world.state.heroes){c.fillRect(((hero.x-hero.y)*32+2048)/4096*w,((hero.x+hero.y)*16+96)/2200*h,1,1);}
  const camera=this.scene.cameras.main;if(!camera)return;const a=camera.getWorldPoint(0,0),b=camera.getWorldPoint(this.scene.scale.width,this.scene.scale.height);
  c.strokeStyle='#f5ecb7';c.lineWidth=1;c.strokeRect(a.x/4096*w,a.y/2200*h,(b.x-a.x)/4096*w,(b.y-a.y)/2200*h);
 }
}
