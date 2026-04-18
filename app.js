let currentQ = [];
let index = 0;
let score = 0;
let totalPoints = 0;
let timer;

function startQuiz(cat) {
    if(!quizData[cat]) { alert("Tez kunda!"); return; }
    currentQ = [...quizData[cat]].sort(() => Math.random() - 0.5).slice(0, 10);
    index = 0;
    score = 0;
    document.getElementById('quiz-modal').style.display = 'flex';
    nextQuestion();
}

function nextQuestion() {
    if(index >= currentQ.length) { finishQuiz(); return; }
    
    const data = currentQ[index];
    document.getElementById('q-text').innerText = (index + 1) + ". " + data.q;
    const box = document.getElementById('options-box');
    box.innerHTML = "";
    
    data.o.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "opt-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i, data.c);
        box.appendChild(btn);
    });
    startTimer();
}

function checkAnswer(sel, cor) {
    clearInterval(timer);
    if(sel === cor) { score++; totalPoints++; }
    index++;
    nextQuestion();
}

function startTimer() {
    let s = 10;
    document.getElementById('timer').innerText = s;
    clearInterval(timer);
    timer = setInterval(() => {
        s--;
        document.getElementById('timer').innerText = s;
        if(s <= 0) { clearInterval(timer); index++; nextQuestion(); }
    }, 1000);
}

function finishQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
    alert("Test yakunlandi! To'g'ri javoblar: " + score);
    updateUI();
}

function updateUI() {
    document.getElementById('total-score').innerText = totalPoints;
    const ranks = ["Novichok", "Uchenik", "Student", "Bakalavr", "Magistr", "Professor"];
    let rIdx = Math.floor(totalPoints / 100);
    if(rIdx > 5) rIdx = 5;
    document.getElementById('rank-name').innerText = ranks[rIdx];
    let prog = totalPoints % 100;
    document.getElementById('progress-fill').style.width = prog + "%";
    document.getElementById('progress-percent').innerText = prog;
}
