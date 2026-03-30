const tg = window.Telegram.WebApp;
tg.expand();

// БАЗА ЗНАНИЙ
const DATABASE = {
    law: [
        { q: "Основной закон Республики Узбекистан?", a: ["Уголовный кодекс", "Конституция", "Гражданский кодекс"], c: 1 },
        { q: "Срок полномочий Президента РУз?", a: ["5 лет", "7 лет", "10 лет"], c: 1 }
    ],
    history: [
        { q: "В каком году Самарканд стал столицей империи Тимура?", a: ["1370", "1405", "1336"], c: 0 }
    ]
};

let userPoints = parseInt(localStorage.getItem('points')) || 0;
let currentCat = '';
let currentQ = 0;
let timer;

// ИНИЦИАЛИЗАЦИЯ UI
function init() {
    const user = tg.initDataUnsafe.user || { first_name: "Artur" };
    document.getElementById('user_name').innerText = user.first_name;
    updateProgress();
}

function updateProgress() {
    document.getElementById('user_points').innerText = userPoints.toLocaleString();
    
    let progress = Math.min((userPoints / 5000) * 100, 100);
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-percent').innerText = Math.round(progress) + '%';
    
    let rank = "НОВИЧОК";
    if (userPoints > 1000) rank = "УЧЕНИК";
    if (userPoints > 3000) rank = "МАГИСТР";
    if (userPoints > 5000) rank = "ПРОФЕССОР";
    document.getElementById('rank-title').innerText = rank;
}

// ЛОГИКА ТЕСТА
function openQuiz(cat) {
    currentCat = cat;
    currentQ = 0;
    document.getElementById('quiz-modal').style.display = 'flex';
    loadQuestion();
}

function loadQuestion() {
    const questions = DATABASE[currentCat] || DATABASE['law'];
    if (currentQ >= questions.length) {
        finishQuiz();
        return;
    }
    
    const qData = questions[currentQ];
    document.getElementById('question-text').innerText = qData.q;
    const btnContainer = document.getElementById('answer-options');
    btnContainer.innerHTML = '';
    
    qData.a.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.innerText = opt;
        b.onclick = () => { currentQ++; loadQuestion(); };
        btnContainer.appendChild(b);
    });
    
    startTimer();
}

function startTimer() {
    let left = 10;
    document.getElementById('quiz-timer').innerText = left;
    clearInterval(timer);
    timer = setInterval(() => {
        left--;
        document.getElementById('quiz-timer').innerText = left;
        if (left <= 0) {
            clearInterval(timer);
            currentQ++;
            loadQuestion();
        }
    }, 1000);
}

function finishQuiz() {
    clearInterval(timer);
    userPoints += 250; // Начисляем за прохождение
    localStorage.setItem('points', userPoints);
    document.getElementById('quiz-modal').style.display = 'none';
    updateProgress();
}

init();
