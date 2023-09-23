import classMapping from "./Mobs/classMapping";

export default class Spawner {
    /**
     * @param {Number} indexX 
     * @param {Number} indexY 
     * @param {String} mob
     * @param {Number} frequency 
     */
    constructor(indexX, indexY, mob, frequency = 10000) {
        this.indexX = indexX;
        this.indexY = indexY;
        this.mob = mob;
        this.mobs = [];
        this.maxMobs = 3;
        this.frequency = frequency;
        this.timer = 0;

        this.interval = null;
    }

    update(deltaTime) {
        if (this.timer >= this.frequency) {
            const className = classMapping[this.mob];
            this.mobs = new className();
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
    }

    stop() {
        this.interval.clearInterval();
    }
}