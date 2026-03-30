// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Расширяем приложение на все окно
tg.expand();

// Получаем имя пользователя
const userCard = document.getElementById('user_name');
const userAvatar = document.getElementById('user_avatar');

if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    
    // Подставляем имя и фамилию
    userCard.innerText = `${user.first_name} ${user.last_name || ''}`;
    
    // Если есть аватарка, подставляем и её (если она доступна по URL)
    if (user.photo_url) {
        userAvatar.src = user.photo_url;
    }
} else {
    // Если открыто не в Telegram
    userCard.innerText = "Artur (Гость)";
}
