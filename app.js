// 1. Ўзгарувчиларни эълон қилиш
let currentScore = 0;
let correctAnswersCount = 0;
let questionIndex = 0;
let currentQuestions = [];
let timer;
let timeLeft = 10;

const ranks = ["Novichok", "Uchenik", "Student", "Bakalavr", "Magistr", "Professor"];

// 2. Йўналиш танланганда тестни бошлаш
function selectCategory(categoryName) {
    // Танланган йўналишдан 10 та тасодифий савол олиш
    const allCategoryQuestions = questionsBase[categoryName];
    if (!allCategoryQuestions) {
        alert("Саволлар топилмади!");
        return;
    }

    currentQuestions = allCategoryQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    questionIndex = 0;
    currentScore = 0;
    
    // Модаль ойнани очиш
    document.getElementById('quiz-modal').style.display = 'flex';
    showQuestion();
}

// 3. Саволни экранга чиқариш
function showQuestion() {
    // Агар саволлар тугаса
    if (questionIndex >= currentQuestions.length) {
        finishQuiz();
        return;
    }

    // Таймерни янгилаш
    resetTimer();

    const q = currentQuestions[questionIndex];
    document.getElementById('question-text').innerText = q.question;
    
    const container = document.getElementById('options-container');
    container.innerHTML = ""; // Эски жавобларни тозалаш

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "cat-btn"; // Олтин стилдаги тугма
        btn.onclick = () => checkAnswer(index, q.correct);
        container.appendChild(btn);
    });
}

// 4. Жавобни текшириш
function checkAnswer(chosen, correct) {
    clearInterval(timer); // Жавоб берилганда таймерни тўхтатиш

    if (chosen === correct) {
        currentScore++;
        correctAnswersCount++;
    }
    
    questionIndex++;
    updateUI(); // Юқоридаги бал ва прогрессни янгилаш
    showQuestion();
}

// 5. Таймер логикаси
function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('timer').innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            questionIndex++;
            showQuestion(); // Вақт тугаса кейинги саволга ўтиш
        }
    }, 1000);
}

// 6. Тестни якунлаш
function finishQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
    alert(`Тантанали натижа: 10 тадан ${currentScore} та тўғри топдингиз! 🏆`);
    // Бу ерда мусиқа қўйиш мумкин
}

// 7. Интерфейсни янгилаш (Баллар ва Унвонлар)
function updateUI() {
    document.getElementById('current-points').innerText = correctAnswersCount;
    
    let rankIndex = Math.floor(correctAnswersCount / 100);
    if(rankIndex >= ranks.length) rankIndex = ranks.length - 1;
    
    document.getElementById('rank-title').innerText = ranks[rankIndex];
    
    let progress = correctAnswersCount % 100;
    document.getElementById('rank-progress').style.width = progress + "%";
    document.getElementById('progress-percent').innerText = progress;
}

// Telegram WebApp маълумотларини олиш
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        document.getElementById('user-display-name').innerText = user.first_name;
    }
}
