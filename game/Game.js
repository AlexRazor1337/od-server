import Spawner from "./Spawner.js";
import { Map } from "../http/map.js";
import World from "./World.js";

const deltaTime = 10;

export default class Game {
    constructor() {
        this.world = new World(this, Map);
        this.players = {};
        this.mobs = {};
        this.spawners = [
            new Spawner(this, 19, 17, 'Slime', 2000),
            new Spawner(this, 16, 14, 'Slime', 3000),
            new Spawner(this, 14, 19, 'Slime', 3000),
            new Spawner(this, 12, 12, 'Slime', 3000)
        ];

        this.interval = null;
    }

    start() {
        if (!this.interval) {
            this.interval = setInterval(() => {
            //console.log('Mobs counter: ' + Object.keys(this.mobs).length);
                this.updateSpawners(deltaTime);
                this.updateMobs(deltaTime);
            }, deltaTime);
        }
    }

    updateSpawners(deltaTime) {
        for (let i = 0; i < this.spawners.length; i++) {
            this.spawners[i].update(deltaTime);
        }
    }

    updateMobs(deltaTime) {
        for (const key in this.mobs) {
            this.mobs[key].update(deltaTime);
        }
    }

    stop() {
        this.interval = clearInterval();
    }
}