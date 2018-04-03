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
        'Ross: ': 25,
        'Monika: ': 30,
        'Chendler: ': 35,
        'Joey: ': 150
    };
    var fakeRankTableHard = {
        level: 'hard',
        'Monika: ': 30,
        'Chendler: ': 35,
        'Ross: ': 40,
        'Joey: ': 150
    }
    var rankTable = {};
    if (localStorage.length !== 0 && level == 'normal' && localStorage.getItem('normal')) {
        rankTable = localStorage.getItem('normal');
        return JSON.parse(rankTable);
    } else if (localStorage.length !== 0 && level == 'hard' && localStorage.getItem('hard')) {
        rankTable = localStorage.getItem('hard');
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
    gameBoard.innerHTML = '';
    var cards = {
        normal: {
            cards: 24
        },
        hard: {
            cards: 30
        }
    }
    cards = cards[level].cards;
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
    var cardsArray = [];
    shuffleArray(fontAwesomeArr);
    for (var i = 0; i < cards / 2; i++) {
        cardsArray.push(fontAwesomeArr[i]);
        cardsArray.push(fontAwesomeArr[i]);
    };
    var compare = "";
    var modal = document.querySelector("#modal");
    modal.classList.add("hidden2");
    shuffleArray(cardsArray);
    for (i = 0; i < cardsArray.length; i++) {
        var mainCard = createCards(cardsArray[i], mainCard, i);
        mainCard.addEventListener("click", function (e) {
            compare = compareCards(e, compare, ranking);
        });
        gameBoard.appendChild(mainCard);
    }
    gameBoard.parentElement.classList.remove("hidden");
}

function createCards(arrayObj, mainCard, i) {
    mainCard = document.createElement('div');
    var foreground = document.createElement('div');
    var background = document.createElement('div');
    var faIcon = document.createElement("i")
    mainCard.classList.add('sixOnSix');
    mainCard.setAttribute('id', i);
    foreground.classList.add('foreground');
    background.classList.add('background');
    faIcon.setAttribute("class", arrayObj);
    background.appendChild(faIcon);
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

function compareCards(e, compare, ranking) {
    if (checkClicked()) {
        return "";
    }
    var temp = e.target.parentElement.querySelector('.background')
    if (compare == "") {
        e.target.classList.add('clicked');
        return compare = e.target.parentElement.querySelector('.background');
    } else if (compare.parentElement.getAttribute('id') == e.target.parentElement.getAttribute('id')) {
        return compare;
    } else if (compare.innerHTML == temp.innerHTML) {
        e.target.classList.add('clicked');
        setTimeout(hideCards, 300, compare, e, ranking);
        return compare = "";
    }
    e.target.classList.add('clicked');
    setTimeout(resetCards, 700, compare, e);
    return compare = "";
}

function hideCards(compare, e, ranking) {
    compare.parentElement.classList.add('hidden');
    compare.parentElement.removeAttribute('id');
    e.target.parentElement.classList.add('hidden');
    e.target.parentElement.removeAttribute('id');
    compare.nextSibling.classList.remove("clicked");
    e.target.classList.remove("clicked");
    var scoreDiv = document.querySelector("#score span");
    var score = Number(scoreDiv.innerHTML);
    scoreDiv.innerHTML = score + 1;
    ifEnd(ranking);
}

function resetCards(compare, e) {
    e.target.classList.remove('clicked');
    compare.parentElement.querySelector(".foreground").classList.remove('clicked');
    var scoreDiv = document.querySelector("#score span");
    var score = Number(scoreDiv.innerHTML);
    scoreDiv.innerHTML = score + 1;
}

function checkClicked() {
    var clicked = document.querySelectorAll(".clicked")
    if (clicked.length == 2) {
        return true;
    } else return false;
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
        var input = document.getElementById("winner");
        modal.querySelector("#sectionPlay").classList.add("hidden2");
        modal.querySelector("#sectionEnterName").classList.remove("hidden2");
        score = Number(score);
        modal.classList.remove("hidden2");
        document.querySelector("#game").classList.add("hidden")
        modal.querySelector(".rank").classList.remove("hidden2");
        applyBtn.addEventListener("click", function (e) {
            e.target.parentElement.classList.add("hidden2");
            gameEnd(ranking, score, e, modal);
        });
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("applyBtn").click();
            }
        });
    }
}

function gameEnd(ranking, score, e, modal) {
    var tableToDelete = document.querySelector("table");
    var rank = document.querySelector(".rank");
    var name = document.querySelector("#winner").value;
    modal.querySelector("#sectionPlay").classList.remove("hidden2");
    modal.querySelector(".rank").classList.remove("hidden2");
    if (tableToDelete !== null) {
        rank.removeChild(tableToDelete);
    }
    ranking = objToArr(ranking);
    name = [name + ": ", score];
    ranking.push(name);
    ranking.sort(function (a, b) {
        return a[1] - b[1];
    });
    createTable(ranking, rank);
    score = document.querySelector("#score span");
    score.innerHTML = 0;
    var finalRanking = {};
    for (i = 0; i < ranking.length; i++) {
        finalRanking[ranking[i][0]] = ranking[i][1];
    }
    localStorage.setItem(finalRanking.level, JSON.stringify(finalRanking));
}

function createTable(ranking, rank) {
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
