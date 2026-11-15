import {World,type State} from '../systems/world';
import {RULES,definitions,heroDefinitions,SIZE} from '../data/rules';
const finite=(n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function validateSave(value:unknown):State {
 if(!value||typeof value!=='object')throw Error('存檔格式錯誤');const s=value as State;
 if(s.version!==1||s.ruleset!==RULES.version)throw Error('存檔版本不相容，原存檔已保留');
 if(!['tick','seed','money','food','population','satisfaction','tax','nextId'].every(k=>finite(s[k as keyof State]))||!Number.isInteger(s.tick)||!Array.isArray(s.buildings)||!Array.isArray(s.heroes)||s.heroes.length!==8||!Array.isArray(s.log)||!s.log.every(x=>typeof x==='string'))throw Error('存檔資料不完整');
 const position=(p:{x:number;y:number})=>Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<SIZE&&p.y<SIZE;
 if(s.buildings.length>4096||new Set(s.buildings.map(b=>b.id)).size!==s.buildings.length||!s.buildings.every(b=>Number.isInteger(b.id)&&b.id>0&&b.id<s.nextId&&b.kind in definitions&&position(b)&&finite(b.progress)&&b.progress<=1&&finite(b.scale)&&[1,2,3].includes(b.level)))throw Error('建築存檔損毀');
 if(new Set(s.heroes.map(h=>h.id)).size!==8||!s.heroes.every(h=>heroDefinitions[h.id]&&position(h)&&finite(h.stamina)&&h.stamina<=100&&typeof h.status==='string'&&Array.isArray(h.path)&&h.path.every(i=>Number.isInteger(i)&&i>=0&&i<4096)&&(h.target===null||s.buildings.some(b=>b.id===h.target))))throw Error('人物存檔損毀');
 return structuredClone(s);
}
function db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open('tiandao-heroes',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('請關閉其他遊戲分頁後重試'));});}
export async function saveWorld(world:World){const state=validateSave(world.state),d=await db();try{await new Promise<void>((resolve,reject)=>{const t=d.transaction('saves','readwrite');t.objectStore('saves').put(state,'manual');t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}finally{d.close();}}
export async function loadWorld(){const d=await db();try{const result=await new Promise<unknown>((resolve,reject)=>{const r=d.transaction('saves').objectStore('saves').get('manual');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});if(!result)throw Error('尚未儲存進度');return new World(validateSave(result));}finally{d.close();}}
