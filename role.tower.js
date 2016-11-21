module.exports = {
    findRepair: function(tower) {
        
        if (Memory.room == undefined) {
            Memory.room = {};
        }
        
        if (Memory.room[tower.room.name] == undefined) {
            Memory.room[tower.room.name] = {};
        }
        
        if (Memory.room[tower.room.name].repair == undefined) {
            var repair = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < Math.floor(structure.hitsMax / 3 * 2)) ||
                                        ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits <= 10000)
            })
    
            if (repair) {
                Memory.room[tower.room.name].repair = repair;
            }
        }
        
        return Memory.room[tower.room.name].repair;
    },

    run: function(tower) {
        var closestHostile =  tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            
            return;
        }

        var repair = this.findRepair(tower);
        
        if (repair != undefined) {
            repair = Game.getObjectById(repair.id);
            tower.repair(repair);

            if (
                (repair.hits >= repair.hitsMax && repair.structureType != STRUCTURE_WALL && repair.structureType != STRUCTURE_RAMPART) || 
                (repair.hits >= 10000 && (repair.structureType == STRUCTURE_WALL || repair.structureType == STRUCTURE_RAMPART))
            ) {
                delete Memory.room[tower.room.name].repair;
            }
        }
    }
};
