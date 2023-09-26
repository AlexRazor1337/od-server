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
        this.handleMapBorders();
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
        let worldY = this.worldY;
        let worldX = this.worldX;

        if (this.xSpeed > 0) {
            worldX += 1;
            /*
                Find indexes of upper and lower right tiles 
             */
            const minIndexYOffset = worldY % TILE_SIZE;
            const maxIndexYOffset = (worldY + this.height - 1) % TILE_SIZE;
            const minIndexY = (worldY - minIndexYOffset) / TILE_SIZE;
            const maxIndexY = (worldY + this.height - 1 - maxIndexYOffset) / TILE_SIZE;

            /*
                Get right point of sprite
            */
            const xOffset = (worldX + this.width - 1) % TILE_SIZE;
            const rightIndexX = ((worldX + this.width - 1) - xOffset) / TILE_SIZE;

            /*
                Find every tile on the right side.
                For player with height 48 it can be 1 or 2 tiles.
                Min and max index can be the same.
            */
            let tiles = [];
            for (let i = minIndexY; i <= maxIndexY; i++) {
                let tile = this.spawner.game.world.getTile(rightIndexX, i);
                if (tile) {
                    tiles.push(tile);
                }
            }

            /*
                If at least 1 tile is not passable set xSpeed as 0
            */
            tiles.forEach(tile => {
                if (!tile.isPassable) {
                    this.xSpeed = 0;
                }
            });
        } else if (this.xSpeed < 0) {
            worldX -= 1;
            /*
                Find indexes of upper and lower right tiles 
             */
            const minIndexYOffset = worldY % TILE_SIZE;
            const maxIndexYOffset = (worldY + this.height - 1) % TILE_SIZE;
            const minIndexY = (worldY - minIndexYOffset) / TILE_SIZE;
            const maxIndexY = (worldY + this.height - 1 - maxIndexYOffset) / TILE_SIZE;

            /*
                Get right point of sprite
            */
            const xOffset = worldX % TILE_SIZE;
            const leftIndexX = (worldX - xOffset) / TILE_SIZE;

            /*
                Find every tile on the right side.
                For player with height 48 it can be 1 or 2 tiles.
                Min and max index can be the same.
            */
            let tiles = [];
            for (let i = minIndexY; i <= maxIndexY; i++) {
                let tile = this.spawner.game.world.getTile(leftIndexX, i);

                if (tile) {
                    tiles.push(tile);
                }
            }

            /*
                If at least 1 tile is not passable set xSpeed as 0
            */
            tiles.forEach(tile => {
                if (!tile.isPassable) {
                    this.xSpeed = 0;
                }
            });
        }

        if (this.ySpeed > 0) {
            worldY += 1;
            /*
                Find indexes of lower left and right tiles 
             */
            const minIndexXOffset = worldX % TILE_SIZE;
            const maxIndexXOffset = (worldX + this.width - 1) % TILE_SIZE;
            const minIndexX = (worldX - minIndexXOffset) / TILE_SIZE;
            const maxIndexX = (worldX + this.width - 1 - maxIndexXOffset) / TILE_SIZE;

            /*
                Get right point of sprite
            */
            const yOffset = (worldY + this.height - 1) % TILE_SIZE;
            const indexY = ((worldY + this.height - 1) - yOffset) / TILE_SIZE;

            /*
                Find every tile on the right side.
                For player with height 48 it can be 1 or 2 tiles.
                Min and max index can be the same.
            */
            let tiles = [];
            for (let i = minIndexX; i <= maxIndexX; i++) {
                let tile = this.spawner.game.world.getTile(i, indexY);
                if (tile) {
                    tiles.push(tile);
                }
            }

            /*
                If at least 1 tile is not passable set xSpeed as 0
            */
            tiles.forEach(tile => {
                if (!tile.isPassable) {
                    this.ySpeed = 0;
                }
            });
        } else if (this.ySpeed < 0) {
            worldY -= 1;
            /*
                Find indexes of lower left and right tiles 
             */
            const minIndexXOffset = worldX % TILE_SIZE;
            const maxIndexXOffset = (worldX + this.width - 1) % TILE_SIZE;
            const minIndexX = (worldX - minIndexXOffset) / TILE_SIZE;
            const maxIndexX = (worldX + this.width - 1 - maxIndexXOffset) / TILE_SIZE;

            /*
                Get right point of sprite
            */
            const yOffset = worldY % TILE_SIZE;
            const indexY = (worldY - yOffset) / TILE_SIZE;

            /*
                Find every tile on the right side.
                For player with height 48 it can be 1 or 2 tiles.
                Min and max index can be the same.
            */
            let tiles = [];
            for (let i = minIndexX; i <= maxIndexX; i++) {
                let tile = this.spawner.game.world.getTile(i, indexY);
                
                if (tile) {
                    tiles.push(tile);
                }
            }

            /*
                If at least 1 tile is not passable set xSpeed as 0
            */
            tiles.forEach(tile => {
                if (!tile.isPassable) {
                    this.ySpeed = 0;
                }
            });
        }
    }

    handleMapBorders() {
        if (this.wordlX <= 0) {
            this.wordlX = 0;
        }
        if (this.wordlX >= this.spawner.game.world.worldXSize * 48 - this.width) {
            this.wordlX = this.game.width - this.width;
        }

        if (this.wordlY <= 0) {
            this.wordlY = 0;
        }
        if (this.wordlY >= this.spawner.game.world.worldYSize * 48 - this.height) {
            this.wordlY = this.game.height - this.height;
        }
    }
};
