function Entity(game, x, y, player_id, sprite_name) {
	this.x = x
	this.y = y

	this.player_id = player_id

	this.sprite = game.add.sprite(x * TILE_WIDTH, y * TILE_HEIGHT, sprite_name);
	this.state = 0
}

Entity.prototype.move = function(x, y) {
	this.x = x
	this.y = y
}