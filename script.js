const joinButton =
    document.getElementById("joinButton");

const backButton =
    document.getElementById("backButton");

const homePage =
    document.getElementById("homePage");

const formPage =
    document.getElementById("formPage");

const clickSound =
    document.getElementById("clickSound");

const bgMusic =
    document.getElementById("bgMusic");

const breakStartSound =
    document.getElementById("breakStartSound");

const blockBrokenSound =
    document.getElementById("blockBrokenSound");

function playSound(sound, volume = 0.25) {

    sound.currentTime = 0;

    sound.volume = volume;

    sound.play().catch(() => {

    });

}

function playOverlapSound(sound, volume = 0.25) {

    const clone = sound.cloneNode(true);

    clone.volume = volume;

    clone.play().catch(() => {

    });

    clone.addEventListener("ended", () => clone.remove());

}

let bgMusicStarted = false;

function startBgMusic() {

    if (bgMusicStarted) return;

    bgMusicStarted = true;

    bgMusic.volume = 0.12;

    bgMusic.play().catch(() => {

    });

}

document.addEventListener(
    "click",
    startBgMusic,
    { once: true }
);

const buttons =
    document.querySelectorAll(".sound-button");

buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            playSound(clickSound);

        }
    );

});

joinButton.addEventListener(
    "click",
    () => {

        playSound(clickSound);

        homePage.classList.add("hidden");

        setTimeout(() => {

            formPage.classList.add("active");

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }, 500);

    }
);

backButton.addEventListener(
    "click",
    () => {

        playSound(clickSound);

        formPage.classList.remove("active");

        setTimeout(() => {

            homePage.classList.remove("hidden");

        }, 200);

    }
);

const particlesContainer =
    document.getElementById("particles");

function createParticle() {

    const particle =
        document.createElement("div");

    particle.style.position =
        "fixed";

    const size =
        Math.random() * 3.5 + 1.5;

    particle.style.width =
        size + "px";

    particle.style.height =
        size + "px";

    particle.style.background =
        "rgba(220,240,255,0.85)";

    particle.style.borderRadius =
        "50%";

    const startX =
        Math.random() * 100;

    particle.style.left =
        startX + "vw";

    particle.style.top =
        "-10px";

    particle.style.pointerEvents =
        "none";

    particle.style.zIndex =
        "-1";

    particle.style.boxShadow =
        "0 0 8px rgba(150,210,255,0.8)";

    particlesContainer.appendChild(
        particle
    );

    const duration =
        Math.random() * 6000 + 7000;

    const drift =
        (Math.random() * 60 - 30) + "px";

    particle.animate(

        [

            {

                transform:
                    "translate(0, 0)",

                opacity: 0

            },

            {

                opacity: 0.9,

                offset: 0.15

            },

            {

                transform:
                    `translate(${drift}, 110vh)`,

                opacity: 0

            }

        ],

        {

            duration: duration,

            easing: "linear"

        }

    );

    setTimeout(() => {

        particle.remove();

    }, duration);

}

setInterval(
    createParticle,
    700
);

document.body.classList.add("intro-active");

const commandBreaker = document.getElementById("commandBreaker");
const blockWrap = document.getElementById("blockWrap");
const commandBlock = document.getElementById("commandBlock");
const commandConsole = document.getElementById("commandConsole");
const breakProgress = document.getElementById("breakProgress");
const breakCount = document.getElementById("breakCount");
const welcomeHint = document.getElementById("welcomeHint");
const letter = document.getElementById("letter");
const enterSite = document.getElementById("enterSite");

let hits = 0;
const hitsNeeded = 50;
let broken = false;

const minecraftCommands = [
    "/execute as @p at @s run particle minecraft:crit",
    "/playsound minecraft:block.stone.hit master @p",
    "/title @p actionbar {\"text\":\"Comando recibido...\"}",
    "/effect give @p minecraft:haste 1 0 true",
    "/say ¿Quién está intentando romperme?",
    "/execute at @p run particle minecraft:smoke",
    "/data get entity @p SelectedItem",
    "/give @p minecraft:diamond 1",
    "/tellraw @p {\"text\":\"Casi lo tienes...\"}",
    "/say SISTEMA: BLOQUE INESTABLE",
    "/setblock ~ ~ ~ minecraft:air",
    "/say > OBJETIVO DESBLOQUEADO"
];

function spawnCommand() {
    const text = minecraftCommands[Math.floor(Math.random() * minecraftCommands.length)];
    const command = document.createElement("div");
    command.className = "floating-command";
    command.textContent = text;
    command.style.setProperty("--x", `${Math.round((Math.random() - .5) * 360)}px`);
    command.style.setProperty("--y", `${Math.round((Math.random() - .5) * 180)}px`);
    commandConsole.appendChild(command);
    command.addEventListener("animationend", () => command.remove());
}

function hitBlock() {
    if (broken) return;

    hits++;
    blockWrap.dataset.damage = Math.min(9, Math.ceil((hits / hitsNeeded) * 9));
    breakProgress.style.width = `${hits / hitsNeeded * 100}%`;
    breakCount.textContent = `${hits} / ${hitsNeeded}`;

    if (hits >= 25) blockWrap.classList.add("critical");

    blockWrap.classList.remove("shake", "hit");
    void blockWrap.offsetWidth;
    blockWrap.classList.add("shake", "hit");

    spawnCommand();
    if (Math.random() > .55) setTimeout(spawnCommand, 120);

    playOverlapSound(clickSound);

    if (hits === 25) playOverlapSound(breakStartSound, 0.5);

    if (hits >= hitsNeeded) breakBlock();
}

function breakBlock() {
    broken = true;
    blockWrap.classList.add("broken");
    welcomeHint.style.opacity = "0";

    playSound(blockBrokenSound, 0.6);

    for (let i = 0; i < 5; i++) {
        setTimeout(spawnCommand, i * 90);
    }

    setTimeout(() => {
        letter.classList.add("revealed");
        letter.setAttribute("aria-hidden", "false");
        letter.style.pointerEvents = "auto";
    }, 550);
}

commandBreaker.addEventListener("click", (event) => {
    if (event.target.closest(".block-wrap") || event.target === commandBreaker) {
        hitBlock();
    }
});

commandBlock.addEventListener("contextmenu", (event) => event.preventDefault());

enterSite.addEventListener("click", () => {
    playSound(clickSound);
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-finished");

    setTimeout(() => {
        document.getElementById("welcomeOverlay").remove();
    }, 900);
});
