/** Contracts only. Unconfirmed rules remain data, not active gameplay. */
export type Id = string;
export interface Position { x: number; y: number; elevation: number }
export type Terrain = 'plain'|'forest'|'hill'|'mountain'|'river'|'lake'|'coast'|'sea'|'marsh'|'rock'|'road';
export interface CharacterDefinition { id: Id; name: string; portrait: Id; sprite: Id; stats: Record<'strength'|'skill'|'intelligence'|'charisma'|'stamina'|'loyalty'|'benevolence'|'courage',number>; professions: {id:Id;level:number}[]; skills: Id[]; relationships: Record<Id,number> }
export interface BuildingDefinition { id:Id; asset:Id; footprint:[number,number]; allowedTerrain:Terrain[]; requiredAdjacency:Terrain[]; levelMax:3; buildCost:Record<string,number>; buildTicks:number; workerNeed:number; populationEffect:number; recruitmentEffect:number; incomeRule:Id }
export interface CharacterState { id:Id; settlementId:Id; position:Position; path:Position[]; taskId:Id|null; status:'idle'|'moving'|'working'|'resting'; stamina:number; loyalty:number; travelMode:'foot'|'boat' }
export interface BuildingState { id:Id; definitionId:Id; position:Position; level:1|2|3; scale:number; progress:number; managerId:Id|null; workerIds:Id[]; condition:number; storedFood:number; incomeToday:number }
export interface SettlementDefinition { id:Id; width:number; height:number; tier:string; maxMajorFacilities:number; terrainMap:Id; seed:number; initialPopulation:number; fertility:number; security:number; taxRate:number }
export interface RuntimeState { tick:number; rngState:number; rulesetVersion:string; tiles:{terrain:Terrain;position:Position}[]; characters:CharacterState[]; buildings:BuildingState[]; resources:Record<'money'|'food'|'wood'|'stone',number>; population:{total:number;housingCapacity:number;labor:number;recruitable:number;satisfaction:number}; tasks:{id:Id;startTick:number;duration:number;progress:number}[] }
export interface SaveEnvelope { schemaVersion:1; savedAt:string; state:RuntimeState }
export interface SaveRepository { save(slot:Id,value:SaveEnvelope):Promise<void>; load(slot:Id):Promise<SaveEnvelope|null> }
export type Command = {type:'assign';characterIds:Id[];buildingId:Id}|{type:'planBuilding';definitionId:Id;position:Position}|{type:'demolish';buildingId:Id};
export interface Simulation { dispatch(command:Command):void; step(ticks:number):void; snapshot():Readonly<RuntimeState> }
export interface FutureSystems { recruitment?:{candidateIds:Id[]}; diplomacy?:{factionIds:Id[]}; expeditions?:{id:Id;destination:Id}[]; combat?:{encounterId:Id} }
export interface AssetDefinition { id:Id; version:string; source:string; license:string; status:'planned'|'temporary'|'approved'; path:string|null; anchor:[number,number] }
