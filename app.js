const tg = window.Telegram.WebApp;
tg.expand();

// Логика автоматического определения звания
const levels = [
    { threshold: 0, title: "Новичок" },
    { threshold: 1000, title: "Ученик" },
    { threshold: 2500, title: "Магистр" },
    { threshold: 4500, title: "Академик" },
    { threshold: 6000, title: "ПРОФЕССОР" }
];

function getCurrentLevel(points) {
    let current = "Новичок";
    for (let level of levels) {
        if (points >= level.threshold) {
            current = level.title;
        } else {
            break;
        }
    }
    return current;
}

if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    // Заменяем данные на настоящие
    const points = 1500; // Пример баллов (здесь должна быть реальная база)
    const levelTitle = getCurrentLevel(points);

    document.getElementById('user_name').innerText = `${user.first_name} (${levelTitle})`;
    document.getElementById('user_points').innerText = points.toLocaleString();
}
