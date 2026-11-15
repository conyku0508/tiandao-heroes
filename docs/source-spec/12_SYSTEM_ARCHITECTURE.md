# 程式架構

/game
  /data
  /ui
  /systems
  /scenes
  /entities
  /services
  /assets

## Data
純 JSON / schema。

## UI
只處理顯示與互動，不寫經濟公式。

## Systems
- TimeSystem
- MovementSystem
- TaskSystem
- BuildingSystem
- TerrainSystem
- PopulationSystem
- EconomySystem
- RecruitmentSystem
- AIWorldSystem

## Entity
CharacterEntity / BuildingEntity / SettlementEntity。

## 禁止事項
- UI 元件直接修改 JSON 定義檔
- Phaser Scene 裡寫死人物資料
- 建築按鈕直接塞經濟公式
- Character class 硬寫所有角色數值
