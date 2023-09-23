const deltaTime = 10;

export default class Game {
    constructor() {
        this.spawners = [];
        this.world;
        this.players;
        this.mobs;

        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => {
            this.updateSpawners();
            this.updateMobs();
        }, deltaTime);
    }

    updateSpawners() {
        for (let i = 0; i < this.spawners.length; i++) {
            this.spawners[i].update(deltaTime);
        }
    }

    updateMobs() {
        for (let i = 0; i < this.mobs.length; i++) {
            this.mobs[i].update(deltaTime);
        }
    }

    stop() {
        this.interval = clearInterval();
    }
}