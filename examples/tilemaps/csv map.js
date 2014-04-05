var GAME_HEIGHT = 600;
var GAME_WIDTH = 800;
var last_player_id = 0;

// var harvester_cooldown = 50000;
// var harvester_cooldown_lock = false;


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

    game.load.image('kelp', 'assets/our_stuff/kelp.png');

    //game.load.spritesheet('corals', 'assets/our_stuff/corals.png', 32, 32);

    game.load.image('coral1', 'assets/our_stuff/coral1.png');
    // game.load.image('coral2', 'assets/our_stuff/coral2.png');
    // game.load.image('coral3', 'assets/our_stuff/coral3.png');

    game.load.image('steam', 'assets/our_stuff/steam_vent.png');

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
    //this.player_id = last_player_id++;
    this.player_id = 0;//= last_player_id++;
    this.energy = 100;
    this.kelp = 100;
    this.coral = 50;
    this.steam = 10;
    this.color = color;
    this.mouse_pos = new Vector(0,0);
    this.selection = new Rect(-1,-1, 10, 10);
    this.selection_status = new Vector(-10,-10);
    // gives a thingy for the units to stop it when they hit it
    this.target_radius = 50
}

var players = [];

//players[0] = new Player('blue');

var player_state;

var entities;

var map;
var layer;
var cursors;

var test_entity = new Entity();
var test_structure = new TownHall();
var test_unit = new Harvester();
var test_hero = new Hero ();
var test_kelp = new Kelp();
//var coralArr['coral1', 'coral2', 'coral3'];
var test_coral = new Coral();
var test_steam = new Steam();

var TILE_WIDTH = 32
var TILE_HEIGHT = 32
var TILEMAP_WIDTH = 256
var TILEMAP_HEIGHT = 256
var graphics;

var player_hud

var collision_map = []
for(var i = 0; i < TILEMAP_HEIGHT; i++) {
    collision_map[i] = []
    for(var j = 0; j < TILEMAP_WIDTH; j++) {
        collision_map[i][j] = 0
    }
}

//keybinding
var townhall_hotkey
var townhall_list = []

var harvester_hotkey
var harvester_list = []

function create() {

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', TILE_WIDTH, TILE_HEIGHT);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Now add in the tileset
    map.addTilesetImage('tiles');
    
    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    // initialize global entity list
    entities = []; 

    // create a simple sprite object
    //var test = game.add.sprite(200, 200, 'mushroom');
    test_structure.init(game, 3, 5, 0, 'lighthouse')
    test_hero.init(game, 10, 10, 0, 'sir_starfish');
    test_kelp.init(game, 1, 1);
    test_coral.init(game, 2, 1);
    for (var i = 0; i < 50; i++) {
        var test_steam = new Steam();
        test_steam.init(game, Math.floor(Math.random() * 20), 
                Math.floor(Math.random() * 100));
        entities.push(test_steam);
    }
    console.log(collision_map)
    test_steam.init(game,3, 1);

    //  Allow cursors to scroll around the map
    cursors = game.input.keyboard.createCursorKeys();

    player_state = new Player("rgb(255, 0, 0)");

    var help = game.add.text(16, 16, 'Arrows and mouse to scroll', { font: '14px Arial', fill: '#ffffff' });
    player_hud = game.add.text(16, GAME_HEIGHT - 16, getHUDText(player_state), { font: '14px Arial', fill: player_state.color});
    help.fixedToCamera = true;
    player_hud.fixedToCamera = true;
    entities.push(test_structure);
    entities.push(test_hero);

    //test_unit.init(game, 15, 10, 1)
    test_unit.init(game, 15, 10, 0, 'blue_fish');
    entities.push(test_unit);

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


function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.w || 
           r2.w + r2.x < r1.x || 
           r2.y > r1.y + r1.h ||
           r2.y + r2.h  < r1.y);
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
    for (var j = 0; j < entities.length; j++){
        //console.log(entities[j]);
        if ( entities[j].player_id != player_state.player_id || entities[j].selected == false){
            continue;
        }

        //console.log(entities[j]);
        var speed = 5;
        e = entities[j];
        e.destination.x = mousePos.x + game.camera.x;
        e.destination.y = mousePos.y + game.camera.y;
        e.velocity.x = speed * (e.destination.x - e.sprite.x) / distance(e.destination, e.sprite);
        e.velocity.y = speed * (e.destination.y - e.sprite.y) / distance(e.destination, e.sprite);
    }
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

    // if (harvester_cooldown_lock)
    //     harvester_cooldown--;
    // else if (harvester_cooldown <= 0)
    // {
    //     harvester_cooldown = 5000;
    //     harvester_cooldown_lock = false;
    // }

    //handle hotkeys
    if(townhall_hotkey.justPressed()) {
        test_structure.move_delta(1, 0);
    }
    if(harvester_hotkey.justReleased()) {
        //console.log("harvester hotkey pressed " + townhall_list.length)
        for(var i = 0; i < townhall_list.length; i++) {
            var townhall = townhall_list[i]
            if(townhall.selected) {
                //console.log("townhall selected")
                townhall.spawn(0, player_state);
                //harvester_cooldown_lock = true;
            }
        }
        //test_unit.move_delta(1, 0)
    }

	// update selected units
    temp_rect = new Rect(0,0,0,0);
    temp_selection = new Rect(p.selection.x - game.camera.x, p.selection.y - game.camera.y, p.selection.w, p.selection.h);
    //console.log(p.selection);
	if ( p.selection.x > 0 && p.selection.y > 0){
		for (var j = 0; j < entities.length; j++){
            if ( entities[j].player_id != player_state.player_id){
                continue;
            }
			entities[j].selected = false;
            temp_rect.x = entities[j].sprite.x;
            temp_rect.y = entities[j].sprite.y;
            temp_rect.w = entities[j].sprite.width;
            temp_rect.h = entities[j].sprite.height;
            //console.log(temp_rect);
            //console.log(p.selection);
			if ( entities[j].player_id == player_state.player_id && intersectRect(temp_rect, p.selection) ){
				entities[j].selected = true;
			}
		}
	}

    player_hud.text = getHUDText(player_state)
	for (var j = 0; j < entities.length; j++){
        //console.log(entities[j].sprite.body.velocity);
        e = entities[j];
        e.x2 += e.velocity.x;
        e.y2 += e.velocity.y;
        e.move( Math.floor(e.x2 / TILE_WIDTH), Math.floor(e.y2 / TILE_HEIGHT));
        if (Math.abs(entities[j].velocity.x) > 0  ||
            Math.abs(entities[j].velocity.y) > 0 ){
            //console.log("dist: " + distance(entities[j].sprite, entities[j].destination));
            if (distance(entities[j].sprite, entities[j].destination) < 
                player_state.target_radius) {
                    console.log("stop");
                    entities[j].velocity.x = 0
                    entities[j].velocity.y = 0
            }
        }
    }
}

function distance(p1, p2){
    dx = (p1.x - p2.x);
    dy = (p1.y - p2.y);
    return Math.sqrt( dx*dx + dy*dy);
}


function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.w || 
           r2.w + r2.x < r1.x || 
           r2.y > r1.y + r1.h ||
           r2.y + r2.h  < r1.y);
}

function render() {
    graphics.destroy();
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(2, 20, 20);
    if (player_state.selection.x > 0 ) {
        
        // draw a shape
        graphics.moveTo(player_state.selection.x, player_state.selection.y);
        graphics.lineTo(player_state.selection.x + player_state.selection.w, player_state.selection.y);
        graphics.lineTo(player_state.selection.x + player_state.selection.w, 
                        player_state.selection.y + player_state.selection.h);
        graphics.lineTo(player_state.selection.x , player_state.selection.y + player_state.selection.h);
        graphics.lineTo(player_state.selection.x, player_state.selection.y);
    }
    for (var j = 0; j < entities.length; j++){
		if ( entities[j].player_id == player_state.player_id && entities[j].selected == true){
            // draw selection indicator
            graphics.moveTo(entities[j].sprite.x, entities[j].sprite.y);
            graphics.lineTo(entities[j].sprite.x + entities[j].sprite.width, entities[j].sprite.y);
            graphics.lineTo(entities[j].sprite.x + entities[j].sprite.width, entities[j].sprite.y + entities[j].sprite.height);
            graphics.lineTo(entities[j].sprite.x, entities[j].sprite.y + entities[j].sprite.height);
            graphics.lineTo(entities[j].sprite.x, entities[j].sprite.y);
        }
    }
    graphics.endFill();
}


function getHUDText(player)
{
    var retStr = "PLAYER " + (player.player_id + 1);

    retStr += (" | KELP : " + player.kelp);

    retStr += (" | CORAL: " + player.coral);

    retStr += (" | STEAM: " + player.steam);

    return retStr; 
}
