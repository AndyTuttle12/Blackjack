$(document).ready(function(){

	// ----------GLOBALS----------

	var theDeck = [];
	var playersHand = [];
	var dealersHand = [];
	var dealerTotal = 0;
	var playerTotal = 0;

	// ---------------------------

	createDeck();

	$('.deal-button').click(function(){
		// console.log(this);
		shuffleDeck();
		// Add card to playersHand
		playersHand.push(theDeck[0]);
		// Add to dealer as well
		dealersHand.push(theDeck[1]);
		// to player
		playersHand.push(theDeck[2]);
		// to dealer (face down)
		dealersHand.push(theDeck[3]);
		// put the first card in the player's hand
		placeCard(playersHand[0], 'player', 'one');
		placeCard(playersHand[1], 'player', 'two');
		// put the cards in the dealer's hand
		placeCard(dealersHand[0], 'dealer', 'one');
		placeCard(dealersHand[1], 'dealer', 'two');

		calculateTotal('player',playersHand);
		calculateTotal('dealer',dealersHand);
	})

	$('.hit-button').click(function(){
		// console.log(this);
	})
	$('.stand-button').click(function(){
		// console.log(this);
	})
	$('.double-button').click(function(){
		// console.log(this);
	})

	function createDeck(){
		// fill with -52 cards -4 suits -1-13 (1-10,J,Q,K)
		var suits = ['h','s','d','c'];
		// loop through all four suits
		for (let s = 0; s < suits.length; s++){
			// loop through all 13 cards
			for(let c = 1; c <= 13; c++){
				theDeck.push(c + suits[s]);

			}
		}
		
	}

	function shuffleDeck(){
		// randomize the array
		for(let i = 0; i < 9001; i++){
			var card1ToSwitch = Math.floor(Math.random() * theDeck.length);
			var card2ToSwitch = Math.floor(Math.random() * theDeck.length);
			var temp = theDeck[card1ToSwitch];
			theDeck[card1ToSwitch] = theDeck[card2ToSwitch];
			theDeck[card2ToSwitch] = temp;
		}
	}

	function placeCard(whatCard, who, whichSlot){
		var classToTarget = '.' + who + '-cards .card-' + whichSlot;
		// console.log(classToTarget);
		$(classToTarget).html('<img src="images/' + whatCard + '.png">');
		if((classToTarget == '.dealer-cards .card-'+ whichSlot) && (whichSlot == 'two')){
			$(classToTarget).html('<img src="images/deck.png">');
			$('.dealer-total-number').hide();
			$('.deal-button').attr('disabled', 'disabled');
		}
	}

	function calculateTotal(who, theirHand){
		var cardValue = 0;
		var total = 0;
		for(let i = 0; i < theirHand.length; i++){
			cardValue = Number(theirHand[i].slice(0, -1));
			// console.log(cardValue);
			if(cardValue > 10){
				cardValue = 10;
			}
			if(cardValue === 1 && total <= 10){
				cardValue = 11;
			}
			total += cardValue;

		}
		var classToTarget = '.'+who+'-total-number';
		$(classToTarget).text(total);
	}console.log(playerTotal);
});

