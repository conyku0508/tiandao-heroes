# 技術架構與資料契約

src/data：JSON定義（地圖、資產；後續人物、職業、地形、建築、劇本、經濟、物品、技能、事件、勢力）。src/domain：純TypeScript資料契約與後續系統，不依賴Phaser/DOM。src/view：Phaser場景與後續DOM/Vue面板。src/services：存檔與資源載入介面實作位置，現階段尚無IndexedDB實作。

UI → Command → Simulation → snapshot → Renderer。UI不能直接修改定義或其他面板；所有經濟公式只放系統。定義與RuntimeState分開，資產用ID連結、版本與來源各自追蹤。schema.ts為初始靜態契約，不是執行期驗證器；內容輸入與讀檔驗證於Task4補齊。

後續系統：Time、Movement、Task、Building、Terrain、Population、Economy；Recruitment與AIWorld保留。固定整數tick＋seeded PRNG＋按tick排序命令日誌；不以渲染delta直接更新經濟。倍速只影響推進tick數；暫停仍接受命令；背景頁預設停止推進的建議待操作設計確認。不得以Date.now/Math.random作模擬來源。

IndexedDB設計：database tiandao-heroes、object store saves、slot鍵；envelope包含schemaVersion、rulesetVersion、tick與rngState。先驗證再載入，逐版本純函式遷移後交易寫入，保留舊檔；未知未來版本拒讀而不覆寫。儲存失敗可重試，禁止提示假成功。Task1僅契約，尚未實作save/load/migration。

Phaser.AUTO選WebGL並支援Canvas回退；Task2起避免僅WebGL可用的shader。Vite base固定本repository子路徑；未來所有資產透過import.meta.env.BASE_URL或Vite import引用，禁止硬寫根路徑。沒有後端。
