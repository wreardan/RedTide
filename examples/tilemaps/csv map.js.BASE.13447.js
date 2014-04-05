var GAME_HEIGHT = 600;
var GAME_WIDTH = 800;
var last_player_id = 0;


var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/csv/redtide.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles/redtide_background.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('lighthouse', 'assets/our_stuff/lighthouse.png');
    game.load.spritesheet('blue_fish', 'assets/our_stuff/animales2_0.png', 32, 32);
    game.load.spritesheet('manta', 'assets/our_stuff/manta.png', 32, 32);
    game.load.spritesheet('frog', 'assets/our_stuff/frog.png', 32, 32);
    game.load.spritesheet('striped_fish', 'assets/our_stuff/striped_fish.png', 32, 32);
    //game.load.spritesheet('red_fish', 'assets/our_stuff/red_fish.png', 32, 32); //TODO fix red_fish
    game.load.spritesheet('snake', 'assets/our_stuff/snake.png', 32, 32);
    game.load.spritesheet('lamprey', 'assets/our_stuff/lamprey.png', 32, 32);

    //TODO add hero imgs
    game.load.image('eddard_shark', 'assets/our_stuff/ed_shark.png');
    game.load.image('the_kraken', 'assets/our_stuff/kraken.png');
    game.load.image('lobsternidas', 'assets/our_stuff/lobsternidas.png');
    game.load.image('lord_eel', 'assets/our_stuff/lord_eel.png');
    game.load.image('sir_starfish', 'assets/our_stuff/sir_starfish.png');
    //game.load.image


}

function Vector(x, y){
    this.x = x;
    this.y = y;
}

function Rect(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Player(color){
    this.player_id = last_player_id++;
    this.energy = 0;
    this.kelp = 0;
    this.color = color;
    this.mouse_pos = new Vector(0,0);
    this.selection = new Rect(-1,-1, 10, 10);
    this.selection_status = new Vector(-10,-10);
}

var players;
var player_state;

var map;
var layer;
var cursors;

var test_entity = new Entity();
var test_structure = new TownHall();
var test_unit = new Harvester();
var test_hero = new Hero ();

var TILE_WIDTH = 32
var TILE_HEIGHT = 32
var graphics;

//keybinding
var townhall_hotkey
var harvester_hotkey

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
    test_entity.init(game, 10, 5, 0, 'mushroom')
    test_structure.init(game, 3, 5, 0, 'lighthouse')
    test_hero.init(game, 10, 10, 0, 'sir_starfish');

    //  Allow cursors to scroll around the map
    cursors = game.input.keyboard.createCursorKeys();

    player_state = new Player("rgb(255, 0, 0)");

    var help = game.add.text(16, 16, 'Arrows and mouse to scroll', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

    //test_unit.init(game, 15, 10, 1)
    test_unit.init(game, 15, 10, 1, 'blue_fish');

    /*test_unit.sprite.animations.add('left', [3,4,5], 10, true);
    test_unit.sprite.animations.add('right', [6,7,8], 10, true);
    test_unit.sprite.animations.add('up', [9,10,11], 10, true);
    test_unit.sprite.animations.add('down', [0,1,2], 10, true);*/
    graphics = game.add.graphics(0, 0);
    game.input.onDown.add(mouse_down, this);
    game.input.onUp.add(mouse_up, this);

    //setup hotkeys
    townhall_hotkey = game.input.keyboard.addKey(Phaser.Keyboard.T)
    harvester_hotkey = game.input.keyboard.addKey(Phaser.Keyboard.H)
}

function mouse_up(evt){
    player_state.selection.x = -1;
    player_state.selection.y = -1;
    player_state.selection.w = 1;
    player_state.selection.h = 1;
    player_state.selection_status.x = -10;
    player_state.selection_status.y = -10;
}

function mouse_down(evt){
    var mousePos = game.input.mousePointer;
    player_state.selection.x = mousePos.x + game.camera.x;
    player_state.selection.y = mousePos.y + game.camera.y;
}

function update() {

    var mousePos = game.input.mousePointer;

    var percentage = 0.25;

    var xDist = Math.abs(mousePos.x - GAME_WIDTH/2)/20;

    var yDist = Math.abs(mousePos.y - GAME_HEIGHT/2)/20;

    test_unit.sprite.animations.play('down');

    //move in x and y dirs
    if (mousePos.x <= percentage * GAME_WIDTH)
    {
            game.camera.x -= xDist;
    }
    else if (mousePos.x >= GAME_WIDTH - (GAME_WIDTH * percentage))
    {
            game.camera.x += xDist;
    }

    if (mousePos.y <= percentage * GAME_HEIGHT)
    {
            game.camera.y -= yDist;
    }
    else if (mousePos.y >= GAME_HEIGHT - (GAME_HEIGHT * percentage))
    {
            game.camera.y += yDist;
    }

    //key input
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
   
/*
    if (player_state.selection.x > -1) {
        player_state.selection.x = mousePos.x;
        player_state.selection.y = mousePos.y;
    }
*/
    p = player_state;
    x = mousePos.x;
    y = mousePos.y;
    p.mouse_pos.x = mousePos.x;
    p.mouse_pos.y = mousePos.y;

    // adjust the selection rectangle
    var s = p.selection;
    if ( Math.abs(p.selection_status.x) != 1)
    {// first time the mouse is moving after the mouse was pressed
        if ( x + game.camera.x < s.x )
            p.selection_status.x = -1;
        else
            p.selection_status.x = 1;
        if ( y + game.camera.y < s.y )
            p.selection_status.y = -1;
        else
            p.selection_status.y = 1;
    }
    if ( s.x > 0 && s.y > 0){
        if (p.selection_status.x == 1){
            s.w = x + game.camera.x - s.x;
        }
        else{
            s.w += s.x - (x + game.camera.x);
            s.x = x + game.camera.x;
        }
        if (p.selection_status.y == 1){
            s.h = y + game.camera.y - s.y;
        }
        else{
            s.h += s.y - (y + game.camera.y);
            s.y = y + game.camera.y;
        }

    }
    if ( s.w < 0 ){
        s.x = s.x + s.w;
        s.w = Math.abs(s.w);
        p.selection_status.x *= -1;
    }
    if ( s.h < 0 ){
        s.y = s.y + s.h;
        s.h = Math.abs(s.h);
        p.selection_status.y *= -1;
    }
    player_state = p;

    // TODO - update this to refer to our global sprite list
/*
    // update selected units
    if ( s.x > 0 && s.y > 0){
        for (var j = 0; j < p.units.length; j++){
            p.units[j].selected = false;
            if ( intersectRect(p.units[j].collision_rect(), p.selection) ){
                p.units[j].selected = true;
            }
        }
    }
*/

    //handle hotkeys
    if(townhall_hotkey.justPressed()) {
        test_structure.move_delta(1, 0)
    }
}

function render() {
    graphics.destroy();
    if (player_state.selection.x != -1) {
        graphics = game.add.graphics(0, 0);
        graphics.lineStyle(2, 20, 20);
        
        // draw a shape
        graphics.moveTo(player_state.selection.x, player_state.selection.y);
        graphics.lineTo(player_state.selection.x + player_state.selection.w, player_state.selection.y);
        graphics.lineTo(player_state.selection.x + player_state.selection.w, 
                        player_state.selection.y + player_state.selection.h);
        graphics.lineTo(player_state.selection.x , player_state.selection.y + player_state.selection.h);
        graphics.lineTo(player_state.selection.x, player_state.selection.y);
        graphics.endFill();
    }


}