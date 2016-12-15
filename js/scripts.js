// ----------GLOBALS----------
var theDeck = createDeck();
var playersHand = [];
var dealersHand = [];
var topOfDeck = 4;
var hiddenDealerCard;
// ---------------------------

$(document).ready(function(){

	// console.log("freshDeck on page - "+freshDeck);
	$('.hit-button').attr('disabled', 'disabled');
	$('.stand-button').attr('disabled', 'disabled');
	$('.double-button').attr('disabled', 'disabled');
	$('.split-button').hide();
	$('.reset-button').hide();
	// Major Buttons for the game
	$('.deal-button').click(function(){
		shuffleDeck(); // now shuffled!
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		// console.log("freshDeck after shifts - ", freshDeck);
		$('.player-cards .card-1').addClass('dealt1');
		placeCard('player',1,playersHand[0]);
		setTimeout(function(){
			$('.player-cards .card-2').addClass('dealt2');
			placeCard('player',2,playersHand[1]);
		}, 800);
		setTimeout(function(){
		$('.dealer-cards .card-1').addClass('dealerDealt1');
		placeCard('dealer',1,dealersHand[0]);
		}, 400);
		setTimeout(function(){
			$('.dealer-cards .card-2').addClass('dealerDealt2');
			placeCard('dealer',2,dealersHand[1]);
		}, 1200);


		
		hiddenDealerCard = dealersHand[1];
		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');

		$('.deal-button').attr('disabled', 'disabled');
		$('.hit-button').removeAttr('disabled', 'disabled');
		$('.stand-button').removeAttr('disabled', 'disabled');
		$('.double-button').removeAttr('disabled', 'disabled');
	});

	$('.hit-button').click(function(){
		if(calculateTotal(playersHand,'player') <= 21){
			// add a card to js and document; update total
			$('.double-button').attr('disabled', 'disabled');
			playersHand.push(theDeck.shift());
			var slotForNewCard = playersHand.length;
			placeCard('player',slotForNewCard,playersHand[playersHand.length-1]);
			calculateTotal(playersHand, 'player');
		}
	});

	$('.stand-button').click(function(){
		var dealerTotal = calculateTotal(dealersHand,'dealer');
		$('.dealer-cards .card-2').html('<img src="images/' + hiddenDealerCard + '.png">');
		while(dealerTotal < 17){
			dealersHand.push(theDeck.shift());
			var slotForNewCard = dealersHand.length;
			placeCard('dealer',slotForNewCard,dealersHand[dealersHand.length-1]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		$('.stand-button').attr('disabled', 'disabled');
		$('.hit-button').attr('disabled', 'disabled');
		$('.dealer-total-number').show();

		checkWin();
	});

	$('.double-button').click(function(){

	});

	$('.split-button').click(function(){

	});

	$('.reset-button').click(function(){
		reset();
		$('.reset-button').hide();
	});


});

function checkWin(){
	playerTotal = calculateTotal(playersHand,'player');
	dealerTotal = calculateTotal(dealersHand,'dealer');

	if(playerTotal > 21){
		// Player busted.
	}else if(dealerTotal > 21){
		// Dealer busted.
	}else{
		if(playerTotal > dealerTotal){
			// player won.
		}else if(dealerTotal > playerTotal){
			// Dealer won.
		}else{
			// push...no winner...default to dealer win.
		}
	}
	$('.reset-button').show();
}


function reset(){
	// reset hands and deck...and the DOM
	theDeck = createDeck();
	playersHand = [];
	dealersHand = [];
	$('.card').html('');
	// console.log(freshDeck);


	// console.log(theDeck);
	playerTotal = calculateTotal(playersHand,'player');
	dealerTotal = calculateTotal(dealersHand,'dealer');
	$('.deal-button').removeAttr('disabled', 'disabled');
}

function createDeck(){
	var newDeck = [];
	var suits = ['h','s','d','c'];
	for(let s = 0; s < suits.length; s++){
		for(let c = 1; c <= 13; c++){
			newDeck.push(c+suits[s]);
		}
	}
	return newDeck;
}

function shuffleDeck(){
	for(let i = 0; i < 9001; i++){
		var random1 = Math.floor(Math.random()*theDeck.length);
		var random2 = Math.floor(Math.random()*theDeck.length);
		var temp = theDeck[random1];
		theDeck[random1] = theDeck[random2];
		theDeck[random2] = temp;
	}
	// console.log(theDeck);
}

function placeCard(who, where, whatCard){
	var classSelector = '.' + who + '-cards .card-' + where;
	$(classSelector).html('<img src="images/' + whatCard + '.png">');
	if(classSelector == '.dealer-cards .card-2'){
		$(classSelector).html('<img src="images/deck.png">');

		$('.dealer-total-number').hide();
		$('.deal-button').attr('disabled', 'disabled');
	}
}

function calculateTotal(hand, who){
	var total = 0; //running total
	var cardValue = 0; //temp value of card
	var hasAce = false; //ace counter
	for(let i = 0; i < hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1));
		if(cardValue > 10){
			cardValue = 10;
		}
		if(cardValue == 1){
			hasAce = true;
		}
		if(cardValue === 1 && total <= 10){
			cardValue = 11;
		}
		total += cardValue;

		if((total > 21)&&(hasAce)){
            total -= 10;
            hasAce = false;
        }
	}
	var classSelector = '.' + who + '-total-number';
	$(classSelector).text(total);
	return total;
}

$('#myModal').on('show.bs.modal', function (e) {
  if (!data) return e.preventDefault() // stops modal from being shown
})

// function arrangeDeck(){
// 	// var deckArray = $('.deckOfCards').hasClass('.deck-card');
// 	var cardLeft = 0;
// 	var cardTop = 52;

// 	for(let i = 1; i <= 52; i++){
// 		$('.deck-card' + i).css({'left':cardLeft + 'px;','top':cardTop + 'px;'});
// 		cardLeft+=.75;
// 		cardTop-=1.25;
// 		console.log("test");
// 	}
// }
// arrangeDeck();

