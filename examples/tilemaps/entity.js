//ENtity Base Class
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