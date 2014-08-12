/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var UI = new UbuntuUI();
    UI.init();

    var gameTypes = [
	{
	    name: 'Munchkin',
	    maxLevel: 10,
	    winAtMax: true
	},
	{
	    name: 'Epic Munchkin',
	    maxLevel: 20,
	    winAtMax: true
	},
	{
	    name: 'Munchkin Quest',
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

    // Options
    var gameTypeOpt = UI.optionselector('game-type', false, false);

    UI.button('start-game').click(function() {});

    // Add an event listener that is pending on the initialization
    //  of the platform layer API, if it is being used.
    document.addEventListener("deviceready", function() {
        if (console && console.log)
            console.log('Platform layer API ready');
    }, false);
};

function getPageSwitcher(ui, pageId) {
    return function() {
	ui.pagestack.push(pageId);
    };
}
