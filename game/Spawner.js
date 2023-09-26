import { classMapping } from "./Mobs/classMapping.js";
import { TILE_SIZE } from "./Tile.js";

export default class Spawner {
    /**
     * @param {Game} game 
     * @param {Number} indexX 
     * @param {Number} indexY 
     * @param {String} mob
     * @param {Number} frequency 
     */
    constructor(game, indexX, indexY, mob, frequency = 10000) {
        this.game = game;
        this.indexX = indexX;
        this.indexY = indexY;
        this.mob = mob;
        this.mobs = {};
        this.maxMobs = 1;
        this.frequency = frequency;
        this.timer = 0;
        this.range = 2 * TILE_SIZE;

        this.interval = null;
    }

    update(deltaTime) {
        if (this.timer >= this.frequency && Object.keys(this.mobs).length < this.maxMobs) {
            const className = classMapping[this.mob];
            const mob = new className(this);

            this.mobs[mob.name] = mob.serialize();
            this.game.mobs[mob.name] = mob;
            
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
    }

    stop() {
        this.interval.clearInterval();
    }

    getCenterX() {
        return (this.indexX * TILE_SIZE) + TILE_SIZE / 2;
    }

    getCenterY() {
        return (this.indexY * TILE_SIZE) + TILE_SIZE / 2;
    }
}