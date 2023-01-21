const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const game = document.querySelector('.game');
const afterGameMenu = document.querySelector('.menu--after-game');
const shop = document.querySelector('.shop');

const startButton = menu.children[0];
const loadtButton = menu.children[1];

const userPoints = document.querySelector('.user-stats__element--points').children[1];
const userHealth = document.querySelector('.user-stats__element--health').children[1];
const userAmmo = document.querySelector('.user-stats__element--ammo');

const afterGameMenuText = afterGameMenu.children[0];
const saveButton = afterGameMenu.children[1];
const restartButton = afterGameMenu.children[2];


const zombiesInterval = [];
let gameInterval;
let killedZombies = 0;
let pointsAccumulator = 0;
let actualLevel = 1;

const levels = {
    1: {
        background: '../img/Cemetery.png',
        zombiesToKill: 12,
        levelWasWon: false
    },
    2: {
        background: '../img/Cemetery.png',
        zombiesToKill: 16,
        levelWasWon: false
    },
    3: {
        background: '../img/Cemetery.png',
        zombiesToKill: 19,
        levelWasWon: false
    },
    4: {
        background: '../img/Cemetery.png',
        zombiesToKill: 24,
        levelWasWon: false
    }
}
const randomElementPositionX = (el) => {
    const viewportWidth = window.visualViewport.width;
    const maxRage = viewportWidth + 1 - el.offsetWidth;
    const randomNumber = Math.floor(Math.random() * maxRage)
    el.style.left = `${randomNumber}px`;
}
const changeElementPositionY = (el) => {
    el.style.top = `${el.offsetTop + 15}px`;
}
const checkElementPositionY = (el) => {
    if (el.offsetTop < window.visualViewport.height - 67 - el.offsetHeight / 4) {
        return true;
    } else {
        return false;
    }
}
const scaleElement = (el, scale) => {
    el.style.transform = `scale(${scale})`;
}
const zombieAttack = function () {
    userHealth.innerText = Number(userHealth.innerText) - 5;
}
const zombieNewTop = el => el.style.top = `${window.visualViewport.height * 3 / 5}px`;

const createNewGame = () => {
    userPoints.innerText = '0';
    userAmmo.innerText = 14;
    userHealth.innerText = 100;
    menu.classList.add('hidden')
    game.style.backgroundImage = `url(${levels[actualLevel].background})`;
    game.classList.remove('hidden')
    afterGameMenu.classList.add('hidden')
    gameInterval = setInterval(() => {
        createNewZombie();
    }, 1000)
}
const createNextLevelButton = () => {
    if(!document.querySelector('.menu__button--next')){
    if (actualLevel < Object.keys(levels).length) {
        if (levels[actualLevel].levelWasWon) {
            const parent = document.querySelector('.menu--after-game');
            const btn = document.createElement('button');
            btn.innerText = 'Next Level';
            btn.classList.add('menu__button');
            btn.classList.add('menu__button--next');
            btn.addEventListener('click', () => {
                actualLevel++;
                createNewGame();
                btn.remove()
            })
            parent.append(btn)
        }
    }
}
}
const functionalityForNewZombie = (el) => {
    randomElementPositionX(el);
    let scaleValue = 1.0;
    let IntervalId = setInterval(() => {
        scaleValue += 0.5;
        if (checkElementPositionY(el)) {
            changeElementPositionY(el);
        } else {
            zombieAttack();
        }
        scaleElement(el, scaleValue);
        el.style.zIndex++
    }, 250);
    zombiesInterval.push(IntervalId);
    zombieNewTop(el);
    el.addEventListener('click', function () {
        if (Number(userAmmo.innerText) > 0) {
            userPoints.innerText = Number(userPoints.innerText) + 50;
            clearInterval(IntervalId);
            killedZombies++;
            el.remove();
        }
    });
}

const endGame = (text, winStatus) => {
    clearInterval(gameInterval);
    game.classList.add('hidden');
    const zombies = document.querySelectorAll('.zombie');
    zombies.forEach(el => el.remove())
    zombiesInterval.forEach(el => clearInterval(el));
    zombiesInterval.splice(0, zombiesInterval.length);
    killedZombies = 0;
    if (winStatus && levels[actualLevel].levelWasWon == false) {
        levels[actualLevel].levelWasWon = true;
        pointsAccumulator += Number(userPoints.innerHTML);
    }
    createNextLevelButton();
    afterGameMenuText.innerText = text;
    afterGameMenu.classList.remove('hidden');
}
const createNewZombie = () => {
    const newZombie = document.createElement('div');
    newZombie.classList.add('zombie');
    game.appendChild(newZombie);
    functionalityForNewZombie(newZombie);
}

window.addEventListener("resize", () => {
    const zombies = document.querySelectorAll('.zombie');
    zombies.forEach(el => el.remove())
    zombiesInterval.forEach(el => clearInterval(el));
    zombiesInterval.splice(0, zombiesInterval.length);
});

startButton.addEventListener('click', () => {
    createNewGame();
})

game.addEventListener('click', () => {
    if (Number(userAmmo.innerText) > 0) {
        userAmmo.innerText = Number(userAmmo.innerText) - 1;
        if (Number(userAmmo.innerText) === 0) {
            userAmmo.innerText = 'Click Realod';
        }
        if (killedZombies === levels[actualLevel].zombiesToKill) {
            if (levels[actualLevel].levelWasWon == true) {
                return endGame(`You did Won again, and you sill have ${pointsAccumulator} points`, true);
            }
            endGame(`You Won and get ${userPoints.innerText} points`, true);
        }
    }
});

userAmmo.addEventListener('click', () => {
    if (Number(userAmmo.innerText) < 14 || userAmmo.innerText == 'Click Realod') {
        userAmmo.innerText = 15;
    }
});

const playerHealthChacker = function (mutation) {
    mutation.forEach(function (mutation) {
        if (Number(userHealth.innerHTML) === 0) {
            endGame(`You Lose`, false);
        }
    });
}
const config = {
    characterData: false, attributes: false, childList: true, subtree: false
};
const observeHealth = new MutationObserver(playerHealthChacker);
observeHealth.observe(userHealth, config);

const saveState = function () {
    const save = {
        'PointsAmount': pointsAccumulator,
        'afterGameMenuText': afterGameMenuText.innerText,
        'actualLevel': actualLevel,
        'levelProgress': levels
    }
    localStorage.setItem('Kill_The_Zombies_Save', JSON.stringify(save));
}
const loadState = function () {
    if (localStorage.getItem('Kill_The_Zombies_Save')) {
        const loadedSave = JSON.parse(localStorage.getItem('Kill_The_Zombies_Save'));
        menu.classList.add('hidden');
        afterGameMenu.classList.remove('hidden');
        pointsAccumulator = loadedSave.PointsAmount;
        afterGameMenuText.innerText = loadedSave.afterGameMenuText;
        actualLevel = loadedSave.actualLevel;
        Object.keys(levels).forEach(function (key) {
            if (loadedSave.levelProgress[key]) {
                levels[key] = loadedSave.levelProgress[key]
            }
        });
        createNextLevelButton();
    }
}
loadtButton.addEventListener('click', () => {
    loadState();
})
saveButton.addEventListener('click', () => {
    saveState();
})
restartButton.addEventListener('click', () => {
    createNewGame();
})