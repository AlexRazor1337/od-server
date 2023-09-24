import { DIRECTIONS } from "../../public/src/consts.js";

export default class Mob {
    constructor(spawner) {
        this.name = 'Mob_' + Math.random().toString(16).slice(2, 10);
        this.spawner = spawner;

        this.hp;
        this.defence;
        this.lvl;
        this.name;

        this.worldX = spawner.indexX * 48;
        this.worldY = spawner.indexY * 48;
        this.maxXSpeed = 1;
        this.maxYSpeed = 1;
        this.xSpeed;
        this.ySpeed;
        this.direction;

        this.timer = 0
        this.maxTime = null;
    }

    update(deltaTime) {
        this.randomMoving(deltaTime);
    }

    randomMoving(deltaTime) {
        if (this.timer >= this.maxTime) {
            const min = 2; // Minimum value (inclusive)
            const max = 6; // Maximum value (inclusive)
            
            this.timer = 0;
            this.maxTime = Math.floor(Math.random() * (max - min + 1)) + min;
            this.maxTime *= 1000;

            this.direction = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
        } else {
            this.timer += deltaTime;
        }
    }

    serialize() {
        return {
            worldX: this.worldX,
            worldY: this.worldY,
            direction: this.direction,
            hp: this.hp,
            lvl: this.lvl,
        };
    }
};
