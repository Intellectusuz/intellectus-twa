const tg = window.Telegram.WebApp;
tg.expand();

// Логика уровней
function getLevel(points) {
    if (points < 500) return "Новичок";
    if (points < 1500) return "Ученик";
    if (points < 3000) return "Магистр";
    if (points < 5000) return "Академик";
    return "ПРОФЕССОР";
}

// Заполнение данных
if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('user_name').innerText = user.first_name;
    // Здесь можно поставить реальные баллы из твоей базы
    const points = 1500; 
    document.getElementById('user_points').innerText = points.toLocaleString();
    document.getElementById('user_level').innerText = getLevel(points);
}
