document.addEventListener("DOMContentLoaded", main());

function main() {
    var button = document.querySelector('#go');
    button.addEventListener("click", function (e) {
        e.preventDefault();
        startGame();
    });
}

function startGame() {
    var level = document.querySelector("#level").value;
    var gameBoard = document.querySelector('.gameBoard');
    gameBoard.innerHTML = '';
    var cards = 24;
    if (level === 'hard') {
        cards = 30;
    }
    var pattern = [
        9924,
        9967,
        9728,
        9731,
        9733,
        9760,
        9730,
        9822,
        9775,
        9762,
        9742,
        10052,
        3106,
        5844,
        9829,
        9200,
        8984,
        9738,
        9742,
        9749,
        9774,
        9775,
        9889,
        9928
    ];
    var cardsArray = [];
    for (var i = 0; i < cards / 2; i++) {
        cardsArray.push(String.fromCodePoint(pattern[i]));
        cardsArray.push(String.fromCodePoint(pattern[i]));
    };
    var compare = "";
    var overCick = 0;
    shuffleArray(cardsArray);
    for (i = 0; i < cardsArray.length; i++) {
        var mainCard = createCards(cardsArray[i], mainCard, i);
        mainCard.addEventListener("click", function (e) {
            compare = compareCards(e, compare);
            
        });
        gameBoard.appendChild(mainCard);
    }
}

function createCards(arrayObj, mainCard, i) {
    mainCard = document.createElement('div');
    var foreground = document.createElement('div');
    var background = document.createElement('div');
    mainCard.classList.add('sixOnSix');
    mainCard.dataset.attr = i;
    mainCard.setAttribute('id', 'card');
    foreground.classList.add('foreground');
    background.classList.add('background');
    background.innerHTML = arrayObj;
    mainCard.appendChild(background)
    mainCard.appendChild(foreground);
    return mainCard;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function compareCards(e, compare) {
    if (checkClicked()) {
        return "";
    }
    var temp = e.target.parentElement.querySelector('.background')
    if (compare == "") {
        e.target.classList.add('clicked');
        return compare = e.target.parentElement.querySelector('.background');
    } else if (compare.parentElement.dataset == e.target.parentElement.dataset) {
        return compare;
    } else if (compare.innerHTML == temp.innerHTML) {
        e.target.classList.add('clicked');
        setTimeout(hideCards, 300, compare, e);
        ifEnd();
        return compare = "";
    } 
        e.target.classList.add('clicked');
        setTimeout(resetCards, 300, compare, e);
        return compare = "";    
};

function hideCards(compare, e) {
    compare.parentElement.classList.add('hidden');
    compare.parentElement.removeAttribute('id');
    e.target.parentElement.classList.add('hidden');
    e.target.parentElement.removeAttribute('id');
    compare.nextSibling.classList.remove("clicked");
    e.target.classList.remove("clicked");
}

function resetCards(compare, e) {
    e.target.classList.remove('clicked');
    compare.parentElement.querySelector(".foreground").classList.remove('clicked');
}

function checkClicked() {
    var clicked = document.querySelectorAll(".clicked")
    if (clicked.length == 2) {
        return true;
    } else return false;
}

function ifEnd () {
    var ids = document.querySelectorAll('#card')
    console.log(ids)
    if (ids.length==0) {
        alert("Game over");
    }
}