const tg = window.Telegram.WebApp;
tg.expand();

const questions = [
    { q: "Мин. количество граждан для законодат. инициативы в РУз?", a: ["50 тысяч", "100 тысяч", "200 тысяч"], c: 1 },
    { q: "Макс. срок испытания при приеме на работу?", a: ["1 месяц", "2 месяца", "3 месяца"], c: 2 },
    { q: "С какого возраста наступает общая уголовная ответственность?", a: ["С 14 лет", "С 16 лет", "С 18 лет"], c: 1 }
];

let currentQ = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;

// Запуск теста при нажатии на "Юридика"
document.querySelector('.cat-item').onclick = () => {
    document.getElementById('quiz-screen').style.display = 'flex';
    showQuestion();
};

function showQuestion() {
    if (currentQ >= questions.length) {
        alert(`Тест окончен! Твой счет: ${score * 250} баллов`);
        location.reload();
        return;
    }

    const q = questions[currentQ];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('question-number').innerText = `Вопрос ${currentQ + 1}/${questions.length}`;
    
    const container = document.getElementById('answer-options');
    container.innerHTML = '';
    
    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        container.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timeLeft = 10;
    document.getElementById('timer').innerText = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(-1); // Время вышло
        }
    }, 1000);
}

function checkAnswer(idx) {
    clearInterval(timerInterval);
    const correct = questions[currentQ].c;
    const buttons = document.querySelectorAll('.option-btn');

    if (idx === correct) {
        score++;
        if (buttons[idx]) buttons[idx].classList.add('correct');
    } else {
        if (buttons[idx]) buttons[idx].classList.add('wrong');
        buttons[correct].classList.add('correct');
    }

    setTimeout(() => {
        currentQ++;
        showQuestion();
    }, 1500);
}
