import { DIRECTIONS } from "../../public/src/consts.js";
import { TILE_SIZE } from "../Tile.js";

export default class Mob {
    constructor(spawner, config = {}) {
        this.name = 'Mob_' + Math.random().toString(16).slice(2, 10);
        this.spawner = spawner;

        this.worldX = spawner.indexX * 48;
        this.worldY = spawner.indexY * 48; 

        this.height;
        this.width;

        this.hp = 10;
        this.defence;
        this.lvl;
        this.name;
        this.maxXSpeed = 1;
        this.maxYSpeed = 1;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.direction = Math.floor(Math.random() * (7 - 0 + 1)) + 0;

        this.timer = 0
        const min = 2; // Minimum value (inclusive)
        const max = 6; // Maximum value (inclusive)
        this.maxTime = Math.floor(Math.random() * (max - min + 1)) + min;
        this.maxTime *= 1000;
    }

    update(deltaTime) {
        this.randomMoving(deltaTime);
        this.handleObstacle();
        this.move();
        this.spawner.game.mobs[this.name] = this.serialize(this);
    }

    move() {
        const offsetX = this.xSpeed / 10;
        const offsetY = this.ySpeed / 10;

        this.worldX += offsetX;
        this.worldY += offsetY;

        const rangeX = Math.abs(this.worldX - this.spawner.getCenterX());
        const rangeY = Math.abs(this.worldT - this.spawner.getCenterY());

        if (rangeX > this.spawner.range || rangeY > this.spawner.range) {
            this.setOppositDirection();
        }
    }

    randomMoving(deltaTime) {
        if (this.timer >= this.maxTime) {
            const min = 2; // Minimum value (inclusive)
            const max = 6; // Maximum value (inclusive)
            
            this.timer = 0;
            this.maxTime = Math.floor(Math.random() * (max - min + 1)) + min;
            this.maxTime *= 1000;

            this.direction = Math.floor(Math.random() * (7 - 0 + 1)) + 0;

            this.setSpeedByDirection(this.direction);
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

    setSpeedByDirection(direction) {
        this.direction = direction;

        switch (direction) {
            case DIRECTIONS.W:
                this.xSpeed = 1;
                this.ySpeed = 0;
                break;
            case DIRECTIONS.E:
                this.xSpeed = -1;
                this.ySpeed = 0;
                break;
            case DIRECTIONS.S:
                this.xSpeed = 0;
                this.ySpeed = -1;
                break;
            case DIRECTIONS.N:
                this.xSpeed = 0;
                this.ySpeed = 1;
                break;

            case DIRECTIONS.NE:
                this.xSpeed = -1;
                this.ySpeed = 1;
                break;
            case DIRECTIONS.NW:
                this.xSpeed = 1;
                this.ySpeed = 1;
                break;
            case DIRECTIONS.SE:
                this.xSpeed = -1;
                this.ySpeed = -1;
                break;
            case DIRECTIONS.SW:
                this.xSpeed = 1;
                this.ySpeed = -1;
                break;
        }
    }

    setOppositDirection() {
        if (this.direction === DIRECTIONS.N) {
            this.direction = DIRECTIONS.S;
        } else if (this.direction === DIRECTIONS.S) {
            this.direction = DIRECTIONS.N;
        } else if (this.direction === DIRECTIONS.W) {
            this.direction = DIRECTIONS.E;
        } else if (this.direction === DIRECTIONS.E) {
            this.direction = DIRECTIONS.W;
        } else if (this.direction === DIRECTIONS.NE) {
            this.direction = DIRECTIONS.SW;
        } else if (this.direction === DIRECTIONS.SW) {
            this.direction = DIRECTIONS.NE;
        } else if (this.direction === DIRECTIONS.NW) {
            this.direction = DIRECTIONS.SE;
        } else if (this.direction === DIRECTIONS.SE) {
            this.direction = DIRECTIONS.NW;
        }
    }

    /**
     * Hard to understand shit
     */
    handleObstacle() {
       
    }
};
