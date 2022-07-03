const words = 'His ultimate dream fantasy consisted of being content and sleeping eight hours in a row'.split(' ');
const wordCount = words.length;


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

    console.log({key, expected});

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

    // move the cursor
    const nextLetter = document.querySelector('.letter.current');
    // nextword
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

newSession();