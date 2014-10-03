/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var currentGame = localStorage.getItem("currentGame");
    if (currentGame) {
        currentGame = JSON.parse(currentGame);
    } else {
        currentGame = {};
    }
    initUI(currentGame);
};

function initUI(currentGame) {
    var UI = new UbuntuUI();
    UI.init();

    var gameTypes = [
	{
	    name: 'Munchkin',
	    minLevel: 1,
	    maxLevel: 10,
	    winAtMax: true
	},
	{
	    name: 'Epic Munchkin',
	    minLevel: 1,
	    maxLevel: 20,
	    winAtMax: true
	},
	{
	    name: 'Munchkin Quest',
	    minLevel: 1,
	    maxLevel: 10,
	    winAtMax: false
	}
    ];

    // Fill UI with game types
    var gameTypesList = document.getElementById('game-type-list');
    for(var i in gameTypes) {
	var type = gameTypes[i];
	var typeEl = document.createElement('li');
	var typePara = document.createElement('p');
	typeEl.setAttribute('data-value', i);
	typePara.innerHTML = type.name;
	typeEl.appendChild(typePara);
	gameTypesList.appendChild(typeEl);
    }

    // Simple button listeners
    UI.button('new-game').click(getPageSwitcher(UI, 'new-game-page'));
    UI.button('start-game').click(getPageSwitcher(UI, 'counter-page'));

    // Options
    var gameTypeOpt = UI.optionselector('game-type', false, false);
    var playersNumOpt = UI.optionselector('players-num', false, false);

    UI.button('start-game').click(function() {
	var gameType = gameTypes[gameTypeOpt.currentIndex];
	var playersNum = playersNumOpt.currentIndex + 2;
	var countersEl = document.getElementById('counters');

	// Clear the div contents each time
	countersEl.innerHTML = '';

	// Keep track of the numbers
	var counters = {};

	currentGame.gameType = gameType;
	currentGame.playersNum = playersNum;
	currentGame.counters = counters;
	currentGame.over = false;
	saveGame(currentGame);

	for(var i = 0; i < playersNum; i++) {
	    var counterContainerEl = document.createElement('p');
	    counterContainerEl.innerHTML = 'Player ' + (i + 1) + ': ';

	    var counterEl = document.createElement('span');
	    counterContainerEl.appendChild(counterEl);
	    countersEl.appendChild(counterContainerEl);

	    counters[i] = 1;
	    counterEl.innerHTML = 1;

	    var button1 = document.createElement('button');
	    button1.innerHTML = '+';
	    button1.setAttribute('data-role', 'button');
	    button1.setAttribute('id', 'counter-' + i + '-up');
	    button1.setAttribute('class', 'right-button');
	    counterContainerEl.appendChild(button1);
	    UI.button('counter-' + i + '-up').click(function(el, i) {
		return function() {
		    if (counters[i] < gameType.maxLevel) {
			counters[i]++;
			el.innerHTML = counters[i];
		    }
		    if (gameType.winAtMax && counters[i] >= gameType.maxLevel) {
			hotdog(UI, i + 1);
			currentGame.over = true;
		    }
            saveGame(currentGame);
		};
	    }(counterEl, i));

	    var button2 = document.createElement('button');
	    button2.innerHTML = '-';
	    button2.setAttribute('data-role', 'button');
	    button2.setAttribute('id', 'counter-' + i + '-down');
	    button2.setAttribute('class', 'left-button');
	    counterContainerEl.appendChild(button2);

	    var clearEl = document.createElement('div');
	    clearEl.setAttribute('class', 'clear');
	    counterContainerEl.appendChild(clearEl);

	    UI.button('counter-' + i + '-down').click(function(el, i) {
		return function() {
		    if (counters[i] > gameType.minLevel) {
			counters[i]--;
			el.innerHTML = counters[i];
		    }
		    saveGame(currentGame);
		};
	    }(counterEl, i));
	}
    });

    // Add an event listener that is pending on the initialization
    //  of the platform layer API, if it is being used.
    document.addEventListener("deviceready", function() {
        if (console && console.log) {
            console.log('Platform layer API ready');
	}
    }, false);
}

function getPageSwitcher(ui, pageId) {
    return function() {
	ui.pagestack.push(pageId);
    };
}

function saveGame(game) {
    localStorage.setItem("currentGame", JSON.stringify(game));
}

/*
                              .-.
 (___________________________()6 `-,
 (   ______________________   /''"`
 //\\                      //\\
 "" ""                     "" ""
*/
function hotdog(ui, player) { // we have a weiner
    var winnerEl = document.getElementById('winning-player');
    winnerEl.innerHTML = 'Player ' + player + ' is the winner!';
    getPageSwitcher(ui, 'game-over-page')();
}
