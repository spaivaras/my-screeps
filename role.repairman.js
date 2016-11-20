var roleRepairman = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var toRepair = Game.getObjectById(creep.memory.toRepair.id);
        
        if (creep.memory.building == undefined) {
            creep.memory.building = true;
        }
        
        if (toRepair.hits >= toRepair.hitsMax) {
            creep.memory.role = creep.memory.oldRole;
            return;
        }

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('repairing');
	    }

	    if(creep.memory.building) {
	        var status = creep.repair(toRepair);
	        console.log("Repair status: ", status, " Creep: ", creep.name, " Structure: ", toRepair.structureType)
            if(status == ERR_NOT_IN_RANGE) {
                creep.moveTo(toRepair);
            }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
	        
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleRepairman;