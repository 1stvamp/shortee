/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */
window.onload = function () {
    var UI = new UbuntuUI();
    UI.init();

    // Simple button listeners
    UI.button('new-game').click(switchPage(UI, 'new-game-page'));

    // Add an event listener that is pending on the initialization
    //  of the platform layer API, if it is being used.
    document.addEventListener("deviceready", function() {
        if (console && console.log)
            console.log('Platform layer API ready');
    }, false);
};

function switchPage(ui, pageId) {
    return function() {
	ui.pagestack.push(pageId);
    };
}
