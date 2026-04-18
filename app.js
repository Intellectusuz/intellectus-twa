let currentScore = 0;
let correctAnswersCount = 0;
let questionIndex = 0;
let currentQuestions = [];
let timer;
let timeLeft = 10;

const ranks = ["Novichok", "Uchenik", "Student", "Bakalavr", "Magistr", "Professor"];

function selectCategory(categoryName) {
    const allCategoryQuestions = questionsBase[categoryName];
    if (!allCategoryQuestions) return;

    currentQuestions = allCategoryQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    questionIndex = 0;
    currentScore = 0;
    
    document.getElementById('quiz-modal').style.display = 'flex';
    showQuestion();
}

function showQuestion() {
    if (questionIndex >= currentQuestions.length) {
        finishQuiz();
        return;
    }

    resetTimer();
    const q = currentQuestions[questionIndex];
    document.getElementById('question-text').innerText = q.question;
    
    const container = document.getElementById('options-container');
    container.innerHTML = ""; 

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "cat-card"; 
        btn.style.width = "100%";
        btn.onclick = () => checkAnswer(index, q.correct);
        container.appendChild(btn);
    });
}

function checkAnswer(chosen, correct) {
    clearInterval(timer);
    if (chosen === correct) {
        currentScore++;
        correctAnswersCount++;
    }
    questionIndex++;
    updateUI();
    showQuestion();
}

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
            showQuestion();
        }
    }, 1000);
}

function finishQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
    alert(`Test yakunlandi! Natija: 10 dan ${currentScore} ball.`);
}

function updateUI() {
    document.getElementById('current-points').innerText = correctAnswersCount;
    let rankIdx = Math.floor(correctAnswersCount / 100);
    if(rankIdx >= ranks.length) rankIdx = ranks.length - 1;
    document.getElementById('rank-title').innerText = ranks[rankIdx];
    let progress = correctAnswersCount % 100;
    document.getElementById('rank-progress').style.width = progress + "%";
    document.getElementById('progress-percent').innerText = progress;
}
