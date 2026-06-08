// 設定Google Sheets的ID - 需要修改為你的Sheets ID
const SPREADSHEET_ID = "14z5zK9wqudED1b9nGrgX8unqh_vpq6UqPHyQrpuZhT4";
const SHEET_NAME = "Sheet1"; // 修改為你的工作表名稱

/**
 * 從Google Sheets讀取題目資料
 */
function getQuestionsFromSheet() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const questions = [];
    
    // 假設格式：題目 | 選項A | 選項B | 選項C | 選項D | 答案
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == "") continue; // 跳過空行
      
      questions.push({
        question: data[i][0],      // 題目
        optionA: data[i][1] || "",
        optionB: data[i][2] || "",
        optionC: data[i][3] || "",
        optionD: data[i][4] || "",
        answer: data[i][5] || ""   // 正確答案
      });
    }
    
    return questions;
  } catch (error) {
    Logger.log("錯誤：" + error.toString());
    return [];
  }
}

/**
 * 隨機選擇10題題目
 */
function getRandomQuestions() {
  const allQuestions = getQuestionsFromSheet();
  
  if (allQuestions.length === 0) {
    Logger.log("警告：未能從Sheets讀取題目");
    return getDemoQuestions();
  }
  
  // 隨機打亂陣列
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  
  // 選擇前10題
  return shuffled.slice(0, 10);
}

/**
 * 示範數據（如果無法連接試卷則使用）
 */
function getDemoQuestions() {
  return [
    {
      question: "What does 'serendipity' mean?",
      optionA: "偶然發生的幸運事件",
      optionB: "刻意計劃的事件",
      optionC: "不幸的意外",
      optionD: "重複發生的事件",
      answer: "A"
    },
    {
      question: "Which word means '厭煩'?",
      optionA: "Happy",
      optionB: "Tedious",
      optionC: "Exciting",
      optionD: "Beautiful",
      answer: "B"
    },
    {
      question: "'Eloquent' means:",
      optionA: "沉默的",
      optionB: "善辯的",
      optionC: "困惑的",
      optionD: "聾子的",
      answer: "B"
    },
    {
      question: "'Ephemeral' 的意思是什麼?",
      optionA: "永久的",
      optionB: "重要的",
      optionC: "短暫的",
      optionD: "快速的",
      answer: "C"
    },
    {
      question: "What is '冗長' in English?",
      optionA: "Brief",
      optionB: "Verbose",
      optionC: "Concise",
      optionD: "Clear",
      answer: "B"
    },
    {
      question: "'Ambiguous' 的中文意思是：",
      optionA: "清楚的",
      optionB: "模糊的",
      optionC: "明智的",
      optionD: "優雅的",
      answer: "B"
    },
    {
      question: "Which word means '勤奮的'?",
      optionA: "Lazy",
      optionB: "Diligent",
      optionC: "Careless",
      optionD: "Idle",
      answer: "B"
    },
    {
      question: "'Candid' means:",
      optionA: "虛偽的",
      optionB: "隱瞞的",
      optionC: "率直的",
      optionD: "謹慎的",
      answer: "C"
    },
    {
      question: "What does '稀有' mean in English?",
      optionA: "Common",
      optionB: "Abundant",
      optionC: "Scarce",
      optionD: "Ordinary",
      answer: "C"
    },
    {
      question: "'Meticulous' 表示：",
      optionA: "粗心的",
      optionB: "細心的",
      optionC: "健忘的",
      optionD: "草率的",
      answer: "B"
    }
  ];
}

/**
 * 創建測驗HTML界面
 */
function doGet() {
  const questions = getRandomQuestions();
  const html = createQuizHTML(questions);
  
  return HtmlService.createHtmlOutput(html)
    .setWidth(900)
    .setHeight(700);
}

/**
 * 生成測驗HTML
 */
function createQuizHTML(questions) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          min-height: 100vh;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          padding: 40px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #333;
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #666;
          font-size: 14px;
        }
        
        .quiz-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 15px;
          background: #f0f4ff;
          border-radius: 8px;
        }
        
        .quiz-info span {
          font-weight: bold;
          color: #667eea;
        }
        
        .question-container {
          margin-bottom: 35px;
          padding: 20px;
          border-left: 4px solid #667eea;
          background: #f9f9f9;
          border-radius: 8px;
        }
        
        .question-number {
          color: #667eea;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .question-text {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .option {
          display: flex;
          align-items: center;
          padding: 12px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .option:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }
        
        .option input[type="radio"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .option label {
          flex: 1;
          cursor: pointer;
          font-size: 15px;
          color: #333;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 40px;
        }
        
        button {
          padding: 12px 30px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }
        
        .submit-btn {
          background: #667eea;
          color: white;
          padding: 12px 50px;
        }
        
        .submit-btn:hover {
          background: #5a67d8;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .reset-btn {
          background: #e0e0e0;
          color: #333;
          padding: 12px 50px;
        }
        
        .reset-btn:hover {
          background: #d0d0d0;
        }
        
        #results {
          display: none;
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          color: white;
          margin-top: 30px;
        }
        
        #results h2 {
          font-size: 32px;
          margin-bottom: 20px;
        }
        
        #results p {
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .score-display {
          font-size: 48px;
          font-weight: bold;
          margin: 20px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .hidden {
          display: none !important;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 英文單字選擇題測驗</h1>
          <p>English Vocabulary Quiz</p>
        </div>
        
        <div id="quizSection">
          <div class="quiz-info">
            <span>題目數：10 題</span>
            <span>滿分：100 分</span>
            <span>每題：10 分</span>
          </div>
          
          <form id="quizForm">
  `;
  
  // 生成每一題
  questions.forEach((q, index) => {
    html += `
      <div class="question-container">
        <div class="question-number">第 ${index + 1} 題</div>
        <div class="question-text">${q.question}</div>
        <div class="options">
          <div class="option">
            <input type="radio" id="q${index}_a" name="q${index}" value="A" required>
            <label for="q${index}_a">(A) ${q.optionA}</label>
          </div>
          <div class="option">
            <input type="radio" id="q${index}_b" name="q${index}" value="B">
            <label for="q${index}_b">(B) ${q.optionB}</label>
          </div>
          <div class="option">
            <input type="radio" id="q${index}_c" name="q${index}" value="C">
            <label for="q${index}_c">(C) ${q.optionC}</label>
          </div>
          <div class="option">
            <input type="radio" id="q${index}_d" name="q${index}" value="D">
            <label for="q${index}_d">(D) ${q.optionD}</label>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `
          </form>
          
          <div class="button-group">
            <button type="button" class="submit-btn" onclick="submitQuiz()">提交答案</button>
            <button type="button" class="reset-btn" onclick="resetQuiz()">重新開始</button>
          </div>
        </div>
        
        <div id="results"></div>
      </div>
      
      <script>
        const answers = ${JSON.stringify(questions.map(q => q.answer))};
        
        function submitQuiz() {
          const form = document.getElementById('quizForm');
          let score = 0;
          let answered = 0;
          let resultHTML = '';
          
          for (let i = 0; i < answers.length; i++) {
            const selected = document.querySelector(\`input[name="q\${i}"]:checked\`);
            if (selected) {
              answered++;
              if (selected.value === answers[i]) {
                score += 10;
              }
            }
          }
          
          if (answered < answers.length) {
            alert('請答完所有題目！');
            return;
          }
          
          // 顯示結果
          document.getElementById('quizSection').classList.add('hidden');
          const resultsDiv = document.getElementById('results');
          resultsDiv.style.display = 'block';
          
          const percentage = score;
          const message = percentage >= 80 ? '太棒了！' : 
                         percentage >= 60 ? '不錯喔！' : '加油！';
          
          resultsDiv.innerHTML = \`
            <h2>\${message}</h2>
            <p>你的測驗成績</p>
            <div class="score-display">\${percentage}/100</div>
            <p>答對 \${score/10} / 10 題</p>
          \`;
          
          // 添加重新開始按鈕
          const button = document.createElement('button');
          button.textContent = '重新測驗';
          button.className = 'submit-btn';
          button.style.marginTop = '20px';
          button.onclick = () => location.reload();
          resultsDiv.appendChild(button);
        }
        
        function resetQuiz() {
          document.getElementById('quizForm').reset();
        }
      </script>
    </body>
    </html>
  `;
  
  return html;
}
