import { TileConfigs } from "../public/src/DTO/TileConfigs.js";

export const TILE_SIZE = 48;

export default class Tile {
    /**
     * @param {Game} game reference to game
     * @param {Object} config
     */
    constructor(game, config) {
        this.game = game;
        /*
            Sets during sprite loading inside animation.
            Some layers can be passable and some cannot.
            If at least 1 layer is not passable then entire tile
            becomes impassable.
        */
        this.isPassable = true;

        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.worldX = config.indexX * TILE_SIZE;
        this.worldY = config.indexY * TILE_SIZE;

        this.indexX = config.indexX;
        this.indexY = config.indexY;

        config.layers.forEach(layer => {
            if (this.isPassable) {
                this.isPassable = TileConfigs[layer].isPassable;
            }
        });
    }
}