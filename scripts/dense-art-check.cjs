const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1440,height:900}});const errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await p.goto('http://127.0.0.1:5173/tiandao-heroes/?test&canvas');await p.waitForFunction(()=>window.__game?.scene.marker);await p.click('#start');
 const state=await p.evaluate(()=>{const {world:w,scene:s}=window.__game;return {version:w.state.mapVersion,homes:w.state.buildings.filter(b=>b.kind==='housing').length,bridges:s.objects.filter(o=>o.texture?.key==='dense-bridge').length,water:w.tile(25,32).kind,newArt:s.artKey('headquarters'),heroKeys:s.heroes.map(h=>h.texture.key)};});
 assert.equal(state.version,4);assert.ok(state.homes>=10);assert.equal(state.bridges,3);assert.equal(state.water,'river');assert.equal(state.newArt,'dense-headquarters');assert.deepEqual(state.heroKeys,Array.from({length:8},(_,i)=>'dense-hero-'+i));
 const buildingPoint=await p.evaluate(()=>{const s=window.__game.scene,o=s.objects.find(o=>o.texture?.key==='dense-headquarters'),c=s.cameras.main,left=c.getWorldPoint(0,0);return {x:(o.x-left.x)*c.zoom,y:(o.y-70-left.y)*c.zoom};});await p.mouse.click(buildingPoint.x,buildingPoint.y);assert.ok((await p.locator('#panel h2').textContent()).includes('聚義堂'));await p.click('.close');
 const heroPoint=await p.evaluate(()=>{const s=window.__game.scene,o=s.heroes[0],c=s.cameras.main,left=c.getWorldPoint(0,0);return {x:(o.x-left.x)*c.zoom,y:(o.y-18-left.y)*c.zoom};});await p.mouse.click(heroPoint.x,heroPoint.y);assert.ok((await p.locator('#panel h2').textContent()).includes('沈青嶺'));assert.equal(await p.locator('canvas[data-portrait]').count(),1);await p.click('.close');
 await p.screenshot({path:'/workspace/dense-scene-desktop.png',timeout:60000});
 await p.evaluate(()=>window.__game.scene.onScenery('糧倉與工坊（景觀）'));assert.ok((await p.locator('#panel').textContent()).includes('景觀'));await p.click('.close');
 await p.setViewportSize({width:844,height:390});await p.waitForTimeout(350);await p.screenshot({path:'/workspace/dense-scene-mobile.png',timeout:60000});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log('PASS: dense art atlas, at least 10 housing clusters, 3 grouped bridges, interior water, scenery panel, mobile overflow and asset loading');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
