//ENtity Base Class
function Entity() {
	this.kelp_cost = 3
	this.coral_cost = 2
	this.steam_cost = 1
}

Entity.prototype.init = function(game, x, y, player_id, sprite_name) {
	this.game = game
	this.x = x
	this.y = y
	this.player_id = player_id
	this.sprite_name = sprite_name
    this.destination = new Vector(0,0);
    this.selected = false;
    this.velocity = new Vector(0,0);

	this.sprite = game.add.sprite(x * TILE_WIDTH, y * TILE_HEIGHT, sprite_name);
    this.x2 = this.sprite.x;
    this.y2 = this.sprite.y;
	this.state = 0

	//var sprite = game.cache.getImage(sprite_name);
	var sprite = this.sprite

	this.width = sprite.width / TILE_WIDTH;
	this.height = sprite.height / TILE_HEIGHT;
	//console.log(sprite_name, sprite.width, sprite.height)

	this.produces = []	//List of Entities that the Entity can produce

	this.set_collision_area(true)

	//this.cooldown_lock = false;
	this.cooldown_time = 5000;
	this.spawn_stamp = null;
}

Entity.prototype.set_collision_area = function(value) {
	for(var y = this.y; y < this.y + this.height; y++) {
		for(var x = this.x; x < this.x + this.width; x++) {
			collision_map[y][x] = value
		}
	}
}

Entity.prototype.update = function() {
	this.sprite.x = this.x * TILE_WIDTH
	this.sprite.y = this.y * TILE_HEIGHT
}

Entity.prototype.move = function(x, y) {
	this.x = x
	this.y = y
	this.update()
}

Entity.prototype.move_delta = function(x, y) {
	this.x += x
	this.y += y
	this.update()
}

Entity.prototype.spawn = function(index, player_id) {
	if(index >= this.produces.length)
		return //invalid unit spawned

	//get cost of unit
	var fake_unit = new this.produces[index]()
	var kelp_cost = fake_unit.kelp_cost
	var coral_cost = fake_unit.coral_cost
	var steam_cost = fake_unit.steam_cost

	//check if player has enough resources
	var player = player_state
	if(player.kelp < kelp_cost)
		return
	if(player.coral < coral_cost)
		return
	if(player.steam < steam_cost)
		return

	if (Date.now() < this.spawn_stamp + this.cooldown_time)
		return;

	//subtract resources
	player.kelp -= kelp_cost;
	player.coral -= coral_cost;
	player.steam -= steam_cost;

	//find location to spawn unit
	for(var y = this.y - 1; y < this.y + this.height + 1; y++) {
		for(var x = this.x - 1; x < this.x + this.width + 1; x++) {
			if(!collision_map[y][x]) {
				//spawn unit
				var spawned_unit = new this.produces[index]()
				spawned_unit.init(this.game, x, y, this.player_id, this.spawn_unit)
				entities.push(spawned_unit)
				game.physics.enable(spawned_unit.sprite, Phaser.Physics.ARCADE)
				//cooldown_lock = true;
				this.spawn_stamp = Date.now();
				return
			}
		}
	}

}

//Structure Class, inherits from Entity
function Structure() {
}

Structure.prototype = new Entity()
Structure.prototype.constructor = Structure

Structure.prototype.init = function(game, x, y, player_id, sprite_name) {
	Entity.prototype.init.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor
}

Structure.prototype.move = function(x, y) {
	//do nothing, structures don't move
}

Structure.prototype.move_delta = function(x, y) {
	//do nothing, structures don't move
}

//Town Hall class that builds harvesters and collects resources
function TownHall() {
	this.kelp_cost = 16
	this.coral_cost = 8
	this.steam_cost = 0
}

TownHall.prototype = new Structure()
TownHall.prototype.constructor = TownHall

TownHall.prototype.init = function(game, x, y, player_id, sprite_name) {
	Structure.prototype.init.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor

	townhall_list.push(this);
	this.spawn_unit = 'manta';
	this.produces.push(Harvester);
}

//Structure Class, inherits from Entity
function Unit() {
}

Unit.prototype = new Entity()
Unit.prototype.constructor = Unit

Unit.prototype.init = function(game, x, y, player_id, sprite_name) {
	Entity.prototype.init.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor
}

//Harvester Unit that collects resources and builds structures
function Harvester() {
	this.kelp_cost = 2
	this.coral_cost = 0
	this.steam_cost = 1
}

Harvester.prototype.init = function(game, x, y, player_id) {
	//sprite_name = 'snake'

	Unit.prototype.init.call(this, game, x, y, player_id, 'manta') //Call the Parent Constructor
	this.spawn_unit = 'lighthouse';
	this.produces.push(TownHall);

    this.sprite.animations.add('left', [3,4,5], 10, true);
    this.sprite.animations.add('right', [6,7,8], 10, true);
    this.sprite.animations.add('up', [9,10,11], 10, true);
    this.sprite.animations.add('down', [0,1,2], 10, true);

	harvester_list.push(this)
}

Harvester.prototype = new Unit();
Harvester.prototype.constructor = Harvester;


function Hero () {
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;

Hero.prototype.init = function(game, x, y, player_id, sprite_name){
	
	Unit.prototype.init.call(this, game, x, y, player_id, sprite_name);

	//this.sprite.animations.add

	var heroMap = {
		eddard_shark : { speed : 2, attack: 3, health : 1 },
		the_kraken : { speed : 3, attack: 2, defense : 1},
		lord_eel : { speed : 3, attack : 1, health : 2},
		sir_starfish : { speed : 2, attack : 1, health : 3},
		lobsternidas : { speed : 1, attack : 2, health : 3}
	};

	var heroAttr = heroMap[sprite_name];

}

function Resource() {
}

Resource.prototype = new Structure()

Resource.prototype.constructor = Resource

Resource.prototype.init = function(game, x, y, sprite_name) {

	//sprite_name = 'kelp';

	this.amount_left = 100;

	Structure.prototype.init.call(this, game, x, y, -1, sprite_name); //Call the Parent Constructor
	// -1 means neutral player
}

function Kelp() {
}

Kelp.prototype = new Resource()

Kelp.prototype.constructor = Kelp

Kelp.prototype.init = function (game, x, y) {

	Resource.prototype.init.call(this, game, x, y, 'kelp');
	
}

function Coral () {
}

Coral.prototype = new Resource()

Coral.prototype.constructor = Coral

Coral.prototype.init = function (game, x, y) {

	//var randCoral = Math.floor(Math.random() * corals.length);

	Resource.prototype.init.call(this, game, x, y, 'coral1');
}

function Steam () {
}

Steam.prototype = new Resource ()

Steam.prototype.constructor = Steam

Steam.prototype.init = function (game, x, y)
{
	Resource.prototype.init.call(this, game, x, y, 'steam');
}
