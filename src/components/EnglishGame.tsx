"use client";

import { useState, useEffect, useCallback } from "react";
import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";

import { useLanguage } from "@/lib/i18n/LanguageContext";

import { AnswerOptions } from "./UI/AnswerOptions";


interface EnglishGameProps {
  initialDifficulty?: number;
  userId?: string;
  isAdmin?: boolean;
  currentGame: 'math' | 'english';
  switchGame: (game: 'math' | 'english') => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  tcHint: string;
}

interface UserStats {
  userId: string;
  Username: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  currentrank: number;
}




export function EnglishGame({ 
  initialDifficulty = 1, 
  userId = 'user123',
  isAdmin = false,
  currentGame,
  switchGame
}: EnglishGameProps) {
  const { t } = useLanguage();
  const [gameMode, setGameMode] = useState<"Multiple Choice" | "True/False Question" | "addition" | "subtraction">("Multiple Choice");
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);

  // Session related state
  const [questionsPerSession, setQuestionsPerSession] = useState(10);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [hasTriedThisQuestion, setHasTriedThisQuestion] = useState(false);

  // User statistics
  const [userStats, setUserStats] = useState<UserStats>({
    userId: userId,
    Username: 'Current User',
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    currentrank: 0
  });

  // Mock leaderboard data - in real app, this would come from a database
  const [allUsers] = useState<UserStats[]>([
    { userId: '1', Username: 'Alice', correctAnswers: 28, totalQuestions: 35, accuracy: 80, currentrank: 1 },
    { userId: '2', Username: 'Bob', correctAnswers: 25, totalQuestions: 30, accuracy: 83.3, currentrank: 2 },
    { userId: '3', Username: 'Charlie', correctAnswers: 22, totalQuestions: 28, accuracy: 78.6, currentrank: 3 },
    { userId: '4', Username: 'Daisy', correctAnswers: 20, totalQuestions: 25, accuracy: 80, currentrank: 4 },
    { userId: '5', Username: 'Eve', correctAnswers: 19, totalQuestions: 24, accuracy: 79.2, currentrank: 5 },
    { userId: '6', Username: 'Frank', correctAnswers: 18, totalQuestions: 23, accuracy: 78.3, currentrank: 6 },
    { userId: '7', Username: 'Grace', correctAnswers: 17, totalQuestions: 22, accuracy: 77.3, currentrank: 7 },
    { userId: '8', Username: 'Heidi', correctAnswers: 16, totalQuestions: 21, accuracy: 76.2, currentrank: 8 },
    { userId: '9', Username: 'Ivan', correctAnswers: 15, totalQuestions: 20, accuracy: 75, currentrank: 9 },
    { userId: '10', Username: 'Judy', correctAnswers: 14, totalQuestions: 19, accuracy: 73.7, currentrank: 10 },
  ]);

  // Mock questions database
  const questionsDatabase: Record<string, Record<number, Question[]>> = {
    "Multiple Choice": {
      1: [
        { question: "Which animal says 'moo'?", options: ["Cow", "Cat", "Dog", "Duck"], correctAnswer: "Cow", tcHint: "哪種動物會發出'哞'的聲音？選項：牛、貓、狗、鴨子" },
        { question: "What color is a banana?", options: ["Red", "Blue", "Yellow", "Green"], correctAnswer: "Yellow", tcHint: "香蕉是什麼顏色？選項：紅色、藍色、黃色、綠色" },
        { question: "How many eyes do you have?", options: ["One", "Two", "Three", "Four"], correctAnswer: "Two", tcHint: "你有幾隻眼睛？選項：一隻、兩隻、三隻、四隻" },
        { question: "Which shape has three sides?", options: ["Circle", "Square", "Triangle", "Rectangle"], correctAnswer: "Triangle", tcHint: "哪種形狀有三條邊？選項：圓形、正方形、三角形、長方形" },
        { question: "What do you wear on your feet?", options: ["Hat", "Gloves", "Socks", "Shirt"], correctAnswer: "Socks", tcHint: "你穿什麼在腳上？選項：帽子、手套、襪子、襯衫" },
        { question: "What is the opposite of 'big'?", options: ["small", "tall", "wide", "long"], correctAnswer: "small", tcHint: "'大'的相反是什麼？選項：小的、高的、寬的、長的" },
        { question: "Which fruit is red and round?", options: ["Banana", "Grape", "Apple", "Orange"], correctAnswer: "Apple", tcHint: "哪種水果是紅色又圓的？選項：香蕉、葡萄、蘋果、橘子" },
        { question: "How many fingers are on one hand?", options: ["Two", "Three", "Four", "Five"], correctAnswer: "Five", tcHint: "一隻手有幾根手指？選項：兩根、三根、四根、五根" },
        { question: "What sound does a dog make?", options: ["Meow", "Quack", "Woof", "Oink"], correctAnswer: "Woof", tcHint: "狗會發出什麼聲音？選項：喵、呱、汪、哼" },
        { question: "Which vehicle has wings?", options: ["Car", "Train", "Airplane", "Boat"], correctAnswer: "Airplane", tcHint: "哪種交通工具有翅膀？選項：汽車、火車、飛機、船" },
        { question: "What color is the sky on a sunny day?", options: ["Green", "Blue", "Red", "Yellow"], correctAnswer: "Blue", tcHint: "晴天時天空是什麼顏色？選項：綠色、藍色、紅色、黃色" },
        { question: "Which meal do you eat in the morning?", options: ["Dinner", "Lunch", "Breakfast", "Snack"], correctAnswer: "Breakfast", tcHint: "你早上吃哪一餐？選項：晚餐、午餐、早餐、點心" },
        { question: "What do bees make?", options: ["Milk", "Honey", "Bread", "Cheese"], correctAnswer: "Honey", tcHint: "蜜蜂做什麼？選項：牛奶、蜂蜜、麵包、起司" },
        { question: "Which of these is a vegetable?", options: ["Apple", "Carrot", "Banana", "Grape"], correctAnswer: "Carrot", tcHint: "這些哪一個是蔬菜？選項：蘋果、胡蘿蔔、香蕉、葡萄" },
        { question: "What do you use to write on paper?", options: ["Spoon", "Pen", "Fork", "Cup"], correctAnswer: "Pen", tcHint: "你用什麼在紙上寫字？選項：湯匙、筆、叉子、杯子" },
        { question: "Which animal lays eggs?", options: ["Cow", "Chicken", "Dog", "Cat"], correctAnswer: "Chicken", tcHint: "哪種動物會下蛋？選項：牛、雞、狗、貓" },
        { question: "How many wheels does a bicycle have?", options: ["One", "Two", "Three", "Four"], correctAnswer: "Two", tcHint: "自行車有幾個輪子？選項：一個、兩個、三個、四個" },
        { question: "What is a baby cat called?", options: ["Puppy", "Kitten", "Cub", "Chick"], correctAnswer: "Kitten", tcHint: "小貓叫什麼？選項：小狗、小貓、幼獸、小雞" },
        { question: "Which season is hot?", options: ["Winter", "Spring", "Summer", "Autumn"], correctAnswer: "Summer", tcHint: "哪個季節很熱？選項：冬天、春天、夏天、秋天" },
        { question: "What do you wear when it rains?", options: ["Sunglasses", "Scarf", "Raincoat", "Gloves"], correctAnswer: "Raincoat", tcHint: "下雨時你穿什麼？選項：太陽眼鏡、圍巾、雨衣、手套" },
        { question: "Which hand do you usually use for writing?", options: ["Left", "Right", "Both", "Neither"], correctAnswer: "Right", tcHint: "你通常用哪隻手寫字？選項：左手、右手、雙手、都不用" },
        { question: "What is the name of our planet?", options: ["Mars", "Venus", "Earth", "Jupiter"], correctAnswer: "Earth", tcHint: "我們的星球叫什麼名字？選項：火星、金星、地球、木星" },
        { question: "Which sense do you use to smell?", options: ["Taste", "Touch", "Sight", "Smell"], correctAnswer: "Smell", tcHint: "你用哪種感官來聞東西？選項：味覺、觸覺、視覺、嗅覺" },
        { question: "What is the sound a pig makes?", options: ["Moo", "Bark", "Oink", "Roar"], correctAnswer: "Oink", tcHint: "豬會發出什麼聲音？選項：哞、吠、哼、吼" },
        { question: "Which number comes after nine?", options: ["Seven", "Eight", "Ten", "Eleven"], correctAnswer: "Ten", tcHint: "九後面是哪個數字？選項：七、八、十、十一" },
        { question: "What color is a stop sign?", options: ["Green", "Blue", "Red", "Yellow"], correctAnswer: "Red", tcHint: "停車標誌是什麼顏色？選項：綠色、藍色、紅色、黃色" },
        { question: "What do you use to brush your teeth?", options: ["Comb", "Spoon", "Toothbrush", "Scissors"], correctAnswer: "Toothbrush", tcHint: "你用什麼刷牙？選項：梳子、湯匙、牙刷、剪刀" },
        { question: "Which part of a tree is underground?", options: ["Leaves", "Trunk", "Branches", "Roots"], correctAnswer: "Roots", tcHint: "樹的哪一部分在地下？選項：葉子、樹幹、樹枝、根" },
        { question: "What do birds have to fly?", options: ["Legs", "Fins", "Wings", "Antennas"], correctAnswer: "Wings", tcHint: "鳥有什麼可以飛？選項：腿、鰭、翅膀、觸角" },
        { question: "Which is a pet: lion, tiger, cat, bear?", options: ["Lion", "Tiger", "Cat", "Bear"], correctAnswer: "Cat", tcHint: "哪個是寵物：獅子、老虎、貓、熊？選項：獅子、老虎、貓、熊" },
      ],
      2: [
        { question: "What is the past tense of 'eat'?", options: ["eats", "ate", "eating", "eaten"], correctAnswer: "ate", tcHint: "'吃'的過去式是什麼？選項：eats、ate、eating、eaten" },
        { question: "Which word means the opposite of 'fast'?", options: ["quick", "slow", "rapid", "speedy"], correctAnswer: "slow", tcHint: "哪個詞的意思與'快'相反？選項：快的、慢的、快速的、迅速的" },
        { question: "What is the capital of France?", options: ["London", "Rome", "Berlin", "Paris"], correctAnswer: "Paris", tcHint: "法國的首都是哪裡？選項：倫敦、羅馬、柏林、巴黎" },
        { question: "Which month comes after July?", options: ["June", "August", "September", "October"], correctAnswer: "August", tcHint: "七月之後是哪個月份？選項：六月、八月、九月、十月" },
        { question: "How many legs does a spider have?", options: ["Four", "Six", "Eight", "Ten"], correctAnswer: "Eight", tcHint: "蜘蛛有幾條腿？選項：四條、六條、八條、十條" },
        { question: "What is a baby kangaroo called?", options: ["Calf", "Joey", "Cub", "Kitten"], correctAnswer: "Joey", tcHint: "小袋鼠叫什麼？選項：小牛、幼獸、幼崽、小貓" },
        { question: "Which of these is a liquid at room temperature?", options: ["Rock", "Wood", "Water", "Ice"], correctAnswer: "Water", tcHint: "這些哪一個在室溫下是液體？選項：石頭、木頭、水、冰" },
        { question: "What is the main ingredient in bread?", options: ["Sugar", "Flour", "Eggs", "Butter"], correctAnswer: "Flour", tcHint: "麵包的主要成分是什麼？選項：糖、麵粉、雞蛋、奶油" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "Mars", tcHint: "哪個行星被稱為紅色行星？選項：地球、火星、木星、金星" },
        { question: "What do you use to hear sounds?", options: ["Eyes", "Nose", "Ears", "Mouth"], correctAnswer: "Ears", tcHint: "你用什麼聽聲音？選項：眼睛、鼻子、耳朵、嘴巴" },
        { question: "Which bird is known for its long neck?", options: ["Sparrow", "Ostrich", "Eagle", "Penguin"], correctAnswer: "Ostrich", tcHint: "哪種鳥以長脖子聞名？選項：麻雀、鴕鳥、老鷹、企鵝" },
        { question: "What is the plural of 'mouse'?", options: ["mouses", "mice", "meese", "mousen"], correctAnswer: "mice", tcHint: "'mouse'的複數是什麼？選項：mouses、mice、meese、mousen" },
        { question: "Which ocean is the smallest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: "Arctic", tcHint: "哪個海洋最小？選項：大西洋、印度洋、北冰洋、太平洋" },
        { question: "What is a group of fish called?", options: ["Herd", "Flock", "School", "Pack"], correctAnswer: "School", tcHint: "一群魚叫什麼？選項：獸群、鳥群、魚群、狼群" },
        { question: "Which continent is home to the Amazon rainforest?", options: ["Africa", "Asia", "South America", "Europe"], correctAnswer: "South America", tcHint: "哪個洲是亞馬遜雨林的所在地？選項：非洲、亞洲、南美洲、歐洲" },
        { question: "What is the name of the biggest star in our solar system?", options: ["Moon", "Earth", "Sun", "Mars"], correctAnswer: "Sun", tcHint: "我們太陽系中最大的恆星叫什麼名字？選項：月亮、地球、太陽、火星" },
        { question: "Which instrument has black and white keys?", options: ["Guitar", "Drums", "Piano", "Flute"], correctAnswer: "Piano", tcHint: "哪種樂器有黑白鍵？選項：吉他、鼓、鋼琴、長笛" },
        { question: "What do caterpillars turn into?", options: ["Spiders", "Butterflies", "Bees", "Ants"], correctAnswer: "Butterflies", tcHint: "毛毛蟲會變成什麼？選項：蜘蛛、蝴蝶、蜜蜂、螞蟻" },
        { question: "Which country is famous for the Eiffel Tower?", options: ["Italy", "Germany", "France", "Spain"], correctAnswer: "France", tcHint: "哪個國家以艾菲爾鐵塔聞名？選項：義大利、德國、法國、西班牙" },
        { question: "What is the opposite of 'hot'?", options: ["warm", "cold", "boiling", "burning"], correctAnswer: "cold", tcHint: "'熱'的相反是什麼？選項：溫暖的、冷的、沸騰的、燃燒的" },
        { question: "Which animal is known for its black and white stripes?", options: ["Lion", "Elephant", "Zebra", "Giraffe"], correctAnswer: "Zebra", tcHint: "哪種動物以黑白條紋聞名？選項：獅子、大象、斑馬、長頸鹿" },
        { question: "What is the name of the toy bear that Winnie the Pooh loves?", options: ["Teddy", "Grizzly", "Panda", "Beary"], correctAnswer: "Teddy", tcHint: "小熊維尼喜歡的玩具熊叫什麼名字？選項：泰迪、灰熊、熊貓、熊熊" },
        { question: "Which body part helps you to run?", options: ["Arms", "Legs", "Head", "Hands"], correctAnswer: "Legs", tcHint: "哪個身體部位幫助你跑步？選項：手臂、腿、頭、手" },
        { question: "What kind of animal is a dolphin?", options: ["Fish", "Bird", "Reptile", "Mammal"], correctAnswer: "Mammal", tcHint: "海豚是什麼動物？選項：魚、鳥、爬行動物、哺乳動物" },
        { question: "Which of these is a primary color?", options: ["Green", "Orange", "Purple", "Blue"], correctAnswer: "Blue", tcHint: "這些哪一個是原色？選項：綠色、橘色、紫色、藍色" },
        { question: "What do you call a baby dog?", options: ["Kitten", "Calf", "Puppy", "Chick"], correctAnswer: "Puppy", tcHint: "小狗叫什麼？選項：小貓、小牛、小狗、小雞" },
        { question: "Which planet is closest to the Sun?", options: ["Earth", "Mars", "Venus", "Mercury"], correctAnswer: "Mercury", tcHint: "哪個行星離太陽最近？選項：地球、火星、金星、水星" },
        { question: "What is the name of the biggest land animal?", options: ["Giraffe", "Elephant", "Rhinoceros", "Hippopotamus"], correctAnswer: "Elephant", tcHint: "最大的陸地動物叫什麼名字？選項：長頸鹿、大象、犀牛、河馬" },
        { question: "Which sport uses a racket and a shuttlecock?", options: ["Tennis", "Basketball", "Badminton", "Soccer"], correctAnswer: "Badminton", tcHint: "哪種運動使用球拍和羽毛球？選項：網球、籃球、羽毛球、足球" },
        { question: "What is the soft covering on a bird's body called?", options: ["Fur", "Scales", "Feathers", "Skin"], correctAnswer: "Feathers", tcHint: "鳥身上柔軟的覆蓋物叫什麼？選項：毛皮、鱗片、羽毛、皮膚" },
      ],
      3: [
        { question: "What is the superlative form of 'good'?", options: ["gooder", "more good", "best", "most good"], correctAnswer: "best", tcHint: "'好'的最高級形式是什麼？選項：gooder、more good、best、most good" },
        { question: "Which of these is a prime number: 4, 7, 9, 10?", options: ["4", "7", "9", "10"], correctAnswer: "7", tcHint: "這些哪一個是質數：4、7、9、10？選項：4、7、9、10" },
        { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correctAnswer: "William Shakespeare", tcHint: "誰寫了《羅密歐與茱麗葉》？選項：查爾斯·狄更斯、威廉·莎士比亞、珍·奧斯汀、馬克·吐溫" },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: "Pacific", tcHint: "地球上最大的海洋是什麼？選項：大西洋、印度洋、北冰洋、太平洋" },
        { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide", tcHint: "植物從大氣中吸收哪種氣體？選項：氧氣、氮氣、二氧化碳、氫氣" },
        { question: "What is the chemical symbol for water?", options: ["O2", "CO2", "H2O", "NaCl"], correctAnswer: "H2O", tcHint: "水的化學符號是什麼？選項：O2、CO2、H2O、NaCl" },
        { question: "Which instrument is used to measure temperature?", options: ["Ruler", "Scale", "Thermometer", "Clock"], correctAnswer: "Thermometer", tcHint: "哪種儀器用於測量溫度？選項：尺、秤、溫度計、時鐘" },
        { question: "What is the process called when liquid turns into gas?", options: ["Melting", "Freezing", "Condensation", "Evaporation"], correctAnswer: "Evaporation", tcHint: "液體變成氣體的過程叫什麼？選項：融化、凝固、凝結、蒸發" },
        { question: "Which planet is known for its prominent rings?", options: ["Mars", "Jupiter", "Saturn", "Uranus"], correctAnswer: "Saturn", tcHint: "哪個行星以其突出的光環聞名？選項：火星、木星、土星、天王星" },
        { question: "Who invented the light bulb?", options: ["Isaac Newton", "Albert Einstein", "Thomas Edison", "Nikola Tesla"], correctAnswer: "Thomas Edison", tcHint: "誰發明了燈泡？選項：艾薩克·牛頓、阿爾伯特·愛因斯坦、托馬斯·愛迪生、尼古拉·特斯拉" },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Quartz"], correctAnswer: "Diamond", tcHint: "地球上最堅硬的天然物質是什麼？選項：黃金、鐵、鑽石、石英" },
        { question: "Which of these is a carnivorous plant?", options: ["Sunflower", "Rose", "Venus Flytrap", "Daisy"], correctAnswer: "Venus Flytrap", tcHint: "這些哪一個是食肉植物？選項：向日葵、玫瑰、捕蠅草、雛菊" },
        { question: "What is the longest river in the world?", options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"], correctAnswer: "Nile River", tcHint: "世界上最長的河流是什麼？選項：亞馬遜河、尼羅河、密西西比河、長江" },
        { question: "Which animal is a marsupial and native to Australia?", options: ["Lion", "Kangaroo", "Elephant", "Bear"], correctAnswer: "Kangaroo", tcHint: "哪種動物是有袋動物，原產於澳洲？選項：獅子、袋鼠、大象、熊" },
        { question: "What is the unit of electric current?", options: ["Volt", "Ohm", "Watt", "Ampere"], correctAnswer: "Ampere", tcHint: "電流的單位是什麼？選項：伏特、歐姆、瓦特、安培" },
        { question: "Which famous scientist developed the theory of relativity?", options: ["Isaac Newton", "Marie Curie", "Stephen Hawking", "Albert Einstein"], correctAnswer: "Albert Einstein", tcHint: "哪位著名科學家提出了相對論？選項：艾薩克·牛頓、瑪麗·居禮、史蒂芬·霍金、阿爾伯特·愛因斯坦" },
        { question: "What is the name of the galaxy our solar system is in?", options: ["Andromeda", "Triangulum", "Whirlpool", "Milky Way"], correctAnswer: "Milky Way", tcHint: "我們的太陽系在哪個星系中？選項：仙女座、三角座、旋渦星系、銀河系" },
        { question: "Which element has the atomic number 1?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correctAnswer: "Hydrogen", tcHint: "原子序數為1的元素是什麼？選項：氦、氧、氫、碳" },
        { question: "What is the process by which a plant grows from a seed?", options: ["Pollination", "Germination", "Fertilization", "Transpiration"], correctAnswer: "Germination", tcHint: "植物從種子生長的過程叫什麼？選項：授粉、發芽、受精、蒸騰" },
        { question: "Which is the largest organ in the human body?", options: ["Heart", "Brain", "Skin", "Liver"], correctAnswer: "Skin", tcHint: "人體最大的器官是什麼？選項：心臟、大腦、皮膚、肝臟" },
        { question: "What is the study of ancient societies through their material remains?", options: ["Sociology", "Anthropology", "Archaeology", "Paleontology"], correctAnswer: "Archaeology", tcHint: "透過物質遺骸研究古代社會的學科叫什麼？選項：社會學、人類學、考古學、古生物學" },
        { question: "Which form of energy is stored in a battery?", options: ["Kinetic", "Potential", "Thermal", "Chemical"], correctAnswer: "Chemical", tcHint: "電池中儲存的是哪種形式的能量？選項：動能、勢能、熱能、化學能" },
        { question: "What is the capital city of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correctAnswer: "Ottawa", tcHint: "加拿大的首都是哪裡？選項：多倫多、溫哥華、蒙特婁、渥太華" },
        { question: "Which of these is a coniferous tree?", options: ["Oak", "Maple", "Pine", "Willow"], correctAnswer: "Pine", tcHint: "這些哪一種是針葉樹？選項：橡樹、楓樹、松樹、柳樹" },
        { question: "What is the outermost layer of the Earth called?", options: ["Mantle", "Core", "Crust", "Atmosphere"], correctAnswer: "Crust", tcHint: "地球最外層叫什麼？選項：地幔、地核、地殼、大氣層" },
        { question: "Which animal is known for its ability to change color?", options: ["Lion", "Elephant", "Chameleon", "Tiger"], correctAnswer: "Chameleon", tcHint: "哪種動物以變色能力聞名？選項：獅子、大象、變色龍、老虎" },
        { question: "What is the main function of red blood cells?", options: ["Fighting infections", "Clotting blood", "Carrying oxygen", "Producing antibodies"], correctAnswer: "Carrying oxygen", tcHint: "紅血球的主要功能是什麼？選項：抵抗感染、凝血、攜帶氧氣、產生抗體" },
        { question: "Which continent is the largest by land area?", options: ["Africa", "Europe", "Asia", "North America"], correctAnswer: "Asia", tcHint: "哪個洲是陸地面積最大的？選項：非洲、歐洲、亞洲、北美洲" },
        { question: "What is the chemical symbol for gold?", options: ["Ag", "Fe", "Au", "Cu"], correctAnswer: "Au", tcHint: "黃金的化學符號是什麼？選項：Ag、Fe、Au、Cu" },
        { question: "Which famous painting features the Mona Lisa?", options: ["The Last Supper", "Starry Night", "Girl with a Pearl Earring", "Mona Lisa"], correctAnswer: "Mona Lisa", tcHint: "哪幅著名畫作以蒙娜麗莎為特色？選項：最後的晚餐、星夜、戴珍珠耳環的少女、蒙娜麗莎" },
      ],
    },
    "True/False Question": {
      1: [
        { question: "A dog can fly.", options: ["True", "False"], correctAnswer: "False", tcHint: "狗會飛。" },
        { question: "The sun is cold.", options: ["True", "False"], correctAnswer: "False", tcHint: "太陽是冷的。" },
        { question: "You use your ears to see.", options: ["True", "False"], correctAnswer: "False", tcHint: "你用耳朵看東西。" },
        { question: "A cat is a bird.", options: ["True", "False"], correctAnswer: "False", tcHint: "貓是鳥。" },
        { question: "Grass is green.", options: ["True", "False"], correctAnswer: "True", tcHint: "草是綠色的。" },
        { question: "Birds live in the water.", options: ["True", "False"], correctAnswer: "False", tcHint: "鳥類生活在水中。" },
        { question: "A car has two wheels.", options: ["True", "False"], correctAnswer: "False", tcHint: "汽車有兩個輪子。" },
        { question: "Ice cream is hot.", options: ["True", "False"], correctAnswer: "False", tcHint: "冰淇淋是熱的。" },
        { question: "You wear a hat on your feet.", options: ["True", "False"], correctAnswer: "False", tcHint: "你把帽子戴在腳上。" },
        { question: "Fish can walk on land.", options: ["True", "False"], correctAnswer: "False", tcHint: "魚可以在陸地上行走。" },
        { question: "The sky is purple.", options: ["True", "False"], correctAnswer: "False", tcHint: "天空是紫色的。" },
        { question: "Trees have leaves.", options: ["True", "False"], correctAnswer: "True", tcHint: "樹有葉子。" },
        { question: "A square has four equal sides.", options: ["True", "False"], correctAnswer: "True", tcHint: "正方形有四條等邊。" },
        { question: "Milk comes from chickens.", options: ["True", "False"], correctAnswer: "False", tcHint: "牛奶來自雞。" },
        { question: "You can eat a chair.", options: ["True", "False"], correctAnswer: "False", tcHint: "你可以吃椅子。" },
        { question: "A lion is a small animal.", options: ["True", "False"], correctAnswer: "False", tcHint: "獅子是一種小動物。" },
        { question: "Butterflies can fly.", options: ["True", "False"], correctAnswer: "True", tcHint: "蝴蝶會飛。" },
        { question: "The moon is a star.", options: ["True", "False"], correctAnswer: "False", tcHint: "月亮是一顆星星。" },
        { question: "You use your nose to smell.", options: ["True", "False"], correctAnswer: "True", tcHint: "你用鼻子聞東西。" },
        { question: "Elephants are very small.", options: ["True", "False"], correctAnswer: "False", tcHint: "大象很小。" },
        { question: "Water is wet.", options: ["True", "False"], correctAnswer: "True", tcHint: "水是濕的。" },
        { question: "Spiders have eight legs.", options: ["True", "False"], correctAnswer: "True", tcHint: "蜘蛛有八條腿。" },
        { question: "Pigs can fly.", options: ["True", "False"], correctAnswer: "False", tcHint: "豬會飛。" },
        { question: "A circle has no corners.", options: ["True", "False"], correctAnswer: "True", tcHint: "圓形沒有角。" },
        { question: "A book is for reading.", options: ["True", "False"], correctAnswer: "True", tcHint: "書是用來讀的。" },
        { question: "Rain falls from the sky.", options: ["True", "False"], correctAnswer: "True", tcHint: "雨從天而降。" },
        { question: "A mouse is bigger than an elephant.", options: ["True", "False"], correctAnswer: "False", tcHint: "老鼠比大象大。" },
        { question: "You sleep at night.", options: ["True", "False"], correctAnswer: "True", tcHint: "你晚上睡覺。" },
        { question: "Birds have teeth.", options: ["True", "False"], correctAnswer: "False", tcHint: "鳥有牙齒。" },
        { question: "Chocolate is healthy food.", options: ["True", "False"], correctAnswer: "False", tcHint: "巧克力是健康食品。" },
      ],
      2: [
        { question: "The Earth revolves around the sun.", options: ["True", "False"], correctAnswer: "True", tcHint: "地球繞著太陽轉。" },
        { question: "Water boils at 0 degrees Celsius.", options: ["True", "False"], correctAnswer: "False", tcHint: "水在0攝氏度沸騰。" },
        { question: "Sharks are mammals.", options: ["True", "False"], correctAnswer: "False", tcHint: "鯊魚是哺乳動物。" },
        { question: "A hexagon has six sides.", options: ["True", "False"], correctAnswer: "True", tcHint: "六邊形有六條邊。" },
        { question: "The human body has 206 bones.", options: ["True", "False"], correctAnswer: "True", tcHint: "人體有206塊骨頭。" },
        { question: "Butterflies start their lives as caterpillars.", options: ["True", "False"], correctAnswer: "True", tcHint: "蝴蝶生命始於毛毛蟲。" },
        { question: "Mount Everest is the tallest mountain in Africa.", options: ["True", "False"], correctAnswer: "False", tcHint: "珠穆朗瑪峰是非洲最高的山。" },
        { question: "Sound travels faster than light.", options: ["True", "False"], correctAnswer: "False", tcHint: "聲音比光速快。" },
        { question: "Fish breathe with lungs.", options: ["True", "False"], correctAnswer: "False", tcHint: "魚用肺呼吸。" },
        { question: "A decade is a period of 10 years.", options: ["True", "False"], correctAnswer: "True", tcHint: "十年是10年的期間。" },
        { question: "The capital of Japan is Beijing.", options: ["True", "False"], correctAnswer: "False", tcHint: "日本的首都是北京。" },
        { question: "Pandas primarily eat bamboo.", options: ["True", "False"], correctAnswer: "True", tcHint: "熊貓主要吃竹子。" },
        { question: "The human brain stops growing by the age of 5.", options: ["True", "False"], correctAnswer: "False", tcHint: "人類大腦在5歲時停止生長。" },
        { question: "Oxygen is the most abundant gas in Earth's atmosphere.", options: ["True", "False"], correctAnswer: "False", tcHint: "氧氣是地球大氣中最豐富的氣體。" },
        { question: "The Great Wall of China can be seen from space.", options: ["True", "False"], correctAnswer: "False", tcHint: "從太空可以看到中國長城。" },
        { question: "Lightning is hotter than the surface of the sun.", options: ["True", "False"], correctAnswer: "True", tcHint: "閃電比太陽表面還熱。" },
        { question: "Penguins can fly.", options: ["True", "False"], correctAnswer: "False", tcHint: "企鵝會飛。" },
        { question: "A prism splits white light into different colors.", options: ["True", "False"], correctAnswer: "True", tcHint: "棱鏡將白光分解成不同顏色。" },
        { question: "All plants produce flowers.", options: ["True", "False"], correctAnswer: "False", tcHint: "所有植物都開花。" },
        { question: "The Sahara Desert is the largest desert in the world.", options: ["True", "False"], correctAnswer: "True", tcHint: "撒哈拉沙漠是世界上最大的沙漠。" },
        { question: "Humans are mammals.", options: ["True", "False"], correctAnswer: "True", tcHint: "人類是哺乳動物。" },
        { question: "The moon generates its own light.", options: ["True", "False"], correctAnswer: "False", tcHint: "月亮自己發光。" },
        { question: "Spiders are insects.", options: ["True", "False"], correctAnswer: "False", tcHint: "蜘蛛是昆蟲。" },
        { question: "A compass always points North.", options: ["True", "False"], correctAnswer: "True", tcHint: "指南針總是指向北方。" },
        { question: "The process of photosynthesis occurs in animal cells.", options: ["True", "False"], correctAnswer: "False", tcHint: "光合作用發生在動物細胞中。" },
        { question: "Hawaii is a state in the United States.", options: ["True", "False"], correctAnswer: "True", tcHint: "夏威夷是美國的一個州。" },
        { question: "Mars is larger than Earth.", options: ["True", "False"], correctAnswer: "False", tcHint: "火星比地球大。" },
        { question: "The human heart has four chambers.", options: ["True", "False"], correctAnswer: "True", tcHint: "人心臟有四個腔室。" },
        { question: "The capital of Australia is Sydney.", options: ["True", "False"], correctAnswer: "False", tcHint: "澳洲首都是雪梨。" },
        { question: "A square has four equal sides.", options: ["True", "False"], correctAnswer: "True", tcHint: "正方形有四條等邊。" },
      ],
      3: [
        { question: "Mount Everest is the tallest mountain in the world.", options: ["True", "False"], correctAnswer: "True", tcHint: "珠穆朗瑪峰是世界上最高的山。" },
        { question: "The currency of Japan is the Yuan.", options: ["True", "False"], correctAnswer: "False", tcHint: "日本的貨幣是人民幣。" },
        { question: "Photosynthesis is the process by which plants make their own food.", options: ["True", "False"], correctAnswer: "True", tcHint: "光合作用是植物製造食物的過程。" },
        { question: "The speed of light is slower than the speed of sound.", options: ["True", "False"], correctAnswer: "False", tcHint: "光速比音速慢。" },
        { question: "All insects have six legs.", options: ["True", "False"], correctAnswer: "True", tcHint: "所有昆蟲都有六條腿。" },
        { question: "The chemical symbol for carbon dioxide is CO2.", options: ["True", "False"], correctAnswer: "True", tcHint: "二氧化碳的化學符號是CO2。" },
        { question: "Volcanoes erupt only under water.", options: ["True", "False"], correctAnswer: "False", tcHint: "火山只在水下噴發。" },
        { question: "The human skeleton is made up of over 300 bones at birth.", options: ["True", "False"], correctAnswer: "True", tcHint: "人體骨骼在出生時由300多塊骨頭組成。" },
        { question: "A mirage is a real body of water in the desert.", options: ["True", "False"], correctAnswer: "False", tcHint: "海市蜃樓是沙漠中真實的水體。" },
        { question: "The Pacific Ocean is the largest ocean on Earth.", options: ["True", "False"], correctAnswer: "True", tcHint: "太平洋是地球上最大的海洋。" },
        { question: "Antibiotics are effective against viruses.", options: ["True", "False"], correctAnswer: "False", tcHint: "抗生素對病毒有效。" },
        { question: "The Earth's atmosphere is composed primarily of oxygen.", options: ["True", "False"], correctAnswer: "False", tcHint: "地球大氣層主要由氧氣組成。" },
        { question: "Sound cannot travel in a vacuum.", options: ["True", "False"], correctAnswer: "True", tcHint: "聲音不能在真空中傳播。" },
        { question: "The capital of Brazil is Rio de Janeiro.", options: ["True", "False"], correctAnswer: "False", tcHint: "巴西的首都是里約熱內盧。" },
        { question: "Diamonds are formed from coal.", options: ["True", "False"], correctAnswer: "False", tcHint: "鑽石是由煤形成的。" },
        { question: "The human eye can distinguish more shades of green than any other color.", options: ["True", "False"], correctAnswer: "True", tcHint: "人眼能區分比其他顏色更多的綠色陰影。" },
        { question: "Marie Curie won Nobel Prizes in two different scientific fields.", options: ["True", "False"], correctAnswer: "True", tcHint: "瑪麗·居禮在兩個不同的科學領域獲得諾貝爾獎。" },
        { question: "The phenomenon of 'global warming' refers to the cooling of the Earth.", options: ["True", "False"], correctAnswer: "False", tcHint: "'全球暖化'現象是指地球變冷。" },
        { question: "Bats are blind.", options: ["True", "False"], correctAnswer: "False", tcHint: "蝙蝠是盲的。" },
        { question: "The currency of the United Kingdom is the Euro.", options: ["True", "False"], correctAnswer: "False", tcHint: "英國的貨幣是歐元。" },
        { question: "A byte is made up of 8 bits.", options: ["True", "False"], correctAnswer: "True", tcHint: "一個字節由8位組成。" },
        { question: "The process of erosion involves the creation of new landforms.", options: ["True", "False"], correctAnswer: "False", tcHint: "侵蝕過程涉及新地貌的形成。" },
        { question: "The highest waterfall in the world is Niagara Falls.", options: ["True", "False"], correctAnswer: "False", tcHint: "世界上最高的瀑布是尼加拉瀑布。" },
        { question: "An amphibian can live both on land and in water.", options: ["True", "False"], correctAnswer: "True", tcHint: "兩棲動物可以生活在陸地和水中。" },
        { question: "The Great Barrier Reef is located off the coast of Brazil.", options: ["True", "False"], correctAnswer: "False", tcHint: "大堡礁位於巴西海岸。" },
        { question: "Humans have five senses.", options: ["True", "False"], correctAnswer: "True", tcHint: "人類有五種感官。" },
        { question: "The study of fungi is called zoology.", options: ["True", "False"], correctAnswer: "False", tcHint: "真菌學是動物學。" },
        { question: "The Earth is the third planet from the Sun.", options: ["True", "False"], correctAnswer: "True", tcHint: "地球是距離太陽第三顆行星。" },
        { question: "All reptiles are cold-blooded.", options: ["True", "False"], correctAnswer: "True", tcHint: "所有爬行動物都是冷血動物。" },
        { question: "The capital of Egypt is Cairo.", options: ["True", "False"], correctAnswer: "True", tcHint: "埃及的首都是開羅。" },
      ],
    },
  };

  const generateQuestion = useCallback(() => {
    if (gameMode === "Multiple Choice" || gameMode === "True/False Question") {
      const questionsForModeAndDifficulty = questionsDatabase[gameMode][difficulty];
      if (questionsForModeAndDifficulty && questionsForModeAndDifficulty.length > 0) {
        const randomIndex = Math.floor(Math.random() * questionsForModeAndDifficulty.length);
        setCurrentQuestion(questionsForModeAndDifficulty[randomIndex]);
        setHasTriedThisQuestion(false);
        setFeedback("");
      } else {
        setCurrentQuestion(null);
        setFeedback("No questions available for this mode and difficulty.");
      }
    }
  }, [gameMode, difficulty]);

  const startNewSession = () => {
    setQuestionsAnswered(0);
    setSessionScore(0);
    setIsSessionComplete(false);
    setUserAnswer("");
    setFeedback("");
    setConsecutiveCorrect(0);
    setIsSessionStarted(true);
    setSessionStartTime(Date.now());
    generateQuestion();
  };

  // Initialize the game
  useEffect(() => {
    if (!isInitialized) {
      generateQuestion();
      setIsInitialized(true);
    }
  }, [isInitialized, generateQuestion]);

  // Generate new question when game mode or difficulty changes
  useEffect(() => {
    if (isInitialized && !isSessionComplete) {
      generateQuestion();
    }
  }, [gameMode, difficulty, generateQuestion, isInitialized, isSessionComplete]);

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isSessionStarted && !isSessionComplete && sessionStartTime) {
      timerInterval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isSessionStarted, isSessionComplete, sessionStartTime]);

  // Update user stats
  const updateUserStats = (isCorrect: boolean, isFirstTry: boolean) => {
    setUserStats(prev => {
      const newtotalQuestions = prev.totalQuestions + 1;
      const newcorrectAnswers = isCorrect && isFirstTry ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newAccuracy = (newcorrectAnswers / newtotalQuestions) * 100;
      
      return {
        ...prev,
        correctAnswers: newcorrectAnswers,
        totalQuestions: newtotalQuestions,
        accuracy: Math.round(newAccuracy * 10) / 10
      };
    });
  };

  // Calculate current user currentrank
  const getCurrentUserRank = () => {
    const sortedUsers = [...allUsers, userStats].sort((a, b) => b.correctAnswers - a.correctAnswers);
    const userIndex = sortedUsers.findIndex(user => user.userId === userId);
    return userIndex + 1;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const isFirstTry = !hasTriedThisQuestion;
    
    updateUserStats(isCorrect, isFirstTry);
    
    if (isCorrect) {
      setFeedback("Correct! Great job!");
      if (isFirstTry) {
        setScore(prev => prev + 1);
        setSessionScore(prev => prev + 1);
      }
      setConsecutiveCorrect(prev => prev + 1);

      // Adaptive mode logic
      if (isAdaptiveMode && consecutiveCorrect === 4 && difficulty < 3) {
        setTimeout(() => {
          setDifficulty(difficulty + 1);
          setConsecutiveCorrect(0);
          setFeedback(t('harderQuestions'));
        }, 1500);
      } else {
        setTimeout(() => {
          setQuestionsAnswered(prev => {
            const newCount = prev + 1;
            if (newCount >= questionsPerSession) {
              setIsSessionComplete(true);
            } else {
              generateQuestion();
            }
            return newCount;
          });
        }, 1500);
      }
    } else {
      setFeedback("Not quite right. Try again!");
      setHasTriedThisQuestion(true);
      setConsecutiveCorrect(0);
    }
  };

  const switchGameMode = (mode: "Multiple Choice" | "True/False Question" | "addition" | "subtraction") => {
    if (mode === "Multiple Choice" || mode === "True/False Question") {
      setGameMode(mode);
      setDifficulty(1);
      setScore(0);
      generateQuestion();
    }
  };

  const setDifficultyLevel = (level: number) => {
    setDifficulty(level);
    setIsAdaptiveMode(false);
    setConsecutiveCorrect(0);
    generateQuestion();
  };

  const enableAdaptiveMode = () => {
    setDifficulty(1);
    setIsAdaptiveMode(true);
    setConsecutiveCorrect(0);
    generateQuestion();
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        difficulty={difficulty}
        setDifficulty={setDifficultyLevel}
        gameMode={gameMode}
        switchGameMode={switchGameMode}
        visualStyle="blocks"
        setVisualStyle={() => {}}
        questionsPerSession={questionsPerSession}
        setQuestionsPerSession={setQuestionsPerSession}
        isSessionActive={isSessionStarted && !isSessionComplete}
        isAdaptiveMode={isAdaptiveMode}
        enableAdaptiveMode={enableAdaptiveMode}
        userStats={userStats}
        currentRank={getCurrentUserRank()}
        isAdmin={isAdmin}
        allUsers={allUsers}
        currentGame={currentGame}
        switchGame={switchGame}
      />

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-0"}`}>
        <div className="max-w-3xl mx-auto">
          {!isSessionStarted ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">
                {t('Etitle')}
              </h1>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('session.settings')}</h2>
                <div className="grid grid-cols-2 gap-4 text-left mb-6">
                  <div>
                    <p className="text-gray-600">{t('session.gameModeLabel')}</p>
                    <p className="font-semibold">
                      {gameMode === "Multiple Choice" ? t('gameSettings.operations.mcQuestion') : t('gameSettings.operations.tfQuestion')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('session.ageLevel')}</p>
                    <p className="font-semibold">
                      {isAdaptiveMode
                        ? t('session.adaptiveModeLabel')
                        : difficulty === 1
                        ? t('gameSettings.ageLevels.easy')
                        : difficulty === 2
                        ? t('gameSettings.ageLevels.medium')
                        : t('gameSettings.ageLevels.hard')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('session.questionsLabel')}</p>
                    <p className="font-semibold">
                      {questionsPerSession} {t('session.perSession')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={startNewSession}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
              >
                {t('session.start')}
              </button>
            </div>
          ) : isSessionComplete ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('session.complete')}</h2>
              <p className="text-xl mb-2">{t('session.score')} {sessionScore}/{questionsPerSession}</p>
              <p className="text-lg mb-4">{t('session.timeTaken')} {formatTime(sessionDuration)}</p>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold">{t('stats.totalCorrect')} {userStats.correctAnswers}</p>
                <p>{t('stats.totalAttempts')} {userStats.totalQuestions}</p>
                <p>{t('stats.accuracy')} {userStats.accuracy}%</p>
                <p>{t('stats.currentRank')} #{getCurrentUserRank()}</p>
              </div>

              <button
                onClick={() => {
                  setIsSessionStarted(false);
                  setSessionDuration(0);
                  startNewSession();
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                {t('session.startNew')}
              </button>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-end mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsSessionComplete(true);
                      setIsSessionStarted(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    {t('session.end')}
                  </button>
                  <button
                    onClick={() => {
                      setQuestionsAnswered(0);
                      setSessionScore(0);
                      setUserAnswer("");
                      setFeedback("");
                      setConsecutiveCorrect(0);
                      generateQuestion();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                  >
                    {t('session.restart')}
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <Score
                  score={score}
                  showAnimation={feedback.includes("Correct")}
                />

                <div className="text-lg text-gray-600 mt-2">
                  {t('session.progress')} {questionsAnswered}/{questionsPerSession} {t('session.questions')}
                </div>
                <div className="w-full max-w-md mx-auto mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(questionsAnswered / questionsPerSession) * 100}%` }}
                  />
                </div>
                <div className="text-lg text-gray-600 mt-1">
                  {t('session.time')} {formatTime(sessionDuration)}
                </div>
                {isAdaptiveMode && (
                  <div className="text-sm text-purple-600 mt-1">
                    {t('session.currentLevel')} {difficulty === 1 ? t('session.levels.easy') : difficulty === 2 ? t('session.levels.medium') : t('session.levels.hard')}
                  </div>
                )}
              </div>

              {currentQuestion && (
                <>
                  <div className="text-2xl font-bold text-center mb-8 text-black">
                    {currentQuestion.question}
                  </div>

                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={!!feedback && feedback.includes("Correct")}
                          className={`p-4 rounded-lg text-lg font-medium transition-colors ${
                            feedback && option === currentQuestion.correctAnswer
                              ? 'bg-green-500 text-white'
                              : feedback && option === userAnswer && option !== currentQuestion.correctAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-white hover:bg-purple-100 text-gray-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {showExplanation ? t('game.hideHints') : t('game.showHints')}
                    </button>
                  </div>

                  {showExplanation && currentQuestion && (
                    <div className="mt-4 p-3 rounded-lg text-center bg-blue-100 text-blue-700 font-medium">
                      {currentQuestion.tcHint}
                    </div>
                  )}

                  {feedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-center font-bold ${
                        feedback.includes("Correct")
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {feedback}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}