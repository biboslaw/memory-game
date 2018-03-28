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
    var pattern = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
    var littleArray = [];
    for (var i = 0; i < cards / 2; i++) {
        littleArray.push(pattern[i]);
        littleArray.push(pattern[i]);
    };
    var compare = "";
    shuffleArray(littleArray);
    for (i = 0; i < littleArray.length; i++) {
        var card = document.createElement('div');
        card.classList.add('sixOnSix');
        card.textContent = littleArray[i];
        card.addEventListener("click", function (e) {
            console.log(compare)
            if (compare == "") {
                compare = e.target
            } else if (compare !== "" && compare.innerHTML == e.target.innerHTML) {
                compare.classList.add('hidden');
                e.target.classList.add('hidden');
                compare = "";
            } else if (compare !== "" && compare.innerHTML !== e.target.innerHTML) {
                compare ="";
            }
        });
        gameBoard.appendChild(card);

    }
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
    console.log(compare)
    if (compare == "") {
        compare = e.target
    } else if (compare !== "") {
        console.log(compare);
        console.log(e.target);
    }
    console.log(compare)
    return compare;
};

function clearArray(array) {
    array.length = 0;
};