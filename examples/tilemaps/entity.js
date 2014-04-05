function Entity(x, y, player_id) {
	this.x = x
	this.y = y

	this.player_id = player_id

	this.sprite = null
	this.state = 0
}

Entity.prototype.move = function(x, y) {
	this.x = x
	this.y = y
}