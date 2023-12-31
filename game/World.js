import Tile from "./Tile.js";

export default class World {
    constructor(game, tiles = []) {
        this.game = game;

        this.worldXSize = Math.max(...tiles.map(item => item.indexX));
        this.worldYSize = Math.max(...tiles.map(item => item.indexY));

        this.minWorldX = 0;
        this.minWorldY = 0;

        this.tiles = new Array(this.worldXSize + 1).fill(null).map(() => new Array(this.worldYSize + 1).fill(null));

        tiles.forEach(item => {
            this.tiles[item.indexX][item.indexY] = new Tile(this.game, item);;
        });

        this.referenceTile = this.tiles[0][0];
    }

        /**
     * Safe way to get tile
     * 
     * @param {Number} indexX 
     * @param {Number} indexY 
     */
        getTile(indexX, indexY) {
            if (
                indexX < 0 || 
                indexY < 0 ||
                indexX >= this.worldXSize ||
                indexY >= this.worldYSize
            ) {
                return null;
            }
    
            return this.tiles[indexX][indexY];
        }
}