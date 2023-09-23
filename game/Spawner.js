import { classMapping } from "./Mobs/classMapping.js";

export default class Spawner {
    /**
     * @param {Game} game 
     * @param {Number} indexX 
     * @param {Number} indexY 
     * @param {String} mob
     * @param {Number} frequency 
     */
    constructor(game, indexX, indexY, mob, frequency = 3) {
        this.game = game;
        this.indexX = indexX;
        this.indexY = indexY;
        this.mob = mob;
        this.mobs = {};
        this.maxMobs = 3;
        this.frequency = frequency;
        this.timer = 0;

        this.interval = null;
    }

    update(deltaTime) {
        if (this.timer >= this.frequency && Object.keys(this.mobs).length < this.maxMobs) {
            const className = classMapping[this.mob];
            const mob = new className(this);

            this.mobs[mob.name] = mob;
            this.game.mobs[mob.name] = mob.serialize();
            
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
    }

    stop() {
        this.interval.clearInterval();
    }
}