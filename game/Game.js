import Slime from "./Mobs/Slime.js";
import Spawner from "./Spawner.js";

const deltaTime = 10;

export default class Game {
    constructor() {
        this.world;
        this.players = {};
        this.mobs = {};
        this.spawners = [new Spawner(this, 17, 17, 'Slime', 5000)];

        this.interval = null;
    }

    start() {
        console.log(this.mobs);

        if (!this.interval) {
            this.interval = setInterval(() => {
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
        for (const name in this.mobs) {
            if (this.players.hasOwnProperty(name)) {
                const value = this.mobs[name];
                value.update(deltaTime);
            }
        }
    }

    stop() {
        this.interval = clearInterval();
    }
}