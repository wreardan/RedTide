function Entity(game, x, y, player_id, sprite_name) {
	this.x = x
	this.y = y

	this.player_id = player_id

	this.sprite = game.add.sprite(x * TILE_WIDTH, y * TILE_HEIGHT, sprite_name);
	this.state = 0
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