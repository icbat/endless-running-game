var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

var TILE_SIZE = 64;
var maxJumpHeight = 200;
var runner, ground;
var colors = {
  green: '#2ecc71',
  lightGrey: '#ddd',
  middleGrey: '#888',
  darkGrey: '#333'
};

function preload() {
  console.log('preload');
}
function create() {
  console.log('create');
  game.stage.backgroundColor = colors.lightGrey;

  runner = new Phaser.Rectangle(game.world.centerX - TILE_SIZE / 2, game.world.height - TILE_SIZE * 2, TILE_SIZE, TILE_SIZE);
  ground = new Phaser.Rectangle(0, game.world.height - TILE_SIZE, game.world.width, TILE_SIZE);

  game.input.onDown.add(onDown, this);
  game.input.onUp.add(onUp, this);
}

function update() {
}

function render() {
  game.debug.geom(runner, colors.green);
  game.debug.geom(ground, colors.darkGrey);
}

function onDown(pointer, mouseEvent) {
  if(mouseEvent.identifier === 0) {
    console.log('down');
    runner.y -= maxJumpHeight;
    console.log(runner.y);
  }
}

function onUp(pointer, mouseEvent) {
  // Prevents 'mouse leaving the game world' from firing this, too
  if(mouseEvent.identifier === 0 && pointer.identifier === 0) {
    console.log('up', pointer);
    runner.y += maxJumpHeight;
    console.log(runner.y);
  }
}
