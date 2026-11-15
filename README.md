# 天導群英錄

原創 H5 山寨經營原型。Phaser 3 + TypeScript + Vite，手機橫屏優先。

## 體驗第一版

Node.js 22.12+ 或24：

```sh
npm ci
npm run dev
```

開啟 http://localhost:5173/tiandao-heroes/ 。同網路手機可使用開發機IP與5173連接埠（需允許防火牆）。雲端工作區的localhost不能當作公開手機網址。

進入山寨 → 內政 → 耕地 → 點空地 → 確認 → 指派好漢 → 勾選人物 → 確認派工 → 1×或4× → 觀察施工與收成 → 存檔。重新開啟同來源網頁後選「讀取存檔」。存檔保存在目前瀏覽器IndexedDB，跨裝置不會同步。

地圖可拖曳、雙指縮放、滾輪縮放；點人物或建築顯示面板。手機直向會顯示旋轉提示。時間暫停時可下令，離開分頁自動暫停。

## 已實作

- 64×64固定種子地形、64×32菱形格、暫定16px階高；平地、山坡、岩地、森林、河流、道路與橋。
- 8位原創測試好漢；尋路、繞障礙、橋梁優先與過水船型。
- 9種可建設項目，合法性預覽、扣款、到場施工、多人派工、規模成長、拆除確認。
- 暫停/1×/2×/4×，固定tick可重現模擬，金錢／糧食／人口、稅率、滿意度、自動民居與容量。
- IndexedDB存讀檔、版本／資料檢查、不相容檔案拒讀而不覆寫。

所有平衡數值均為暫定：1×現實24秒=遊戲1日；測試季30日、半年60日；耕地半年、漁場與商業每季結算。這是縮短的測試曆法，不是原作數值。原作設施購糧、完整人口經濟公式尚未還原。

## 美術狀態

目前使用依使用者參考圖風格設計的原創建築／環境4×4圖集及人物4×2圖集，由image_gen產生並做透明處理。群聚民居、寨牆寨門、水道、橋梁、院落與農田共同構成新版聚落。素材與人物面板一致，可獨立替換；來源、版本與格號記錄於src/data/assets.json，完整說明見[整體美術重做](docs/DENSE-ART-DIRECTION.md)。舊版程序素材與生成腳本保留作歷史版本；正常建置不需Python。

新局為聚落美術v4。舊存檔保留原地圖及進度，但建築、林木和人物套用新素材。人物目前為靜態造型，素材仍待美術方向驗收。

## 測試

`npm run typecheck`、`npm test`、`npm run build`。美術與小地圖檢查：node scripts/dense-art-check.cjs、node scripts/classic-ui-check.cjs。啟動dev後執行 `node scripts/browser-check.cjs` 進行Chromium流程測試；預設 `/usr/bin/chromium`，可設CHROMIUM_PATH。測試專用狀態入口僅DEV且網址帶?test時啟用，production不提供。

## 部署

PR/push CI執行npm ci、型別檢查、測試和build，提供dist artifact下載。公開測試站：https://conyku0508.github.io/tiandao-heroes/ 。Pages工作流程採手動發布，更新經PR合併後執行Publish Pages manually。Vite base為 `/tiandao-heroes/`。

## 後續保留

建築升級、整地、完整職業／體力成長、徵兵、招募、外交、遠征、世界地圖與戰鬥；後續存檔格式遷移、音效與動畫、細緻美術、真機手勢驗收。普通居民仍以人口與自動住宅表現，不新增可操作NPC。

[規格差異](docs/DECISIONS.md) · [架構](docs/ARCHITECTURE.md) · [美術草案](docs/ART-DIRECTION.md) · [第一版交付](docs/PROTOTYPE.md)

## 經典介面更新

上方內政／人物／情報與存讀檔選單、灰色藍標題浮窗、底部事件及右下可操作小地圖。新局為聚落美術v4，v1/v2/v3舊存檔保留各自地形。查核來源與差異見 [CLASSIC-UI-REFERENCE](docs/CLASSIC-UI-REFERENCE.md)。
