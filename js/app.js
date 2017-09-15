var memory = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

//variables used in the memory game
var memoryValue = [];
var tileFlip = 0;
var shuffledCards = shuffle(memory);
var steps = 0;
var step =0;
$(".moves").append(steps + " Moves");
var myTime;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffledCards.forEach(function(card) {
    var cardElement = '<li class="card"><i class="' + card + '"></i></li>';
    $('.deck').append(cardElement);
});

var domCards = document.getElementsByClassName("card");
for (var i = 0; i < domCards.length; i++) {
    domCards[i].addEventListener('click', function() {
        masterMemoryFlip(this, shuffledCards);
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$(".restart").click(function() {
    location.reload();
});

var a, b;
function timer() {
    var sec = 0;
    //timer function for calculating how much time player takes to finish the game
    myTime = setInterval(function() {
        a = pad(++sec % 60);
        b = pad(parseInt(sec / 60, 10));
        document.getElementById("seconds").innerHTML = a;
        document.getElementById("minutes").innerHTML = b;
    }, 1000);
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function canFlipCard(tile) {
    //initial condition to make only two cards to flip at a time 
    return memoryValue.length < 2;
}

function display(tile) {
    //function to display the underlying symbol in the card
    $(tile).addClass("open show mouse").removeClass("magictime twisterInDown");
}

function noCardFlip() {
    //condition to check no cards are flipped
    return memoryValue.length == 0;
}

function oneCardFlip() {
    //condition to check one card is flipped
    return memoryValue.length == 1;
}

function isThereIsAMatch() {
    //condition for checking the flipped cards have a match
    var array1 = $(memoryValue[0]).find('i').attr('class');
    var array2 = $(memoryValue[1]).find('i').attr('class');

    return array1 == array2;
}

function setFlip(tile) {
    //pushing or adding the card to an array
    memoryValue.push(tile);
    step++;
}

function matchCards(tile) {
    //if both cards are same then the cards are matched and the array is emptied to receive next set
    tileFlip += 2;

    $(memoryValue[0]).removeClass("open show").addClass("match magictime puffIn mouse");
    $(memoryValue[1]).removeClass("open show").addClass("match magictime puffIn mouse");
    memoryValue = [];

    //to calculate number of steps the player plays
    steps++;
    $(".moves").html(steps + " Moves");
    stepCheck(steps);
}

function isGameOver() {
    //checking flipped cards is equal to the total number of cards
    return tileFlip == shuffledCards.length;
}

function end() {
	var finish = "<label id='finish'></label>";
    $("body").append(finish);
    $("#finish").html("Congratulations! You Won!!!<br>You finished the game in  " + steps + "  steps and with  " + star + "  stars<br>Time elapsed : " + b + ":" + a);
}

function gameOver() {
    //if flipped is equal to number of cards then we can end the game
    clearInterval(myTime);
    $(".container").remove();
    end();
    var butto = "<button>Play again</button>";
    $("#finish").append(butto);
    $("button").click(function() {
    	location.reload();
    });
}

function cardsDoNotMatch() {
    //if cards do not match then the function flipback is executed
    //setTimeout is set up to extend the time for executing the function
    setTimeout(flipBack, 500);
}

function flipBack() {
    //condition to flip the card back to original
    $(memoryValue[0]).addClass("magictime twisterInDown").removeClass("open show mouse");
    $(memoryValue[1]).addClass("magictime twisterInDown").removeClass("open show mouse");
    memoryValue = [];

    //to calculate number of steps the player plays
    steps++;
    $(".moves").html(steps + " Moves");
    stepCheck(steps);
}
var star;
function stepCheck(steps) {
    //function to rate the memory of the player
    if (steps <= 12) {
    	star = 3;
    } else if (steps >= 13 && steps <= 16) {
        $(".stars li").eq(2).remove();
        star = 2;
    } else if (steps >= 17) {
        $(".stars li").eq(1).remove();
        star = 1;
    }
}

function timerCheck(step) {
	if(step === 1) {
		timer();
	}
}

function masterMemoryFlip(tile, value) {
    //master function for executing all other function
    //main function to run the game
    if (canFlipCard(tile)) {
        display(tile);
        if (noCardFlip()) {
            setFlip(tile);
            timerCheck(step);
            console.log("Card 1");
        } else if (oneCardFlip()) {
            setFlip(tile);
            console.log("Card 2");
            if (isThereIsAMatch()) {
                matchCards(tile);
                console.log("Cards are same, Wow matched");
                if (isGameOver()) {
                    gameOver();
                    console.log("Game over");
                }
            } else {
                cardsDoNotMatch();
                console.log("Cards are different, Flipping back");
            }
        }
    }
}
