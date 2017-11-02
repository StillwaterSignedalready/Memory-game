
 /* control data--------------------------- */
 var deck = document.getElementsByClassName('deck')[0],
     opened = new Array(),
 	 moves = document.querySelector('.score-panel span.moves'),
 	 resBtn = document.querySelector('.score-panel .restart .fa-repeat'),
     cover = document.querySelector('div.cover'),
     stars =  document.querySelector('ul.stars'),
     timeCounter = document.querySelector('span.time'),
     starsAmount = 3,
     starCounter = 0,
 	 openCounter = 0,
     toMatch,
     currentGame,
     wrongTimes = 0;
 var cards = deck.getElementsByTagName('li'),
     playAgain = cover.getElementsByTagName('button')[0],
     winMsg = cover.getElementsByTagName('p')[0];
 var iGroup = Array.prototype.map.call(cards, (card) => {
          	return card.querySelector('i');
          });
 /* --------------------------- control data*/

 /* animation---------------------------  */
 function toMatchAnima(card){
 	var className = card.getAttribute('class');
 	card.setAttribute('class', className + ' animated flip');
 }

 function matchAnima(card){
 	var className = card.getAttribute('class');
 	card.setAttribute('class', className + ' animated rubberBand');
 }

 function disMatchAnima(card){
 	card.setAttribute('class','card dismatch animated wobble');
 }
 /* ---------------------------  animation*/ 

/* core management of game---------------------------   */
 function judgeVictory(){
 	if(openCounter >= 16){
 		var sentence = '';
 		switch(starsAmount){
 			case 1:
 				sentence = 'well, that\'s kinda awkward.';
 				break;
 			case 2:
 				sentence = 'maybe you can do better last time.';
 				break;
 			case 3:
 				sentence = 'you are immortal!';
 				break;
 		}
 		cover.style.display = 'block';
 		winMsg.textContent = 'With ' + moves.textContent + ' steps in ' + timeCounter.textContent +' seconds, your level is '+ starsAmount + ' stars, ' + sentence ;
 		restart();
 	}
 }

 function matchTwoCards(card1, card2){
 	if(card1 != card2 && isNotFixed(card1) && isNotFixed(card2)){
	 	var i1 = card1.querySelector('i'),
	 		i2 = card2.querySelector('i'),
	 		className1,
	 		className2;
	 	if(i1.getAttribute('class') == i2.getAttribute('class')){
	 		// match success, open both two cards
	 		card1.setAttribute('class','card open show');
	 		card2.setAttribute('class','card open show');
	 		matchAnima(card1);
	 		matchAnima(card2);
	 		// match complete, do calculation
	 		openCounter += 2;
	 		toMatch = null;
	 		judgeVictory();
	 	}else{
	 		// match fail, shut both two cards
	 		disMatchAnima(card1);
	 		disMatchAnima(card2);
	 		// wait animation complete, then shut down cards
	 		setTimeout(function(){
		 		card1.setAttribute('class', 'card');
		 		card2.setAttribute('class', 'card');
	 		}, 700);
	 		toMatch = null;
	 		// reduce stars
	 		if(wrongTimes >= 28 && starsAmount > 1){
	 			var faStar = stars.querySelectorAll('.fa-star');
	 			faStar[faStar.length - 1].setAttribute('class', 'fa fa-star-o');
	 			starsAmount --;
	 			wrongTimes = 0;
	 			starCounter ++;
	 		}
	 	}
	 	moves.textContent++;
 	}
 }

 function isNotFixed(card){
 	var val = (/open show/).exec(card.getAttribute('class'));
 	return !val;
 }

 function liHandler(event){
 	var target = event.target;
 	if(target.nodeName == 'LI'){
		wrongTimes ++;
 		// test if target is open show
 		if(toMatch){
 			// match toMatch & target
 			matchTwoCards(toMatch, target);
 		}else{
 			// nothing to match(and target is not fixed), target needs some card to match, let's put it aside
 			if(isNotFixed(target)){
		 		var className = target.getAttribute('class') + ' match';
		 		target.setAttribute('class',className);
		 		toMatch = target;
		 		toMatchAnima(target);
		 		moves.textContent++;
 			}
 		}
 		
 	}
 }
/* ---------------------------core method of game */

/* Game constructor--------------------------- */
 
function Game(){
	// shuffle icons
	this.icons = arguments.callee.prototype.shuffle(arguments.callee.prototype.icons);
	// write shuffled messages into cards
	for(let i = 0, len = this.icons.length; i < len; i ++){
		cards[i].setAttribute('class', 'card');
		iGroup[i].setAttribute('class', 'fa ' + this.icons[i]);
	}
}

Game.prototype.icons = ['fa-diamond', 'fa-diamond','fa-paper-plane-o', 'fa-paper-plane-o',
'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-anchor', 'fa-anchor', 'fa-leaf', 'fa-leaf',
'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

Game.prototype.shuffle = function(array) {
    var currentIndex = array.length,
        temporaryValue, 
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    console.log(array);
    return array;
}

function restart(){
	moves.textContent = 0;
	openCounter = 0;
	toMatch = null;
	starsAmount = 3;
	starCounter = 0;
	timeCounter.textContent = 0;
	stars.getElementsByTagName('i')[2].setAttribute('class', 'fa fa-star');
	stars.getElementsByTagName('i')[1].setAttribute('class', 'fa fa-star');
	currentGame = new Game();
}
/* ---------------------------Game constructor */

/* init--------------------------- */ 
 deck.addEventListener('click',liHandler);
 resBtn.addEventListener('click', restart);
 playAgain.addEventListener('click', function(){
 	cover.style.display = 'none';
 	restart();
 });
 setInterval(function(){
 	timeCounter.textContent++;
 }, 1000);

 restart();