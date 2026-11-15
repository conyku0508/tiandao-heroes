# 第一版體驗交付

使用者同意建議後實作。尚未合併main或公開發布Pages。

## 實作範圍
- Task2：原創像素原型PNG、地圖渲染、高低地形與獨立資產來源。非正式美術定稿。
- Task3：開始畫面、橫屏資源列、時間控制、浮動詳情、可收合工具列、地圖拖曳／縮放、人物與建築選取、安全區與直向提示。
- Task4：8好漢，建設合法性／預覽／確認／施工／拆除，A*尋路及多人派工、季節結算、稅率／人口／民居、IndexedDB與版本檢查。
- Task5：型別、單元測試、Chromium桌面與844×390尺寸檢查；CI與手動Pages設定。真機及正式Pages部署尚未驗收。

## 模組與檔案
- src/data/rules.ts：原創測試人物、設施與暫定數值。
- src/data/assets.json、public/assets/*.png、scripts/create-art.py：素材、版本、來源與重製工具。
- src/systems/world.ts：地圖、建設、尋路、派工、固定tick、經濟人口。
- src/services/save.ts：IndexedDB交易、存檔驗證。
- src/view/FortressScene.ts：地圖渲染與鏡頭／觸控事件。
- src/main.ts、src/style.css、index.html：UI、指令連接與響應式介面。
- tests/simulation.test.ts、tests/contracts.test.mjs：8項測試。
- scripts/browser-check.cjs：瀏覽器流程檢查。
- README、docs與.github/workflows：交付與建置發布說明。

## 已知限制
美術為程序繪製原型，與參考圖的細節密度有落差；人物尚無走路影格。高低地形可見，但地形互動仍簡化；森林整地、建築升級與完整經濟尚待後續。半年度收成採縮短測試曆法，遊戲畫面／指引標示暫定。暫停及背景處理不追趕離線時間。

存檔僅保存單一手動槽；地圖由固定演算法與ruleset版本重建（目前不能修改地形），不是跨裝置雲端同步。舊版遷移待出現v2後新增；未知版本明確拒絕。

軟體渲染的雲端Chromium速度不代表手機GPU效能。真機多指與不同瀏覽器儲存限制仍待實測。Phaser bundle約1.24MB（gzip約344KB），仍有Vite體積警告。

## 下一步
先試完整建造→派工→收成→存讀檔循環，回饋建築／人物大小、鏡頭範圍、手機面板與美術方向，再細化美術及補上整地、升級。不擴展戰鬥／外交。

## 驗證結果
- npm ci、TypeScript檢查、8項單元／資料契約測試與production build通過。
- Chromium流程：實際地圖點擊建造、雙人派工、推進到收成、IndexedDB儲存→重新載入→完整state一致、暫停不推進、4×推進、滑鼠拖曳、模擬雙指縮放、844×390無水平溢出、390×844旋轉提示，全部通過；未偵測到JS錯誤。
- 測試為自動化模擬，未等同iPhone/iPad真機驗收。共用桌面瀏覽器初始化失敗；使用獨立Chromium完成測試。
- 可下載第一版靜態建置包；需HTTP服務，不能直接雙擊index.html。Pages仍未發布。

## 試玩回饋修正：節奏與地圖比例
1×改為24秒／日（2×12秒、4×6秒），保持人物移動速度；prototype-1存檔載入時tick乘24，保留日期與施工百分比，不修改原存檔。手機預設鏡頭1.05、桌面1.4，上方手機資訊列縮至50px。原型美術仍待正式製作，不宣稱已達參考圖品質。
