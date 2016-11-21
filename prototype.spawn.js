module.exports = function() {
	Spawn.prototype.createBCreep = function (energy, role) {
		var sets = Math.floor(energy / 200);
		var parts = [];

		for (let i = 0; i < sets; i++) {
			parts.push(WORK);
			parts.push(CARRY);
			parts.push(MOVE);
		}

		return this.createCreep(parts, undefined, {role: role});
	}
}
