var fontAwesomeArr = [
    "far fa-bell",
    "fas fa-bath",
    "fas fa-beer",
    "fas fa-birthday-cake",
    "fas fa-bus",
    "fas fa-chess-rook",
    "fas fa-couch",
    "fas fa-dove",
    "fas fa-fighter-jet",
    "fas fa-gift",
    "far fa-hand-point-right",
    "fab fa-hotjar",
    "fab fa-itunes-note",
    "fas fa-heart",
    "fas fa-leaf",
    "far fa-lightbulb",
    "fas fa-motorcycle",
    "fas fa-paw",
    "fas fa-puzzle-piece",
    "fab fa-reddit-alien"
];
var compare = false;

document.addEventListener("DOMContentLoaded", main());

function main() {
    var button = document.querySelector('#go');
    button.addEventListener("click", function (e) {
        e.preventDefault();
        startGame();
    });
}

function checkStorage(level) {
    var fakeRankTableNormal = {
        level: 'normal',
        'Ross': 25,
        'Monika': 30,
        'Chendler': 35,
        'Joey': 150
    };
    var fakeRankTableHard = {
        level: 'hard',
        'Monika': 30,
        'Chendler': 35,
        'Ross': 40,
        'Joey': 150
    }
    var rankTable = {};
    if (localStorage.length !== 0 && level == 'normal' && localStorage.getItem(level)) {
        rankTable = localStorage.getItem(level);
        return JSON.parse(rankTable);
    } else if (localStorage.length !== 0 && level == 'hard' && localStorage.getItem(level)) {
        rankTable = localStorage.getItem(level);
        return JSON.parse(rankTable);
    } else if (localStorage.length == 0 && level == 'normal') {
        localStorage.setItem('hard', JSON.stringify(fakeRankTableHard));
        return fakeRankTableNormal;
    }
    localStorage.setItem('hard', JSON.stringify(fakeRankTableNormal));
    return fakeRankTableHard;
}

function startGame() {
    var level = document.querySelector("#level").value;
    var ranking = checkStorage(level);
    var gameBoard = document.querySelector('.gameBoard');
    var modal = document.querySelector("#modal");
    var cardsArray = [];
    var cards = {
        normal: {
            cards: 24
        },
        hard: {
            cards: 30
        }
    }
    gameBoard.innerHTML = '';
    cards = cards[level].cards;
    shuffleArray(fontAwesomeArr);
    cardsArray = fontAwesomeArr.slice(1, cards / 2 + 1).concat(fontAwesomeArr.slice(1, cards / 2 + 1));
    
    modal.classList.add("hidden2");
    shuffleArray(cardsArray);
    for (i = 0; i < cardsArray.length; i++) {
        var mainCard = createCards(cardsArray[i], mainCard, i, ranking);
        gameBoard.appendChild(mainCard);
    }
    gameBoard.parentElement.classList.remove("hidden");
}

function compareCards(e, ranking) {
    var clickedCards = document.querySelectorAll(".clicked");
    if (clickedCards.length == 0 || e.target.parentElement.getAttribute("id") == clickedCards[0].parentElement.getAttribute("id")) {
        e.target.classList.add("clicked");
        return;
    } else if (clickedCards.length == 1) {
        e.target.classList.add("clicked");
        compare = clickedCards[0].parentElement.querySelector('.background').innerHTML == e.target.parentElement.querySelector('.background').innerHTML;
        setTimeout(hideCards, 700, compare, ranking);
    }
    return;
}

function hideCards(compare, ranking) {
    var cardsToHide = document.querySelectorAll(".clicked");
    var scoreDiv = document.querySelector("#score span");
    var score = Number(scoreDiv.innerHTML);
    if (compare) {
        for (var i = 0; i < cardsToHide.length; i++) {
            cardsToHide[i].classList.remove("clicked");
            cardsToHide[i].parentElement.removeAttribute("id");
            cardsToHide[i].classList.add("hidden2");
            cardsToHide[i].parentElement.querySelector(".background").classList.add("hidden2");
        }
        scoreDiv.innerHTML = score + 1;
        ifEnd(ranking);
    } else {
        for (var i = 0; i < cardsToHide.length; i++) {
            cardsToHide[i].classList.remove("clicked");
        }
        scoreDiv.innerHTML = score + 1;
    }
}

function checkClicked() {
    var clicked = document.querySelectorAll(".clicked")
    if (clicked.length == 2) {
        return true;
    } else return false;
}

function createCards(faIconClass, mainCard, i, ranking) {
    var foreground = document.createElement('div');
    var background = document.createElement('div');
    var faIcon = document.createElement("i");
    mainCard = document.createElement('div');
    mainCard.classList.add('sixOnSix');
    mainCard.setAttribute('id', i);
    foreground.classList.add('foreground');
    background.classList.add('background');
    faIcon.setAttribute("class", faIconClass);
    background.appendChild(faIcon);
    mainCard.appendChild(background)
    mainCard.appendChild(foreground);
    foreground.addEventListener("click", function (e) {
        e.stopPropagation();
        compareCards(e, ranking);
    });
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

function ifEnd(ranking) {
    var board = document.querySelectorAll('#gameBoard > div');
    var count = 0;
    for (i = 0; i < board.length; i++) {
        if (board[i].getAttribute("id")) {
            count++;
        }
    }
    if (count == 0) {
        var score = document.querySelector("#score span").innerHTML;
        var modal = document.querySelector("#modal");
        var applyBtn = document.querySelector(".applyBtn");
        var score2 = document.querySelector(".score2");
        modal.querySelector("#sectionPlay").classList.add("hidden2");
        modal.querySelector("#sectionEnterName").classList.remove("hidden2");
        score = Number(score);
        score2.innerHTML = "Score: " + score;
        modal.classList.remove("hidden2");
        document.querySelector("#game").classList.add("hidden")
        modal.querySelector(".rank").classList.remove("hidden2");
        applyBtn.addEventListener("click", function (e) {
            e.target.parentElement.classList.add("hidden2");
            gameEnd(ranking, score, e, modal);
        });
    }
}

function gameEnd(ranking, score, e, modal) {
    var tableToDelete = document.querySelector("table");
    var rank = document.querySelector(".rank");
    var name = document.querySelector("#winner").value;
    var finalRanking = {};
    modal.querySelector("#sectionPlay").classList.remove("hidden2");
    modal.querySelector(".rank").classList.remove("hidden2");
    if (tableToDelete !== null) {
        rank.removeChild(tableToDelete);
    }
    ranking = objToArr(ranking);
    name = [name, score];
    ranking.push(name);
    ranking.sort(function (a, b) {
        return a[1] - b[1];
    });
    createTable(ranking, rank, name);
    score = document.querySelector("#score span");
    score.innerHTML = 0;
    for (i = 0; i < ranking.length; i++) {
        finalRanking[ranking[i][0]] = ranking[i][1];
    }
    localStorage.setItem(finalRanking.level, JSON.stringify(finalRanking));
}

function createTable(ranking, rank, name) {
    var table = document.createElement("table");
    var th = document.createElement("thead");
    var thName = document.createElement("th");
    var thScore = document.createElement("th");
    thName.innerHTML = "Player";
    thName.classList.add("headName");
    thName.setAttribute("scope", "col");
    thScore.innerHTML = "Score";
    thScore.classList.add("headScore");
    thScore.setAttribute("scope", "col");
    th.appendChild(thName);
    th.appendChild(thScore);
    table.appendChild(th);
    table.classList.add("rankList");
    for (var i = 1; i < ranking.length; i++) {
        var newRow = table.insertRow(-1);
        if (ranking[i] == name) {
            newRow.setAttribute("class", "highlighted")
        }
        var nameCell = newRow.insertCell(0);
        var scoreCell = newRow.insertCell(1);
        nameCell.innerHTML = ranking[i][0];
        scoreCell.innerHTML = ranking[i][1];
    }
    rank.appendChild(table);
}

function objToArr(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push([key, obj[key]]);
    }
    return arr;
}