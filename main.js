var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');

var taskHarvest = require('task.harvest');
require('prototype.spawn')();

var minBuilders = 3;
var minUpgrades = 3;
var minHarvesters = 3;

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        } 
    }
    
    for (var ir in Game.rooms) {
        var room = Game.rooms[ir];
        var towers = room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER});
        
        if (towers.length > 0) {
            roleTower.run(towers[0]);
        }
       
        var spawn = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_SPAWN
        })[0];
       
        var harvesters = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role == 'harvester'});
        var builders = room.find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'builder'});
        var upgrades = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role == 'upgrader'});
       
        var newName = -1;
        var energy = room.energyCapacityAvailable;
    
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
            default:
                roleUpgrader.run(creep);
        }
    }
}
