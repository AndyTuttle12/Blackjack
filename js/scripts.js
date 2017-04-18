// ----------GLOBALS----------
var theDeck = createDeck();
var playersHand = [];
var dealersHand = [];
var topOfDeck = 4;
var hiddenDealerCard;
var handSize = 6;
var setHTML = '';
var currentBet = 0;
var betChips = [];
var bankTotal = 1000;
// ---------------------------

$(document).ready(function(){
	

	buildDivs();

	

	$('.activeChip').draggable({
		containment: '#the-table',
		cursor: 'pointer',
		cursorAt: { top: 18, left: 29 },
		helper: "clone",
		revert: true

	});

	$('#dropArea').droppable({
		tolerance: 'touch',
		drop: droppedChip
	});

	


	// console.log("freshDeck on page - "+freshDeck);
	$('.deal-button').attr('disabled', 'disabled');
	$('.hit-button').attr('disabled', 'disabled');
	$('.stand-button').attr('disabled', 'disabled');
	$('.double-button').attr('disabled', 'disabled');
	$('.split-button').hide();
	$('.reset-button').hide();
	$('.bet-amount').hide();
	// Major Buttons for the game
	$('.deal-button').click(function(){
		bankTotal -= currentBet;
		$('#bankAmount').html(bankTotal);
		console.log(bankTotal)
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
		checkBlackJack();

		$('.deal-button').attr('disabled', 'disabled');
		$('.hit-button').removeAttr('disabled', 'disabled');
		$('.stand-button').removeAttr('disabled', 'disabled');
		$('.double-button').removeAttr('disabled', 'disabled');
	});

	$('.hit-button').click(function(){
		$('.dealt1').removeClass('dealt1');
		$('.dealt2').removeClass('dealt2');
		$('.dDealt1').removeClass('dDealt1');
		$('.dDealt2').removeClass('dDealt2');

		if(calculateTotal(playersHand,'player') <= 21){
			// add a card to js and document; update total
			$('.double-button').attr('disabled', 'disabled');
			playersHand.push(theDeck.shift());
			$('.player-cards .card-3').addClass('dealt3');
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
			$('.dealer-cards .card-3').addClass('dealerDealt3');
			var slotForNewCard = dealersHand.length;
			placeCard('dealer',slotForNewCard,dealersHand[dealersHand.length-1]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		$('.stand-button').attr('disabled', 'disabled');
		$('.hit-button').attr('disabled', 'disabled');
		$('.double-button').attr('disabled', 'disabled');
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

function droppedChip(event, ui){
	var currentChip = ui.draggable;
	// console.log(event)
	// console.log(ui)
	// var currentChipX = ui.position.left;
	// var currentChipY = ui.position.top;
	// ui.clone.draggable( 'option', 'revert', false );
	
	ui.draggable.draggable({revert:false,opacity:1,helper:'original',margin:0});
	
	calculateBet();
	$(this).append($(ui.draggable).draggable({revert:true,containment:'#the-table',cursor:'pointer',cursorAt:{ top: 18, left: 29 },position:{ top:50, left:112 }}));
	$('.deal-button').removeAttr('disabled', 'disabled');
	$('.bet-amount').show();
	
	ui.helper.draggable({revert:false,opacity:1});
	
	// ui.helper.draggable('instance');
}

function calculateBet(){
	var selectedChip = $('.activeChip');
	for(let i = 0; i < selectedChip.length; i++){
		if(selectedChip[i].id === ''){
			// console.log(selectedChip[i])
			// console.log(selectedChip[i].className)
			if(selectedChip[i].className=='activeChip fiveChip ui-draggable ui-draggable-handle ui-draggable-dragging'){
				// console.log('5')
				// currentBet += 5;
				betChips.push(5);
				break;
			}
			else if(selectedChip[i].className=='activeChip tenChip ui-draggable ui-draggable-handle ui-draggable-dragging'){
				// console.log('10')
				// currentBet += 10;
				betChips.push(10);
				break;
			}
			else if(selectedChip[i].className=='activeChip twentyFiveChip ui-draggable ui-draggable-handle ui-draggable-dragging'){
				// console.log('25')
				// currentBet += 25;
				betChips.push(25);
				break;
			}
			else if(selectedChip[i].className=='activeChip hundredChip ui-draggable ui-draggable-handle ui-draggable-dragging'){
				// console.log('100')
				// currentBet += 100;
				betChips.push(100);
				break;
			}
		}
	}
	// console.log(currentBet)
	// console.log(betChips)	
	currentBet = betChips.reduce(betSum);
	// console.log(currentBet)
	$('#bet-amount').html('$'+currentBet);
}

function betSum(runningTotal, number) {
    return runningTotal + number;
}


function checkWin(){
	playerTotal = calculateTotal(playersHand,'player');
	dealerTotal = calculateTotal(dealersHand,'dealer');

	if(playerTotal > 21){
		$("#playerBusts").modal("show");
		// Player busted.
	}else if(dealerTotal > 21){
		$("#dealerBusts").modal("show");
		bankTotal += (currentBet * 2);
		$('#bankAmount').html(bankTotal);
		// Dealer busted; player won.
	}else{
		if(playerTotal > dealerTotal){
			$("#playerWins").modal("show");
			bankTotal += (currentBet * 2);
			$('#bankAmount').html(bankTotal);
			// player won.
		}else if(dealerTotal > playerTotal){
			$("#dealerWins").modal("show");
			// Dealer won.
		}else if(playerTotal == 21 && playerTotal > dealerTotal){
			$("#playerWins").modal("show");
			bankTotal += (currentBet + ((currentBet * 3)/2));
			$('#bankAmount').html(bankTotal);
			//player won with BlackJack
		}else{
			$("#pushTie").modal("show");
			// push...no winner...default to dealer win.
		}
	}
	$('.reset-button').show();
}

function checkBlackJack(){
	playerTotal = calculateTotal(playersHand,'player');
	dealerTotal = calculateTotal(dealersHand,'dealer');
	if(playerTotal == 21){
		checkWin();

		$('#playerBlackJack').modal("show");
		$('.reset-button').show();
		$('.deal-button').attr('disabled', 'disabled');
		$('.hit-button').attr('disabled', 'disabled');
		$('.stand-button').attr('disabled', 'disabled');
		$('.double-button').attr('disabled', 'disabled');

	}
}


function reset(){
	
	// reset hands and deck...and the DOM
	theDeck = createDeck();
	playersHand = [];
	dealersHand = [];
	$('.card').html('');
	
	// console.log(freshDeck);
	$('.dealt1').removeClass('dealt1');
	$('.dealt2').removeClass('dealt2');
	$('.dDealt1').removeClass('dDealt1');
	$('.dDealt2').removeClass('dDealt2');
	$('.bet-amount').hide();

	// console.log(theDeck);
	playerTotal = calculateTotal(playersHand,'player');
	dealerTotal = calculateTotal(dealersHand,'dealer');
	$('.deal-button').removeAttr('disabled', 'disabled');
	buildDivs();
}

function createDeck(){
	var newDeck = [];
	var suits = ['h','s','d','c'];
	// suits.map(()=>{}).map()
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
	var classSelector = '.' + who + '-cards .card-' + where + ' .card-container .card-front';
	var classSelector2 = '.' + who + '-cards .card-' + where + ' .card-container';
	// example = .dealer-cards .card-1 .card-container .card-front
	$(classSelector).html('<img src="images/' + whatCard + '.png">');
	if(classSelector == '.dealer-cards .card-2 .card-container .card-front'){
		$(classSelector).html('<img src="images/deck.png">');
		$('.dealer-total-number').hide();
		$('.deal-button').attr('disabled', 'disabled');
	}
	$(classSelector2).toggleClass('flip');
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


function buildDivs(){
	for(let i = 1; i <= handSize; i++){
		setHTML += '<div class="col-sm-2 card card-' + i + '">';
			setHTML += '<div class="card-container">';
				setHTML += '<div class="card-front"></div>';
				setHTML += '<div class="card-back"></div>';
			setHTML += '</div>';
		setHTML += '</div>';
	}
	$('.dealer-cards').html(setHTML);
	$('.player-cards').html(setHTML);
}



$('#myModal').on('show.bs.modal', function (e) {
  if (!data) return e.preventDefault() // stops modal from being shown
})

