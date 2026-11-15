import type Phaser from 'phaser';
/** UI portraits use the same replaceable original actor art as the map. */
export function drawHeroPortraits(root:HTMLElement,scene:Phaser.Scene){
 for(const canvas of Array.from(root.querySelectorAll<HTMLCanvasElement>('canvas[data-portrait]'))){
  const id=Number(canvas.dataset.portrait);const key=scene.textures.exists('dense-hero-'+id)?'dense-hero-'+id:'hero-'+id;
  const source=scene.textures.get(key).getSourceImage() as HTMLCanvasElement;
  const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;
  const ratio=Math.min(canvas.width/source.width,canvas.height/source.height);
  ctx.drawImage(source,(canvas.width-source.width*ratio)/2,canvas.height-source.height*ratio,source.width*ratio,source.height*ratio);
 }
}
