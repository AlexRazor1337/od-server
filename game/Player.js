import Skill from "./Skill.js";
import Stats from "./Stats.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.id;
        this.name;

        this.worldX = 16 * 48;
        this.worldY = 16 * 48;
        this.direction;
        this.currentState;
        this.speed;

        this.stats = new Stats(this);

        this.skills = {
            'Base attack': new Skill(this, 'Base attack'),
            'Fireball': new Skill(this, 'Fireball'),
        }
    }

    serialize() {
        return {
            name: this.name,
            worldX: this.worldX,
            worldY: this.worldY,
            direction: this.direction,
            speed: this.speed,
            currentState: this.currentState,
            hp: this.stats.hp,
        }
    }

    unserialize(data) {
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.direction = data.direction;
        this.speed = data.speed;
        this.currentState = data.currentState;

        return this;
    }
}