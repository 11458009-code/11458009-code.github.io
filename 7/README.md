# 英文單字選擇題測驗 - Google Apps Script

## 📖 功能說明

這是一個基於Google Apps Script的英文單字測驗系統，具有以下特點：

- ✅ 從Google Sheets隨機抽取10題題目
- ✅ 選擇題格式呈現（ABCD四選一）
- ✅ 自動評分（每題10分，總分100分）
- ✅ 支援中英混合題目
- ✅ 美觀的響應式界面
- ✅ 即時反饋和成績顯示

## 🚀 使用方法

### 1. 準備Google Sheets數據

在Google Sheets中設定你的題庫，格式如下：

| 題目 | 選項A | 選項B | 選項C | 選項D | 答案 |
|------|-------|-------|-------|-------|------|
| What does 'serendipity' mean? | 偶然發生的幸運事件 | 刻意計劃的事件 | 不幸的意外 | 重複發生的事件 | A |
| Which word means '厭煩'? | Happy | Tedious | Exciting | Beautiful | B |

### 2. 在Google Apps Script中部署

1. 打開 [Google Apps Script](https://script.google.com/)
2. 創建新項目
3. 複製 `Code.gs` 中的代碼
4. **修改第1-2行：**
   ```javascript
   const SPREADSHEET_ID = "你的Sheets ID"; // 替換為你的Google Sheets ID
   const SHEET_NAME = "Sheet1"; // 如需要則修改工作表名稱
   ```
5. **獲取你的Google Sheets ID：**
   - 打開你的Google Sheets
   - URL中提取：`https://docs.google.com/spreadsheets/d/你的ID/edit...`

### 3. 部署為網頁應用

1. 點擊「部署」→「新增部署項目」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - 執行身份：選擇你的Google帳戶
   - 使用者存取權：選擇「任何人」
4. 複製部署後的URL

### 4. 開始測驗

打開部署後的URL，系統將：
- 從你的Sheets隨機讀取題目
- 隨機選擇10題
- 呈現選擇題界面
- 自動計算成績

## 📊 評分標準

- **每題10分** × 10題 = **100分**
- 90分以上：太棒了！🌟
- 60-89分：不錯喔！👍
- 60分以下：加油！💪

## 🎨 界面特點

- 紫色漸層設計風格
- 清晰的題目呈現
- 即時答案反饋
- 成績統計顯示
- 支援重新開始功能

## 📝 數據格式要求

- **第1列**：題目（可中英混用）
- **第2-5列**：選項 A、B、C、D
- **第6列**：正確答案（A、B、C、D 其中之一）
- 空行會被自動跳過

## ⚙️ 自訂設定

在 `Code.gs` 中可修改的參數：

```javascript
// 修改抽取題目數量
shuffled.slice(0, 10)  // 改為其他數字

// 修改每題分數
score += 10  // 改為其他分數

// 修改評分標準
percentage >= 80 ? '太棒了！' : '不錯喔！'
```

## 🆘 常見問題

**Q: 無法連接到Google Sheets？**
- 檢查SPREADSHEET_ID是否正確
- 確保該Sheets是你的課程或已分享
- 檢查GAS的執行權限

**Q: 題目顯示為空？**
- 確認Sheet名稱是否正確
- 確保數據從第2行開始（第1行為標題）

**Q: 如何修改題目？**
- 直接編輯Google Sheets中的內容
- 重新載入測驗頁面即可看到新題目

## 📧 技術支援

如有問題，請檢查：
1. Google Sheets是否有正確的資料
2. SPREADSHEET_ID是否正確
3. Google Apps Script是否有適當的權限

---

祝你測驗順利！📚✨
