let currentScore = 0;
let correctAnswersCount = 0;
let timerInterval;

const ranks = ["Novichok", "Uchenik", "Student", "Bakalavr", "Magistr", "Professor"];

function updateRank() {
    // Har 100 ta to'g'ri javob uchun yangi unvon
    let rankIndex = Math.floor(correctAnswersCount / 100);
    if(rankIndex >= ranks.length) rankIndex = ranks.length - 1;
    
    document.getElementById('rank-title').innerText = ranks[rankIndex];
    let progress = correctAnswersCount % 100;
    document.getElementById('rank-progress').style.width = progress + "%";
    document.getElementById('progress-percent').innerText = progress;
}

function selectCategory(name) {
    alert(`${name} yo'nalishi tanlandi.\n3 ta karta: Kunlik, Haftalik, Oylik.`);
    // Bu yerda modal oynani ochib 10 ta savolni yuklash lozim
    startQuiz(10); // Kunlik test misolida
}

function startQuiz(totalQuestions) {
    let modal = document.getElementById('quiz-modal');
    modal.style.display = 'flex';
    let timeLeft = 10;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if(timeLeft <= 0) {
            nextQuestion();
        }
    }, 1000);
}

function nextQuestion() {
    // Savollar o'zgarishi va tugagandan so'ng ball ko'rsatish logikasi
    clearInterval(timerInterval);
    // Effektli musiqa va ball ko'rsatish
}

// Telegram WebApp API bilan ishlash (agar Telegramda bo'lsa)
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        document.getElementById('user-display-name').innerText = user.first_name + " " + (user.last_name || "");
    }
}
