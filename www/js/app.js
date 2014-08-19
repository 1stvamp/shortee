// Is there a current implementation of IndexedDB?
var requireShim = typeof window.IDBVersionChangeEvent === 'undefined';

// Is WebSQL available?
var supportsWebSql = typeof window.openDatabase != 'undefined';

if (requireShim && supportsWebSql){
    window.shimIndexedDB.__useShim(); // Use the Polyfills 
}

/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var dbrequest = window.indexedDB.open("ShorteeDB", 2);
    dbrequest.onupgradeneeded = function(event) {
	var db = event.target.result;
	db.createObjectStore("games", { keyPath: "id" });
    }
    dbrequest.onsuccess = function(event) {
	var db = event.target.result;
	var transaction = db.transaction(["games"], "read");
	var objectStore = transaction.objectStore("games");
	var request = objectStore.get("current");
	request.onsuccess = function(event) {
	    initUI(db, event.target.result || {});
	};
	request.onerror = function() {
	    initUI(db, {});
	};
    };

};

function initUI(db, currentGame) {
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
	saveGame(db, currentGame);

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
		    saveGame(db, currentGame);
		};
	    }(counterEl, i));

	    var button2 = document.createElement('button');
	    button2.innerHTML = '-';
	    button2.setAttribute('data-role', 'button');
	    button2.setAttribute('id', 'counter-' + i + '-down');
	    counterContainerEl.appendChild(button2);
	    UI.button('counter-' + i + '-down').click(function(el, i) {
		return function() {
		    if (counters[i] > gameType.minLevel) {
			counters[i]--;
			el.innerHTML = counters[i];
		    }
		    saveGame(db, currentGame);
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

function saveGame(db, game) {
    // We always set this as we only ever have one game
    game.id = "current";
    var transaction = db.transaction(["games"], "write");
    var objectStore = transaction.objectStore("games");
    var request = objectStore.put(game);
    request.onerror = function(event) {
        if (console && console.log) {
            console.log('Failed to save current game');
	    console.log(event);
	}
    };
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
