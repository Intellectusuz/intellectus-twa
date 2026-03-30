let tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

document.getElementById('user-name').innerText = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Гость";

let timeLeft = 15;
let timerId;

function startQuiz() {
    document.getElementById('question-text').innerText = "Статья 104 ТК РУз: Форма приказа о приеме на работу?";
    document.getElementById('options').innerHTML = `
        <button class="ans-btn" onclick="checkAns('B')">Б) Письменная</button>
        <button class="ans-btn" onclick="checkAns('A')">А) Устная</button>
    `;
    
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerId);
            alert("Время вышло! Вы проиграли.");
            tg.close();
        }
    }, 1000);
}

function checkAns(ans) {
    clearInterval(timerId);
    if(ans === 'B') {
        alert("Правильно! +50 IQ. Вы на пути к титулу!");
    } else {
        alert("Ошибка! Изучите Статью 104.");
    }
    tg.close();
}