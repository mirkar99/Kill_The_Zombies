const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const game = document.querySelector('.game');
const afterGameMenu = document.querySelector('.menu--after-game');
const shop = document.querySelector('.shop');

const startButton = menu.children[0];
const loadtButton = menu.children[1];

const userPoints = document.querySelector('.user-stats__element--points');
const userHealth = document.querySelector('.user-stats__element--health');
const userAmmo = document.querySelector('.user-stats__element--ammo');

const afterGameMenuText = afterGameMenu.children[0];
const shopButton = afterGameMenu.children[1];
const saveButton = afterGameMenu.children[2];
const restartButton = afterGameMenu.children[3];

const shopBackButton = shop.children[0];

const zombiesInterval = [];
let gameInterval;

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
    if (el.offsetTop < window.visualViewport.height - 67 - el.offsetHeight / 2) {
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
const zombieNewTop = el => el.style.top = `${header.offsetHeight}px`;

const createNewGame = () => {
    userPoints.innerText = '0';
    userAmmo.innerText = 14;
    userHealth.innerText = 100;
    menu.classList.add('hidden')
    game.classList.remove('hidden')
    afterGameMenu.classList.add('hidden')
    gameInterval = setInterval(() => {
        createNewZombie();
    }, 1000)
}

const functionalityForNewZombie = (el) => {
    randomElementPositionX(el);
    let scaleValue = 1.0;
    let IntervalId = setInterval(() => {
        scaleValue += 0.2;
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
            el.remove();
        }
    });
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
            clearInterval(gameInterval);
            game.classList.add('hidden');
            const zombies = document.querySelectorAll('.zombie');
            zombies.forEach(el => el.remove())
            zombiesInterval.forEach(el => clearInterval(el));
            zombiesInterval.splice(0, zombiesInterval.length);
            afterGameMenuText.innerText = `You got ${userPoints.innerText} points`;
            afterGameMenu.classList.remove('hidden');
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
        'PointsAmount': userPoints.innerHTML
    }
    localStorage.setItem('Kill_The_Zombies_Save', JSON.stringify(save));
}
const loadState = function () {
    if (localStorage.getItem('Kill_The_Zombies_Save')) {
        const loadedSave = JSON.parse(localStorage.getItem('Kill_The_Zombies_Save'));
        menu.classList.add('hidden');
        afterGameMenu.classList.remove('hidden');
        userPoints.innerText = loadedSave.PointsAmount;
        afterGameMenuText.innerText = `You got ${loadedSave.PointsAmount} points`;
    }
}
loadtButton.addEventListener('click', () => {
    loadState();
})
shopButton.addEventListener('click', () => {
    afterGameMenu.classList.add('hidden');
    shop.classList.remove('hidden');
})
shopBackButton.addEventListener('click', () => {
    shop.classList.add('hidden');
    afterGameMenu.classList.remove('hidden');
})
saveButton.addEventListener('click', () => {
    saveState();
})
restartButton.addEventListener('click', () => {
    createNewGame();
})