# 資料架構（Data Layer）

## 原則
資料層只描述資料，不包含 UI，不直接操作 Phaser Scene，也不寫畫面事件。

## 建議資料夾
/data
- characters.json
- buildings.json
- settlements.json
- terrain.json
- items.json
- skills.json
- events.json
- factions.json

## Character
- id
- name
- portrait
- sprite
- stats
- profession
- skills
- loyalty
- relationship
- currentSettlement
- currentPosition
- currentTask

## BuildingDefinition
- id
- name
- category
- footprint
- allowedTerrain
- requiredAdjacency
- levelMax
- buildCost
- buildTime
- workerNeed
- populationEffect
- recruitmentEffect
- incomeFormula

## SettlementDefinition
- id
- name
- tier
- width
- height
- maxMajorFacilities
- terrainMap
- initialPopulation
- fertility
- security
- taxRate

## RuntimeState
必須與定義資料分離。
例如 BuildingInstance：
- instanceId
- buildingId
- level
- scale
- managerCharacterId
- condition
- storedFood
- incomeToday
