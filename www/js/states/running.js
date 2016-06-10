var state_running = function(game) {
    return {
        create: function(game) {
            game.input.onDown.add(this.onDown, this);
            game.input.onUp.add(this.onUp, this);
            game.score = 0;

            var textStyle = {
                fill: colorPalette.text,
                boundsAlignH: "center",
                boundsAlignV: "middle"
            };
            objects.scoreDisplay = game.add.text(game.world.centerX - constants.tileSize, objects.runner.findHighestPoint() + (constants.tileSize / 2), "0", textStyle);
            objects.scoreDisplay.anchor.set(0.5);
            objects.scoreDisplay.setShadow(1, 1, colorPalette.textShadow);
            objects.obstacles = [];
            this.addObstacleToBack();
            this.graphics = game.add.graphics(0, 0);
            this.firstTouchY = -1;
        },

        update: function(game) {
            objects.runner.applyGravity();

            var obstacleIndex;
            for (obstacleIndex = 0; obstacleIndex < objects.obstacles.length; ++obstacleIndex) {
                var obstacle = objects.obstacles[obstacleIndex];
                obstacle.movePolygonBy(constants.hspeed);

                if (objects.runner.intersects(obstacle)) {
                    // Game over
                    game.state.start('waiting');
                }

                if (this.runnerHasPassedObstacle(obstacle, objects.runner)) {
                    this.scorePoint(obstacle);
                }

            }
            if (objects.obstacles[0].findRightmostPoint() < 0) {
                objects.obstacles.shift();
            }
            if (objects.obstacles[objects.obstacles.length - 1].findRightmostPoint() < game.world.width) {
                this.addObstacleToBack();
            }

        },
        addObstacleToBack: function() {
            var obstacle = objects.getRandomObstacle();
            objects.obstacles.push(obstacle);
            var newX = Math.max(game.world.width + obstacle.minimumSpaceBehind);
            newX += Math.random() * constants.tileSize;
            if (Math.random() < 0.3) {
                // Randomly add a big-ish gap
                newX += constants.tileSize * 2;
            }
            obstacle.moveToX(newX);
            obstacle.hasScored = false;
        },

        runnerHasPassedObstacle: function(obstacle, runner) {
            return !obstacle.hasScored && Math.round(obstacle.findRightmostPoint()) < runner.findLeftmostPoint() - 1;
        },

        scorePoint: function(obstacle) {
            ++game.score;
            objects.scoreDisplay.text = (game.score);
            obstacle.hasScored = true;
        },

        render: function() {
            this.graphics.clear();

            var obstacleIndex;
            for (obstacleIndex = 0; obstacleIndex < objects.obstacles.length; ++obstacleIndex) {
                var obstacle = objects.obstacles[obstacleIndex];
                obstacle.draw(this.graphics);
            }
            objects.runner.draw(this.graphics);
            objects.ground.draw(this.graphics);
            drawDebugText(constants.debugMode);
        },

        onDown: function(pointer, mouseEvent) {
            if (mouseEvent.identifier === 0) {
                if (this.firstTouchY === -1) {
                    this.firstTouchY = pointer.worldY;
                }
            }
        },

        onUp: function(pointer, mouseEvent) {
            // pointer.identifier === 0 Prevents 'mouse leaving the game world' from firing this, too
            if (mouseEvent.identifier === 0 && pointer.identifier === 0) {

                if (objects.runner.canJump()) {
                    var dragY = this.firstTouchY - pointer.worldY;
                    this.firstTouchY = -1;
                    objects.runner.jump(dragY);
                }
            }
        }
    };
};
