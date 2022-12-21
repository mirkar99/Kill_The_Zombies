const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const game = document.querySelector('.game');

const startButton = menu.children[0];
const loadtButton = menu.children[1];

const userPoints = document.querySelector('.user-stats__element--points');
const userHealth = document.querySelector('.user-stats__element--health');
const userAmmo = document.querySelector('.user-stats__element--ammo');
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
const checkElementPositionY = (el) =>{
    if(el.offsetTop < window.visualViewport.height - 67 - el.offsetHeight / 2){
        return true;
    } else{
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

const functionalityForNewZombie = (el)=>{
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
    menu.classList.add('hidden')
    game.classList.remove('hidden')
    gameInterval = setInterval(() => {
        createNewZombie();
    }, 1000)
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
        if (Number(userHealth.innerText) === 0) {
            clearInterval(gameInterval);
            game.classList.add('hidden');
            const zombies = document.querySelectorAll('.zombie');
            zombies.forEach(el => el.remove())
            zombiesInterval.forEach(el => clearInterval(el));
            zombiesInterval.splice(0, zombiesInterval.length);
            menu.classList.remove('hidden');
            userAmmo.innerText = 14;
            userHealth.innerText = 100;
        }
    });
}
const config = {
    characterData: false, attributes: false, childList: true, subtree: false
};
const observeHealth = new MutationObserver(playerHealthChacker);
observeHealth.observe(userHealth, config);