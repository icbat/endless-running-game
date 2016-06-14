var state_waiting = function(game) {
    return {
        create: function(game) {
            this.firstTouchY = -1;
            this.dragY = -1;

            game.input.onDown.add(this.onDown, this);
            game.input.onUp.add(this.onUp, this);

            var textStyle = {
                fill: colorPalette.text,
                boundsAlignH: "center",
                boundsAlignV: "middle"
            };
            var text = game.add.text(game.world.centerX, game.world.centerY, "(Placeholder)\nSwipe to Charge jump to \nMAX level", textStyle);
            text.anchor.set(0.5);
            text.setShadow(1, 1, colorPalette.textShadow);
            this.graphics = game.add.graphics(0, 0);
            objects.chargeBar.draw(this.graphics);
            objects.runner.draw(this.graphics);
            objects.ground.draw(this.graphics);
        },

        render: function() {
            objects.chargeBar.draw(this.graphics);
            drawDebugText(constants.debugMode);
        },

        update: function() {
            if (this.firstTouchY !== -1) {
                this.dragY = this.firstTouchY - game.input.activePointer.worldY;
                objects.chargeBar.update(percentOf(this.dragY, game.world.height));
            } else {
                objects.chargeBar.update(0);
            }
        },

        onDown: function(pointer, mouseEvent) {
            if (mouseEvent.identifier === 0) {
                if (this.firstTouchY === -1) {
                    if (pointer.worldX < constants.runnerSize && pointer.worldY < constants.runnerSize) {
                        constants.debugMode = !constants.debugMode;
                        game.debug.reset();
                    } else {
                        this.firstTouchY = pointer.worldY;
                    }
                }
            }
        },

        onUp: function(pointer, mouseEvent) {
            // pointer.identifier === 0 Prevents 'mouse leaving the game world' from firing this, too
            if (mouseEvent.identifier === 0 && pointer.identifier === 0) {
                var charge = chargeLevel(percentOf(this.dragY, game.world.height));
                console.log(charge);
                if (charge === 3) {
                    this.firstTouchY = -1;
                    this.dragY = -1;
                    game.state.start('running');
                }
            }
        }
    };
};
