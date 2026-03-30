const tg = window.Telegram.WebApp;
tg.expand();

// Звуки
const sndCorrect = new Audio('https://www.soundjay.com/buttons/sounds/button-37.mp3');
const sndWrong = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');

let points = parseInt(localStorage.getItem('userPoints')) || 0;
let currentQ = 0;
let score = 0;
let timer;

const questions = {
    law: [
        { q: "С какого возраста наступает полная дееспособность в РУз?", a: ["16 лет", "18 лет", "21 год"], c: 1 },
        { q: "Срок регистрации брака в РУз по закону?", a: ["15 дней", "1 месяц", "3 месяца"], c: 1 }
    ],
    history: [
        { q: "В каком году была принята Конституция РУз?", a: ["1991", "1992", "1995"], c: 1 }
    ]
    // Можно добавить вопросы для остальных 5 категорий сюда
};

function updateUI() {
    const user = tg.initDataUnsafe.user || { first_name: "Artur" };
    document.getElementById('user_name').innerText = user.first_name;
    document.getElementById('user_points').innerText = points.toLocaleString();
    
    // Расчет прогресса и титула
    let progress = Math.min((points / 6000) * 100, 100);
    document.getElementById('total-progress-bar').style.width = progress + "%";
    document.getElementById('progress-percent').innerText = Math.round(progress) + "%";
    
    let title = "НОВИЧОК";
    if (points >= 1000) title = "УЧЕНИК";
    if (points >= 3000) title = "МАГИСТР";
    if (points >= 5000) title = "ПРОФЕССОР";
    document.getElementById('current-title-display').innerText = title;
}

function startQuiz(cat) {
    currentQ = 0;
    score = 0;
    document.getElementById('quiz-screen').style.display = 'flex';
    showQuestion(cat);
}

function showQuestion(cat) {
    const qList = questions[cat] || questions['law'];
    if (currentQ >= qList.length) {
        finishQuiz();
        return;
    }
    const q = qList[currentQ];
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('answer-options');
    container.innerHTML = '';
    
    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i, q.c, cat);
        container.appendChild(btn);
    });
    startTimer(cat);
}

function startTimer(cat) {
    let timeLeft = 10;
    document.getElementById('timer').innerText = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1, -1, cat);
        }
    }, 1000);
}

function checkAnswer(idx, correct, cat) {
    clearInterval(timer);
    if (idx === correct) {
        sndCorrect.play();
        score++;
    } else {
        sndWrong.play();
    }
    currentQ++;
    setTimeout(() => showQuestion(cat), 1000);
}

function finishQuiz() {
    let earned = score * 250;
    points += earned;
    localStorage.setItem('userPoints', points);
    document.getElementById('quiz-screen').style.display = 'none';
    updateUI();
    tg.showAlert(`Тест завершен! Вы заработали ${earned} очков.`);
}

updateUI();
