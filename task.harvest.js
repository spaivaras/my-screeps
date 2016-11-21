module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.carry.energy == 0 && !creep.memory.refuel) {
			creep.memory.refuel = true;
		}

		if (creep.memory.refuel) {
			var minerals = _.sum(creep.carry) - creep.carry.energy;
		    if (minerals > 0) {
		        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER)
		        });
		       
		        for (min in RESOURCES_ALL) {
		            if (RESOURCES_ALL[min] != RESOURCE_ENERGY && creep.carry[RESOURCES_ALL[min]] != undefined && creep.carry[RESOURCES_ALL[min]] > 0) {
		                var stat = creep.transfer(container, RESOURCES_ALL[min]);
		                console.log(creep.name, " had resource: ",  RESOURCES_ALL[min], " status: ", stat);
		                if (stat == ERR_NOT_IN_RANGE) {
            		        creep.moveTo(container);
            		    }
		        
		                return false;
		            }
		        }

		    }
		    
			if(creep.carry.energy < creep.carryCapacity) {
				var droped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
				if (droped) {

					var before = creep.carry.energy;
					var stat = creep.pickup(droped);

					if (stat == OK) {
						creep.say("Nom!! " + droped.amount);
					}
					if (stat == ERR_NOT_IN_RANGE) {
						creep.moveTo(droped);
					}

					return false;
				}

            	var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

            	if (creep.room.find(FIND_SOURCES_ACTIVE).length == 0 && creep.carry.energy > 0) {
            		creep.say('Out ;((');
            		creep.memory.refuel = false;
            		console.log(creep.name, " cries: no sources, back to work");

            		return true;
            	}

            	if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            		creep.moveTo(source);
            	}

            	return false;
        	} else {
            	creep.memory.refuel = false;
        	}
		}

		return true;
	}
};
