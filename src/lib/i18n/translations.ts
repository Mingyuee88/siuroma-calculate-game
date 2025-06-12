import { MathGame } from "@/components/MathGame";

export const translations = {
  en: {
    // Header & Navigation
    title: "Math Explorer",
    subtitle: "Math Game for Young Learners",
    language: "Language",
    english: "English",
    traditionalChinese: "Traditional Chinese",
    simplifiedChinese: "Simplified Chinese",

    // Game Settings
    gameSettings: {
      gameSelection: "Game Selection",
      title: "Game Settings",
      difficultyMode: "Difficulty Mode",
      gameType: "Game Type",
      mathGame: "Math Game",
      englishGame: "English Game",
      adaptiveMode: "Adaptive Mode",
      adaptiveModeDesc: "Automatically adjusts difficulty based on performance",
      fixedDifficulty: "Fixed Difficulty",
      ageLevels: {
        easy: "3-4 Years",
        medium: "4-5 Years",
        hard: "5-6 Years"
      },
      questionsPerSession: "Questions per Session",
      questionCounts: {
        ten: "10 Questions",
        twenty: "20 Questions",
        thirty: "30 Questions"
      },

      gameSelect: "Game Selection",
      selection:{
        MathGame: "Math Game",
        EnglishGame: "English Game",
      },

      gameMode: "Game Mode",
      operations: {
        addition: "Addition",
        subtraction: "Subtraction",
        division: "Division"
      },
      visualAid: "Visual Aid",
      visualTypes: {
        blocks: "Blocks",
        animals: "Animals",
        shapes: "Shapes",
        numberLine: "Number Line"
      },
      visualAidOptions: {
        blocks: "Blocks",
        animals: "Animals",
        shapes: "Shapes",
        numberLine: "Number Line"
      }
    },

    // Session Management
    session: {
      settings: "Session Settings",
      gameModeLabel: "Game Mode:",
      ageLevel: "Age Level (Difficulty):",
      adaptiveModeLabel: "Adaptive (Auto-adjusts)",
      questionsLabel: "Questions:",
      perSession: "per session",
      visualAidLabel: "Visual Aid:",
      start: "Start Session",
      complete: "Session Complete!",
      score: "Your score:",
      timeTaken: "Time taken:",
      startNew: "Start New Session",
      end: "End Session",
      restart: "Restart",
      progress: "Session Progress:",
      questions: "questions",
      time: "Time:",
      currentLevel: "Current Level:",
      levels: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
      },
      division: "Division",
      visualAidOptions: {
        blocks: "Blocks",
        animals: "Animals",
        shapes: "Shapes",
        numberLine: "Number Line"
      }
    },

    // Game Interaction
    game: {
      yourAnswer: "Your answer:",
      checkAnswer: "Check Answer",
      showHints: "Show Hints",
      hideHints: "Hide Hints",
      feedback: {
        correct: "Correct! Great job!",
        incorrect: "Not quite right. Try again!",
        harderNumbers: "You're doing great! Let's try some harder numbers!"
      }
    },

    // Statistics
    stats: {
      totalCorrect: "Total Correct:",
      totalAttempts: "Total Attempts:",
      accuracy: "Accuracy:",
      currentRank: "Current Rank:",
      timeSpent: "Time Spent:"
    },

    panels: {
      settings: 'Settings',
      stats: 'Stats',
      ranking: 'Ranking'
    },

    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginSuccess: 'Login successful!',
      registerSuccess: 'Registration successful!',
      logout: 'Logout',
      logoutSuccess: 'Logged out successfully!'
    }
  },
  'zh-TW': {
    // Header & Navigation
    title: "數學探險家",
    subtitle: "兒童數學學習遊戲",
    language: "語言",
    english: "英文",
    traditionalChinese: "繁體中文",
    simplifiedChinese: "簡體中文",

    // Game Settings
    gameSettings: {
      gameSelection: "遊戲選擇",
      title: "遊戲設定",
      difficultyMode: "難度模式",
      gameType: "遊戲類型",
      mathGame: "數學遊戲",
      englishGame: "英文遊戲",
      adaptiveMode: "自適應模式",
      adaptiveModeDesc: "根據表現自動調整難度",
      fixedDifficulty: "固定難度",
      ageLevels: {
        easy: "3-4歲",
        medium: "4-5歲",
        hard: "5-6歲"
      },
      questionsPerSession: "每節問題數",
      questionCounts: {
        ten: "10個問題",
        twenty: "20個問題",
        thirty: "30個問題"
      },

      gameSelect: "遊戲選擇",
      selection:{
        MathGame: "數學遊戲",
        EnglishGame: "英語遊戲",
      },

      gameMode: "遊戲模式",
      operations: {
        addition: "加法",
        subtraction: "減法",
        division: "除法"
      },
      visualAid: "視覺輔助",
      visualTypes: {
        blocks: "方塊",
        animals: "動物",
        shapes: "形狀",
        numberLine: "數線"
      },
      visualAidOptions: {
        blocks: "積木",
        animals: "動物",
        shapes: "形狀",
        numberLine: "數線"
      }
    },

    // Session Management
    session: {
      settings: "遊戲設定",
      gameModeLabel: "遊戲模式：",
      ageLevel: "年齡等級（難度）：",
      adaptiveModeLabel: "自適應（自動調整）",
      questionsLabel: "問題數：",
      perSession: "每節",
      visualAidLabel: "視覺輔助：",
      start: "開始遊戲",
      complete: "遊戲完成！",
      score: "你的分數：",
      timeTaken: "用時：",
      startNew: "開始新遊戲",
      end: "結束遊戲",
      restart: "重新開始",
      progress: "遊戲進度：",
      questions: "個問題",
      time: "時間：",
      currentLevel: "當前等級：",
      levels: {
        easy: "簡單",
        medium: "中等",
        hard: "困難"
      },
      division: "除法",
      visualAidOptions: {
        blocks: "積木",
        animals: "動物",
        shapes: "形狀",
        numberLine: "數線"
      }
    },

    // Game Interaction
    game: {
      yourAnswer: "你的答案：",
      checkAnswer: "檢查答案",
      showHints: "顯示提示",
      hideHints: "隱藏提示",
      feedback: {
        correct: "正確！做得好！",
        incorrect: "不太對，再試一次！",
        harderNumbers: "你做得很好！讓我們試試更難的數字！"
      }
    },

    // Statistics
    stats: {
      totalCorrect: "總正確數：",
      totalAttempts: "總嘗試數：",
      accuracy: "準確率：",
      currentRank: "當前排名：",
      timeSpent: "用時："
    },

    panels: {
      settings: '設定',
      stats: '統計',
      ranking: '排名'
    },

    auth: {
      login: '登入',
      register: '註冊',
      username: '使用者名稱',
      password: '密碼',
      confirmPassword: '確認密碼',
      loginSuccess: '登入成功！',
      registerSuccess: '註冊成功！',
      logout: '登出',
      logoutSuccess: '登出成功！'
    }
  },
  'zh-CN': {
    // Header & Navigation
    title: "数学探险家",
    subtitle: "儿童数学学习游戏",
    language: "语言",
    english: "英文",
    traditionalChinese: "繁体中文",
    simplifiedChinese: "简体中文",

    // Game Settings
    gameSettings: {
      gameSelection: "游戏选择",
      title: "游戏设置",
      difficultyMode: "难度模式",
      gameType: "游戏类型",
      mathGame: "数学游戏",
      englishGame: "英语游戏",
      adaptiveMode: "自适应模式",
      adaptiveModeDesc: "根据表现自动调整难度",
      fixedDifficulty: "固定难度",
      ageLevels: {
        easy: "3-4岁",
        medium: "4-5岁",
        hard: "5-6岁"
      },
      questionsPerSession: "每节问题数",
      questionCounts: {
        ten: "10个问题",
        twenty: "20个问题",
        thirty: "30个问题"
      },

      gameSelect: "游戏选择",
      selection:{
        MathGame: "数学游戏",
        EnglishGame: "数学游戏",
      },

      gameMode: "游戏模式",
      operations: {
        addition: "加法",
        subtraction: "减法",
        division: "除法"
      },
      visualAid: "视觉辅助",
      visualTypes: {
        blocks: "方块",
        animals: "动物",
        shapes: "形状",
        numberLine: "数线"
      },
      visualAidOptions: {
        blocks: "积木",
        animals: "动物",
        shapes: "形状",
        numberLine: "数线"
      }
    },

    // Session Management
    session: {
      settings: "游戏设置",
      gameModeLabel: "游戏模式：",
      ageLevel: "年龄等级（难度）：",
      adaptiveModeLabel: "自适应（自动调整）",
      questionsLabel: "问题数：",
      perSession: "每节",
      visualAidLabel: "视觉辅助：",
      start: "开始游戏",
      complete: "游戏完成！",
      score: "你的分数：",
      timeTaken: "用时：",
      startNew: "开始新游戏",
      end: "结束游戏",
      restart: "重新开始",
      progress: "游戏进度：",
      questions: "个问题",
      time: "时间：",
      currentLevel: "当前等级：",
      levels: {
        easy: "简单",
        medium: "中等",
        hard: "困难"
      },
      division: "除法",
      visualAidOptions: {
        blocks: "积木",
        animals: "动物",
        shapes: "形状",
        numberLine: "数线"
      }
    },

    // Game Interaction
    game: {
      yourAnswer: "你的答案：",
      checkAnswer: "检查答案",
      showHints: "显示提示",
      hideHints: "隐藏提示",
      feedback: {
        correct: "正确！做得好！",
        incorrect: "不太对，再试一次！",
        harderNumbers: "你做得很好！让我们试试更难的数字！"
      }
    },

    // Statistics
    stats: {
      totalCorrect: "总正确数：",
      totalAttempts: "总尝试数：",
      accuracy: "准确率：",
      currentRank: "当前排名：",
      timeSpent: "用时："
    },

    panels: {
      settings: '设置',
      stats: '统计',
      ranking: '排名'
    },

    auth: {
      login: '登录',
      register: '注册',
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      loginSuccess: '登录成功！',
      registerSuccess: '注册成功！',
      logout: '退出',
      logoutSuccess: '退出成功！'
    }
  }
}; 