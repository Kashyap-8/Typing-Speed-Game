const words = 'His ultimate dream fantasy consisted of being content and sleeping eight hours in a row'.split(' ');
const wordCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;



function randomWord() {
    const randomIndex = Math.ceil(Math.random() * wordCount);
    return words[randomIndex -1];
}
function addClass(el, name) {
    el.className += ' '+name;
}
function removeClass(el, name) {
    el.className = el.className.replace(name,' ');
}

function formatWord(word) {
    return `<div class = "word">
          <span class="letter">
              ${word.split('').join('</span><span class="letter">')}
          </span>
        </div>`;
}

function newSession() {
    document.getElementById('words').innerHTML = ' ';
    for (let i=0; i<200; ++i) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';
    window.timer = null;
}
function getWpm(){
    const words = [...document.querySelector('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypeWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}

function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    //to get Words per min
    const result = getWpm()
    document.getElementById('info').innerHTML = `WPM: ${getWpm}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter.innerHTML || ' ';
    //letters
    const isLetter = key.length === 1 && key !== ' ';
    //space key
    const isSpace = key === ' ';
    //backspace
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    //game over check
    if (document.querySelector('#game.over')){
        return;
    }

    console.log({key, expected});

    //start timer
    if(!window.timer && isLetter) {
        window.timer = setInterval(()=>{
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();

            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (window.gameTime / 1000) - sPassed;
            if (sLeft < 0){
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
        alert('start timer');

    }

    if (isLetter) {
        if (currentLetter){
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
            addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== ' '){
            const lettersToInvalidate = [...document.querySelector('.word.current.letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling,'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }
    // add backspace
    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            // make previous word current, last letter current
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling,'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter) {
            //move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        // back space after taking everything out
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentLetter.lastChild, 'incorrect');
            removeClass(currentLetter.lastChild, 'correct');
        }
    }
    // move lines / words
    if(currentWord.getBoundingClientRect().top > 180){
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';

    }

    // move the cursor
    const nextLetter = document.querySelector('.letter.current');
    // next word
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor')


    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
    } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
    }
})
/*
document.getElementById('newSessionButton').addEventListener('click',()({
    gameOver();
    newSession();
});

 */
newSession();