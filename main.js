var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder');
var roleRepairman = require('role.repairman');

var taskHarvest = require('task.harvest');

require('prototype.spawn')();

var minBuilders = 5
var minUpgrades = 5
var minHarvesters = 5


function findRepair(tower) {
    if (Memory.repair == undefined) {
        var repair = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < Math.floor(structure.hitsMax / 3 * 2)) ||
                                    ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits <= 10000)
        })

        if (repair) {
            Memory.repair = repair;
        }
    }

    return Memory.repair;
}

function goToDarius(creep) {
    var pdarius = Game.flags.claim.pos;
    creep.moveTo(pdarius);
  //  return false;
    
    var controler = Game.getObjectById('0eed0774eae6d20')
    var status = creep.claimController(controler);
    
    console.log("Tried claiming: ", status);
    if (status == ERR_NOT_IN_RANGE) {
        creep.moveTo(controler);
    }
}


module.exports.loop = function () {

    var tower = Game.getObjectById('8664bd8fdeafec0');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            return
        }

        var repair = findRepair(tower);
        if (repair != undefined) {
            repair = Game.getObjectById(repair.id);
            tower.repair(repair);

            if (
                (repair.hits >= repair.hitsMax && repair.structureType != STRUCTURE_WALL && repair.structureType != STRUCTURE_RAMPART) || 
                (repair.hits >= 10000 && (repair.structureType == STRUCTURE_WALL || repair.structureType == STRUCTURE_RAMPART))
            ) {
                delete Memory.repair;
            }
        }
    }


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        } 
    }
    
    for (var ir in Game.rooms) {
       var room = Game.rooms[ir];
       
       var spawn = room.find(FIND_STRUCTURES, {
           filter: (structure) => structure.structureType == STRUCTURE_SPAWN
       })[0];
       
       var harvesters = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role == 'harvester'});
       var builders = room.find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'builder'});
       var upgrades = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role == 'upgrader'});
       
       console.log(room.name, "H: ", harvesters.length, " B: ", builders.length, " U: ", upgrades.length);
       
        var newName = -1;
        var energy =  room.energyCapacityAvailable;
    
        if (harvesters.length < minHarvesters) {
             newName = spawn.createBCreep(energy, "harvester");
        } else if (builders.length < minBuilders) {
            newName = spawn.createBCreep(energy, "builder");
        } else if (upgrades.length < minUpgrades) {
             newName = spawn.createBCreep(energy, "upgrader");
        } 
    
        if (!(newName < 0)) {
            console.log("Harvesters: ", harvesters.length, " Builders: ", builders.length, " Upgraders: ", upgrades.length);
            console.log('Spawning new creep: ' + newName, " at room: ", room.name);
        }
    }
    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!taskHarvest.run(creep)) {
            continue;
        }

        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'friend':
                goToDarius(creep);
                break;
            default:
                roleUpgrader.run(creep);
        }
    }
}
