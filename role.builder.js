var roleHarvester = require('role.harvester');
module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        if(target != undefined) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            roleHarvester.run(creep);
        }
	}
};
