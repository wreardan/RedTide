function Structure(game, x, y, player_id, sprite_name) {
	Entity.call(this, game, x, y, player_id, sprite_name) //Call the Parent Constructor
}

Structure.prototype = new Entity()
Structure.prototype.constructor = Structure

