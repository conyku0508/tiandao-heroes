# tiandao-heroes
Ancient Chinese fortress strategy H5 game

## Task 1 初始化

《天導群英錄》Phase 1，現階段只有引擎啟動檢查頁，尚不是可玩遊戲。

Node.js 22.12+ 或24；執行 `npm ci`、`npm run dev`，開啟 `/tiandao-heroes/`。
檢查：`npm run typecheck`、`npm test`、`npm run build`。

- [規格整合／待裁決](docs/DECISIONS.md)
- [架構與存檔設計](docs/ARCHITECTURE.md)
- [美術規範草案](docs/ART-DIRECTION.md)
- [原規格原文索引](docs/source-spec/README_INDEX.md)

CI在push/PR檢查；Pages僅手動workflow_dispatch，不自動發布。需使用者合併及確認發布後在Repository Settings → Pages選GitHub Actions，再執行Publish Pages manually。預期網址 https://conyku0508.github.io/tiandao-heroes/ ，尚未部署，不宣稱可用。

建築、人物、時間模擬、觸控、經濟、IndexedDB與正式美術均待後續任務；Task1只提供資料契約與資產目錄。所有不明公式保留暫定，不冒充原作規則。
