# Task 1交付

完成：來源盤點、差異與待裁決清單、架構／存檔遷移設計、靜態Schema、Phaser/Vite初始化、CI及手動Pages設定。

尚未完成：Task2–5的遊戲美術、地圖、人物、觸控、模擬、存讀檔、真機驗收和實際發布。初始化頁可本地執行，並非遊戲畫面。

新增／修改清單（README為修改，其餘新增；另含package-lock.json與本文件）：

- `.github/workflows/ci.yml`
- `.github/workflows/pages.yml`
- `.gitignore`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/ART-DIRECTION.md`
- `docs/DECISIONS.md`
- `docs/source-manifest.json`
- `docs/source-spec/00_PROJECT.md`
- `docs/source-spec/01_GAME_LOOP.md`
- `docs/source-spec/02_DATA_ARCHITECTURE.md`
- `docs/source-spec/03_UI_FLOW.md`
- `docs/source-spec/04_CHARACTER_SYSTEM.md`
- `docs/source-spec/05_FORTRESS_SYSTEM.md`
- `docs/source-spec/06_WORLD_MAP.md`
- `docs/source-spec/07_MVP_SCOPE.md`
- `docs/source-spec/08_POPULATION_ECONOMY.md`
- `docs/source-spec/09_TERRAIN_SYSTEM.md`
- `docs/source-spec/10_TIME_SIMULATION.md`
- `docs/source-spec/11_VISUAL_REFERENCE.md`
- `docs/source-spec/12_SYSTEM_ARCHITECTURE.md`
- `docs/source-spec/CODEX_PROMPT.md`
- `docs/source-spec/README_INDEX.md`
- `index.html`
- `package-lock.json`
- `package.json`
- `src/data/assets.json`
- `src/data/map.json`
- `src/domain/schema.ts`
- `src/main.ts`
- `src/style.css`
- `src/view/BootScene.ts`
- `tests/contracts.test.mjs`
- `tsconfig.json`
- `vite.config.ts`

驗證：npm ci（工作區cache）成功；TypeScript檢查通過；2項資料契約測試通過；production build成功。未做瀏覽器／手機真機驗收。已知：Phaser主bundle約1.21MB（gzip333KB），Vite提示超過500KB；後續美術載入階段評估拆包。
