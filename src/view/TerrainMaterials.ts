/** Original fine-grain pixel surfaces. No source-game texture is sampled. */
export function makeTerrainMaterials(ctx:CanvasRenderingContext2D){
 const result=new Map<string,CanvasPattern>();
 const palettes:Record<string,string[]>={
  plain:['#718746','#647c3e','#82934e','#8b9d57','#596f37'],
  forest:['#526c38','#4c6433','#617c3e','#73874a','#455e31'],
  hill:['#718346','#6a7a43','#849051','#5e723b','#8b9455'],
  rock:['#777d69','#646f60','#8e9278','#a0a085','#535e52'],
  road:['#b4a27d','#a89875','#c0ae89','#978b6b','#c7b48e'],
  river:['#328c9d','#2a7c90','#419bac','#56afbb','#247589']
 };
 for(const [kind,palette] of Object.entries(palettes)){
  const tile=document.createElement('canvas');tile.width=64;tile.height=64;const d=tile.getContext('2d')!;
  let seed=108+kind.length;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  d.fillStyle=palette[0];d.fillRect(0,0,64,64);
  for(let i=0;i<(kind==='river'?120:950);i++){
   const x=Math.floor(random()*64),y=Math.floor(random()*64);d.fillStyle=palette[Math.floor(random()*palette.length)];
   d.fillRect(x,y,kind==='river'?3+Math.floor(random()*8):1+Math.floor(random()*2),1);
  }
  if(kind==='road')for(let i=0;i<55;i++){const x=Math.floor(random()*64),y=Math.floor(random()*64);d.fillStyle=i%2?'#c2b99c':'#8d896e';d.fillRect(x,y,3,2);d.fillStyle='#d3c8a6';d.fillRect(x,y,2,1);}
  if(kind==='rock')for(let i=0;i<45;i++){const x=Math.floor(random()*64),y=Math.floor(random()*64);d.strokeStyle=palette[i%5];d.beginPath();d.moveTo(x,y);d.lineTo(x+3+random()*6,y-2);d.stroke();}
  result.set(kind,ctx.createPattern(tile,'repeat')!);
 }
 return result;
}
