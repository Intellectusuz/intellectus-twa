const RANKS = [
    { name: "Новичок", min: 0, max: 100 },
    { name: "Ученик", min: 100, max: 200 },
    { name: "Студент", min: 200, max: 300 },
    { name: "Бакалавр", min: 300, max: 400 },
    { name: "Магистр", min: 400, max: 500 },
    { name: "Профессор", min: 500, max: 600 },
];

const DIRECTIONS = [
    { key: "Huquqshunoslik", name: "Ҳуқуқшунослик", icon: "⚖️" },
    { key: "Tarix", name: "Тарих", icon: "📜" },
    { key: "Geografiya", name: "География", icon: "🌍" },
    { key: "Adabiyot", name: "Адабиёт", icon: "📖" },
    { key: "Fizika", name: "Физика", icon: "⚡" },
    { key: "Kimyo", name: "Химия", icon: "🧪" },
    { key: "Astronomiya", name: "Астрономия", icon: "🔭" },
];

const QUIZ_TYPES = {
    daily: { title: "Кунлик", label: "🌅 Кунлик тест", sub: "10 та савол · 10 сек", count: 10 },
    weekly: { title: "Ҳафталик", label: "📅 Ҳафталик тест", sub: "30 та савол · 10 сек", count: 30 },
    monthly: { title: "Ойлик", label: "🗓 Ойлик тест", sub: "60 та савол · 10 сек", count: 60 },
};

const TOP10 = [
    { name: "Alisher T.", pts: 487, rank: "Магистр", avatar: "AT" },
    { name: "Dilnoza K.", pts: 412, rank: "Магистр", avatar: "DK" },
    { name: "Bobur R.", pts: 389, rank: "Бакалавр", avatar: "BR" },
    { name: "Malika S.", pts: 355, rank: "Бакалавр", avatar: "MS" },
    { name: "Jasur N.", pts: 310, rank: "Бакалавр", avatar: "JN" },
    { name: "Zulfiya O.", pts: 278, rank: "Студент", avatar: "ZO" },
    { name: "Sardor M.", pts: 234, rank: "Студент", avatar: "SM" },
    { name: "Feruza A.", pts: 198, rank: "Ученик", avatar: "FA" },
    { name: "Sherzod B.", pts: 167, rank: "Ученик", avatar: "SB" },
    { name: "Nilufar X.", pts: 112, rank: "Ученик", avatar: "NX" },
];

const USER = { name: "Вы", pts: 42, avatar: "ВЫ" };

let userPts = USER.pts;
let activeQuiz = null;
let openedDirection = null;
let timer = null;
let answerDelay = null;

function getRank(pts) {
    return RANKS.find(rank => pts < rank.max) || RANKS[RANKS.length - 1];
}

function getRankProgress(pts) {
    const rank = getRank(pts);
    const boundedPts = Math.min(pts, rank.max);
    return Math.round(((boundedPts - rank.min) / (rank.max - rank.min)) * 100);
}

function shuffle(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function avatarTemplate(initials, gold = false) {
    return `<div class="avatar ${gold ? "avatar--gold" : ""}">${initials}</div>`;
}

function rankBadgeTemplate() {
    const rank = getRank(userPts);
    const progress = getRankProgress(userPts);

    return `
        <div class="rank-badge">
            <div class="rank-badge__title"><span>🏅</span><strong>${rank.name}</strong></div>
            <div class="rank-badge__limits"><span>${rank.min} балл</span><span>${rank.max} балл</span></div>
            <div class="rank-badge__bar"><div style="width:${progress}%"></div></div>
            <div class="rank-badge__caption">Прогресс: ${progress}% (${Math.max(0, Math.min(userPts, rank.max) - rank.min)}/${rank.max - rank.min} балл)</div>
        </div>
    `;
}

function renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <header class="header">
            <h1>INTELECTUS UZBEKISTAN</h1>
            <p>created by "A.K.Djuginisov"</p>
        </header>

        <section class="user-panel">
            ${avatarTemplate(USER.avatar, true)}
            <div class="user-panel__info">
                <strong>${USER.name}</strong>
                <div class="score-line"><span>🏆</span><b>${userPts}</b><span>балл</span></div>
            </div>
            <div class="user-panel__rank">${rankBadgeTemplate()}</div>
        </section>

        <main class="main-grid">
            <section class="left-column">
                <h2><span>🏅</span> Рейтинг топ-10</h2>
                <div class="leaderboard">${TOP10.map(leaderTemplate).join("")}</div>
                ${superQuizTemplate()}
            </section>

            <section class="right-column">
                <h2><span>📚</span> Йўналишлар</h2>
                <div class="directions">${DIRECTIONS.map(directionTemplate).join("")}</div>
            </section>
        </main>

        <div id="quiz-modal" class="modal" aria-hidden="true"></div>
    `;
}

function leaderTemplate(user, index) {
    const placeClass = index === 0 ? "leader--gold" : index === 1 ? "leader--silver" : index === 2 ? "leader--bronze" : "";
    return `
        <article class="leader ${placeClass}">
            <span class="leader__place">${index + 1}</span>
            ${avatarTemplate(user.avatar, index < 3)}
            <div class="leader__meta"><strong>${user.name}</strong><small>${user.rank}</small></div>
            <b>${user.pts}</b>
        </article>
    `;
}

function superQuizTemplate() {
    return `
        <section class="super-quiz">
            <div class="super-quiz__head">
                <strong>⚡ Супер Савол-жавоб</strong>
                <small>30 та савол · рейтинг учун</small>
            </div>
            <div class="super-quiz__body">
                <button class="gold-button" onclick="startSuperQuiz()">🚀 Бошлаш</button>
            </div>
            <div class="podium">
                ${[
                    { pos: "🥇", name: "Alisher T.", pts: 28 },
                    { pos: "🥈", name: "Dilnoza K.", pts: 25 },
                    { pos: "🥉", name: "Bobur R.", pts: 22 },
                ].map(winner => `
                    <div class="podium__item">
                        <div>${winner.pos}</div>
                        <strong>${winner.name}</strong>
                        <span>${winner.pts} балл</span>
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

function directionTemplate(direction) {
    const isOpen = openedDirection === direction.key;
    return `
        <article class="direction-card">
            <button class="direction-card__toggle" onclick="toggleDirection('${direction.key}')">
                <span>${direction.icon}</span>
                <strong>${direction.name}</strong>
                <small>${isOpen ? "▲" : "▼"}</small>
            </button>
            ${isOpen ? `
                <div class="direction-card__tests">
                    ${Object.entries(QUIZ_TYPES).map(([type, item]) => `
                        <button onclick="startQuiz('${direction.key}', '${type}')">
                            <span>${item.label}</span>
                            <small>${item.sub}</small>
                        </button>
                    `).join("")}
                </div>
            ` : ""}
        </article>
    `;
}

function toggleDirection(key) {
    openedDirection = openedDirection === key ? null : key;
    renderApp();
}

function startSuperQuiz() {
    startQuiz("Tarix", "weekly", true);
}

function startQuiz(directionKey, type = "daily", isSuper = false) {
    const source = quizData[directionKey];
    if (!source || !source.length) {
        alert("Tez kunda!");
        return;
    }

    const questionCount = Math.min(QUIZ_TYPES[type].count, source.length);
    activeQuiz = {
        directionKey,
        title: isSuper ? "⚡ Супер Савол-жавоб" : `${DIRECTIONS.find(direction => direction.key === directionKey).name} · ${QUIZ_TYPES[type].title}`,
        questions: shuffle(source).slice(0, questionCount),
        index: 0,
        score: 0,
        selected: null,
        timeLeft: 10,
        done: false,
    };

    renderQuizModal();
    beginTimer();
}

function renderQuizModal() {
    const modal = document.getElementById("quiz-modal");
    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");

    if (activeQuiz.done) {
        const percent = Math.round((activeQuiz.score / activeQuiz.questions.length) * 100);
        modal.innerHTML = `
            <section class="quiz-card">
                <header class="quiz-card__header">
                    <strong>${activeQuiz.title}</strong>
                    <button onclick="closeQuiz()">✕</button>
                </header>
                <div class="quiz-result">
                    <div class="quiz-result__icon">${percent >= 70 ? "🏆" : percent >= 40 ? "🎯" : "📚"}</div>
                    <strong>${activeQuiz.score} / ${activeQuiz.questions.length}</strong>
                    <p>Тўғри жавоблар: ${percent}%</p>
                    <span>${percent >= 70 ? "Ajoyib natija! 🌟" : percent >= 40 ? "Yaxshi urinish! 💪" : "Ko'proq o'rganish kerak 📖"}</span>
                    <button class="gold-button" onclick="closeQuiz()">Yopish</button>
                </div>
            </section>
        `;
        return;
    }

    const question = activeQuiz.questions[activeQuiz.index];
    modal.innerHTML = `
        <section class="quiz-card">
            <header class="quiz-card__header">
                <strong>${activeQuiz.title}</strong>
                <button onclick="closeQuiz()">✕</button>
            </header>
            <div class="quiz-body">
                <div class="quiz-status">
                    <span>Savol ${activeQuiz.index + 1} / ${activeQuiz.questions.length}</span>
                    <b class="${activeQuiz.timeLeft <= 3 ? "danger" : ""}">⏱ ${activeQuiz.timeLeft}s</b>
                    <span>Ball: ${activeQuiz.score}</span>
                </div>
                <div class="question-box">
                    <div class="time-bar"><div class="${activeQuiz.timeLeft <= 3 ? "danger-bg" : ""}" style="width:${(activeQuiz.timeLeft / 10) * 100}%"></div></div>
                    <p>${question.q}</p>
                </div>
                <div class="answers">
                    ${question.o.map((option, index) => answerButtonTemplate(option, index, question.c)).join("")}
                </div>
            </div>
        </section>
    `;
}

function answerButtonTemplate(option, index, correctIndex) {
    let stateClass = "";
    if (activeQuiz.selected !== null) {
        if (index === correctIndex) stateClass = "answer--correct";
        else if (index === activeQuiz.selected) stateClass = "answer--wrong";
    }

    return `
        <button class="answer ${stateClass}" onclick="selectAnswer(${index})" ${activeQuiz.selected !== null ? "disabled" : ""}>
            <b>${String.fromCharCode(65 + index)}.</b> ${option}
        </button>
    `;
}

function beginTimer() {
    clearInterval(timer);
    activeQuiz.timeLeft = 10;
    renderQuizModal();

    timer = setInterval(() => {
        activeQuiz.timeLeft -= 1;
        if (activeQuiz.timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(null);
            return;
        }
        renderQuizModal();
    }, 1000);
}

function selectAnswer(selected) {
    if (!activeQuiz || activeQuiz.selected !== null) return;

    clearInterval(timer);
    clearTimeout(answerDelay);
    const question = activeQuiz.questions[activeQuiz.index];
    activeQuiz.selected = selected;
    if (selected === question.c) activeQuiz.score += 1;
    renderQuizModal();

    answerDelay = setTimeout(() => {
        if (!activeQuiz) return;
        activeQuiz.index += 1;
        activeQuiz.selected = null;

        if (activeQuiz.index >= activeQuiz.questions.length) {
            userPts += activeQuiz.score;
            activeQuiz.done = true;
            renderApp();
            renderQuizModal();
            return;
        }

        beginTimer();
    }, 800);
}

function closeQuiz() {
    clearInterval(timer);
    clearTimeout(answerDelay);
    activeQuiz = null;
    renderApp();
}

renderApp();
