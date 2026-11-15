const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173/tiandao-heroes/?test&canvas');await p.waitForFunction(()=>window.__game?.scene.marker);await p.click('#start');
 await p.evaluate(()=>{const s=window.__game.scene,b=window.__game.world.state.buildings.find(b=>b.kind==='market');s.onSelect(b.x,b.y,null);});await p.locator('.building-preview').waitFor();
 await p.screenshot({path:'/workspace/classic-scene-desktop.png',timeout:60000});
 await p.click('.close');
 for(const [width,height] of [[844,390],[667,375],[1024,768]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(250);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await p.locator('[data-action="build"]').isVisible(),true);
  const controls=await p.locator('#speeds').boundingBox();assert.ok(controls.x+controls.width<=width);
  const prior=await p.evaluate(()=>window.__game.scene.cameras.main.scrollX);
  await p.locator('#minimap').click({position:{x:25,y:25}});
  assert.notEqual(await p.evaluate(()=>window.__game.scene.cameras.main.scrollX),prior);
  await p.click('#center');
  await p.click('#minimap-toggle');assert.equal(await p.locator('#minimap').isVisible(),false);await p.click('#minimap-toggle');
  if(width===844)await p.screenshot({path:'/workspace/classic-scene-mobile.png',timeout:60000});
 }
 assert.deepEqual(errors,[]);console.log('PASS: classic window, live minimap pan/collapse, viewport controls and overflow at 3 device sizes; no JS errors');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
