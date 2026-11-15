# 天導群英錄

原創 H5 山寨經營原型。Phaser 3 + TypeScript + Vite，手機橫屏優先。

## 體驗第一版

Node.js 22.12+ 或24：

```sh
npm ci
npm run dev
```

開啟 http://localhost:5173/tiandao-heroes/ 。同網路手機可使用開發機IP與5173連接埠（需允許防火牆）。雲端工作區的localhost不能當作公開手機網址。

進入山寨 → 營建 → 耕地 → 點空地 → 確認 → 指派好漢 → 勾選人物 → 確認派工 → 1×或4× → 觀察施工與收成 → 存檔。重新開啟同來源網頁後選「讀取存檔」。存檔保存在目前瀏覽器IndexedDB，跨裝置不會同步。

地圖可拖曳、雙指縮放、滾輪縮放；點人物或建築顯示面板。手機直向會顯示旋轉提示。時間暫停時可下令，離開分頁自動暫停。

## 已實作

- 64×64固定種子地形、64×32菱形格、暫定16px階高；平地、山坡、岩地、森林、河流、道路與橋。
- 8位原創測試好漢；尋路、繞障礙、橋梁優先與過水船型。
- 9種可建設項目，合法性預覽、扣款、到場施工、多人派工、規模成長、拆除確認。
- 暫停/1×/2×/4×，固定tick可重現模擬，金錢／糧食／人口、稅率、滿意度、自動民居與容量。
- IndexedDB存讀檔、版本／資料檢查、不相容檔案拒讀而不覆寫。

所有平衡數值均為暫定：1×現實1秒=遊戲1日；測試季30日、半年60日；耕地半年、漁場與商業每季結算。這是縮短的測試曆法，不是原作數值。原作設施購糧、完整人口經濟公式尚未還原。

## 美術狀態

自製程式繪製像素原型素材，來源為 `scripts/create-art.py`，不含第三方圖像。11項資產定義可替換；素材狀態temporary，尚未達到參考圖的精緻程度，待風格驗收。產圖需Python與Pillow13；PNG已納入版本管理，正常建置不需Python。

## 測試

`npm run typecheck`、`npm test`、`npm run build`。啟動dev後執行 `node scripts/browser-check.cjs` 進行Chromium流程測試；預設 `/usr/bin/chromium`，可設CHROMIUM_PATH。測試專用狀態入口僅DEV且網址帶?test時啟用，production不提供。

## 部署

PR/push CI執行npm ci、型別檢查、測試和build，提供dist artifact下載。Pages工作流程採手動發布；尚未實際部署。需合併／確認發布，Repository Settings → Pages選GitHub Actions，再執行Publish Pages manually。Vite base為 `/tiandao-heroes/`。

## 後續保留

建築升級、整地、完整職業／體力成長、徵兵、招募、外交、遠征、世界地圖與戰鬥；完整存檔舊版遷移（目前僅v1）、音效與動畫、細緻美術、真機手勢驗收。普通居民仍以人口與自動住宅表現，不新增可操作NPC。

[規格差異](docs/DECISIONS.md) · [架構](docs/ARCHITECTURE.md) · [美術草案](docs/ART-DIRECTION.md) · [第一版交付](docs/PROTOTYPE.md)
