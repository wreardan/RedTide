var GAME_HEIGHT = 600;
var GAME_WIDTH = 800;


var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/csv/redtide.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/redtide_background.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('lighthouse', 'assets/our_stuff/lighthouse.png');

}

var map;
var layer;
var cursors;

var test_entity;
var test_structure

var TILE_WIDTH = 32
var TILE_HEIGHT = 32

function create() {

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', TILE_WIDTH, TILE_HEIGHT);

    //  Now add in the tileset
    map.addTilesetImage('tiles');
    
    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    // create a simple sprite object
    //var test = game.add.sprite(200, 200, 'mushroom');
    //test_entity = new Entity(game, 10, 5, 0, 'mushroom')
    test_structure = new Structure(game, 10, 5, 0, 'lighthouse')

    //  Allow cursors to scroll around the map
    cursors = game.input.keyboard.createCursorKeys();

    var help = game.add.text(16, 16, 'Arrows to scroll', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

}

function update() {

    var mousePos = game.input.mousePointer;

    //console.log(mousePos.x + "/" + GAME_WIDTH + ":" + mousePos.y + "/" + GAME_HEIGHT);

    var percentage = 0.35;

    var xDist = Math.abs(mousePos.x - GAME_WIDTH/2)/20;

    var yDist = Math.abs(mousePos.y - GAME_HEIGHT/2)/20;


    if (mousePos.x <= percentage * GAME_WIDTH)
    {
            game.camera.x -= xDist;
    }
    else if (mousePos.x >= GAME_WIDTH - (GAME_WIDTH * percentage))
    {
            game.camera.x += xDist;
    }
    //move in x and y dirs
    if (mousePos.y <= percentage * GAME_HEIGHT)
    {
            game.camera.y -= yDist;
    }
    else if (mousePos.y >= GAME_HEIGHT - (GAME_HEIGHT * percentage))
    {
            game.camera.y += yDist;
    }

    // console.log(GAME_WIDTH * percentage);

    // if (mousePos.x >= GAME_WIDTH - (GAME_WIDTH * percentage))
    // {
    //     game.camera.x += 4;
    // }
    // else


    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }


}

function render() {

}
