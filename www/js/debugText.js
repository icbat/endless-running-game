var debugListeners = [];
var debugText = [];
var runnerText;
var onTouchText;

var enableDebugging = function(debugIsVisible) {
    // Remove potentially stale references
    var i;
    for (i = 0; i < debugListeners.length; ++i) {
        var listener = debugListeners[i];
        listener.detach();
    }
    debugListeners = [];
    var text;
    for (i = 0; i < debugText.length; ++i) {
        text = debugText[i];
        text.destroy();
    }
    debugText = [];

    // Make them all
    var debugStyle = {
        fill: colorPalette.dark,
        fontSize: 16,
        boundsAlignH: "left",
        boundsAlignV: "top"
    };

    onTouchText = game.add.text(0, 0, "touch down: " + false, debugStyle);
    debugText.push(onTouchText);
    game.input.onDown.add(function() {
        if (debugText.length > 0) {
            onTouchText.text = "touch down: " + true;
        }
    });
    game.input.onUp.add(function() {
        if (debugText.length > 0) {
            onTouchText.text = "touch down: " + false;
        }
    });
    debugText.push(game.add.text(0, 16, "world " + game.world.height + "h x " + game.world.width + "w", debugStyle));
    runnerText = game.add.text(0, 32, "player height: " + (constants.groundHeight - objects.runner.findLowestPoint()), debugStyle);
    debugText.push(runnerText);

    // Set visibility
    for (i = 0; i < debugText.length; ++i) {
        text = debugText[i];
        text.visible = debugIsVisible;
    }
};

var updateDebugTextForRunner = function(runner, shouldUpdate) {
    if (shouldUpdate) {
        runnerText.text = "player height: " + (constants.groundHeight - runner.findLowestPoint());
    }
};