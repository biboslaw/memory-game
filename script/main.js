document.addEventListener("DOMContentLoaded", main());

function main() {
    var button = document.querySelector('#go');
    button.addEventListener("click", function (e) {
        e.preventDefault();
        startGame();
    });
}

function checkStorage(level) {
    var fakeRankTableNormal =  {
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
    } else if (localStorage.length !== 0 && level == 'hard' && localStorage.getItem('hard')){
        rankTable = localStorage.getItem('hard');
        return  JSON.parse(rankTable);
    } else if (localStorage.length == 0 && level == 'normal'){
        localStorage.setItem('hard', JSON.stringify(fakeRankTableHard));
        return fakeRankTableNormal;
    }
    localStorage.setItem('hard', JSON.stringify(fakeRankTableNormal));
    return fakeRankTableHard;
}

function startGame() {
    var olToDelete = document.querySelector(".rankList");
    if (olToDelete !== null){
        var rankToRemoveChild = document.querySelector(".rank");
        rankToRemoveChild.removeChild(olToDelete);
    }
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
    var arrOfDecChars = [
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
        cardsArray.push(String.fromCodePoint(arrOfDecChars[i]));
        cardsArray.push(String.fromCodePoint(arrOfDecChars[i]));
    };
    var compare = "";
    var overCick = 0;
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
    mainCard.classList.add('sixOnSix');
    mainCard.setAttribute('id', i);
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
    setTimeout(resetCards, 500, compare, e);
    return compare = "";
};

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
        score = Number(score);
        modal.classList.remove("hidden2");
        document.querySelector("#game").classList.add("hidden")
        modal.querySelector(".rank").classList.remove("hidden2");
        applyBtn.addEventListener("click", function(e){
            gameEnd(ranking, score);
        });
        
    }
}

function gameEnd(ranking, score) {
    var name = document.querySelector("#winner").value;
    var ol ="";
    ol = document.createElement("ol");
    var rank = document.querySelector(".rank");
    ol.classList.add("rankList");
    ranking = objToArr(ranking);
    name = [name + ": ", score];
    ranking.push(name);
    ranking.sort(function (a,b){
        return a[1] - b[1];
    });
    for (var i = 1; i<ranking.length; i++){
        var li = document.createElement("li");
        li.innerHTML = ranking[i];
        ol.appendChild(li);
    }
    rank.appendChild(ol);
    score = document.querySelector("#score span");
    score.innerHTML = 0;
    var finalRanking = {};
    for (i = 0; i<ranking.length; i++){
        finalRanking[ranking[i][0]] = ranking[i][1];
    }
    localStorage.setItem(finalRanking.level, JSON.stringify(finalRanking));
}

function objToArr(obj){
    var arr = [];
    for (var key in obj){
      arr.push([key, obj[key]]);
    }
    return arr;
  }
