const tg = window.Telegram.WebApp;
tg.expand();

let points = parseInt(localStorage.getItem('userPoints')) || 0;
let currentQ = 0;
let score = 0;
let timer;

const questions = {
    law: [
        { q: "С какого возраста полная дееспособность в РУз?", a: ["16 лет", "18 лет", "21 год"], c: 1 },
        { q: "Минимальный возраст для вступления в брак в РУз?", a: ["17 лет", "18 лет", "16 лет"], c: 1 }
    ]
};

function updateUI() {
    const user = tg.initDataUnsafe.user || { first_name: "Artur" };
    document.getElementById('user_name').innerText = user.first_name;
    document.getElementById('user_points').innerText = points.toLocaleString();
    
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
    currentQ = 0; score = 0;
    document.getElementById('quiz-screen').style.display = 'flex';
    showQuestion(cat);
}

function showQuestion(cat) {
    const qList = questions[cat] || questions['law'];
    if (currentQ >= qList.length) {
        points += (score * 250);
        localStorage.setItem('userPoints', points);
        document.getElementById('quiz-screen').style.display = 'none';
        updateUI();
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
        btn.onclick = () => { currentQ++; showQuestion(cat); };
        container.appendChild(btn);
    });
}

updateUI();
