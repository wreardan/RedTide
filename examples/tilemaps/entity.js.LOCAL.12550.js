//ENtity Base Class

var omniHealth = 100;

function Entity(game, x, y, player_id, sprite_name) {
	this.game = game
	this.x = x
	this.y = y
	this.player_id = player_id
	this.sprite_name = sprite_name

	this.sprite = game.add.sprite(x * TILE_WIDTH, y * TILE_HEIGHT, sprite_name);
	this.state = 0

	var sprite = game.cache.getImage(sprite_name)

	this.tiles_x = sprite.width / TILE_WIDTH
	this.tiles_y = sprite.height / TILE_HEIGHT

	this.produces = []	//List of Entities that the Entity can produce
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

//Structure Class, inherits from Entity
function Structure(game, x, y, player_id, sprite_name) {
	Entity.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor
}

Structure.prototype = new Entity()
Structure.prototype.constructor = Structure

Structure.prototype.move = function(x, y) {
	//do nothing, structures don't move
}

Structure.prototype.move_delta = function(x, y) {
	//do nothing, structures don't move
}

//Town Hall class that builds harvesters and collects resources
function TownHall(game, x, y, player_id, sprite_name) {
	Structure.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor

	this.produces.push(Harvester)
}

TownHall.prototype = new Structure()
TownHall.prototype.constructor = TownHall

//Structure Class, inherits from Entity
function Unit(game, x, y, player_id, sprite_name) {
	Entity.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor
}

Unit.prototype = new Entity();
Unit.prototype.constructor = Unit;

//Harvester Unit that collects resources and builds structures
function Harvester(game, x, y, player_id, sprite_name) {
	sprite_name = 'snake'
	Unit.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor

	this.produces.push(TownHall)

    this.sprite.animations.add('left', [3,4,5], 10, true);
    this.sprite.animations.add('right', [6,7,8], 10, true);
    this.sprite.animations.add('up', [9,10,11], 10, true);
    this.sprite.animations.add('down', [0,1,2], 10, true);
}

Unit.prototype = new Unit();
Harvester.prototype.constructor = Harvester;


var heroMap = {

"eddard_shark" : 	{"speed" : 2, "attack" : 3, "health" : 1},
"the_kraken" : 		{"speed" : 2, "attack" : 1, "health" : 3},
"lobsternidas" : 	{"speed" : 1, "attack" : 2, "health" : 3},
"lord_eel" : 		{"speed" : 3, "attack" : 1, "health" : 2},
"sir_starfish" : 	{"speed" : 1, "attack" : 3, "health" : 2}

};

function Hero(game, x, y, player_id, sprite_name)
{
	var thisHero = Unit.call(this, game, x, y, player_id, sprite_name);

	var heroAttrs = heroMap[sprite_name];

	thisHero.sprite.move = function (x, y)
	{
		this.x = x * heroAttrs.speed;
		this.y = y * heroAttrs.speed;
		this.update();
	}

	thisHero.sprite.health = heroAttrs.health * omniHealth;

	thisHero.attack = heroAttrs.attack;

}

Hero.prototype = new Hero();

Hero.prototype.constructor = Harvester();