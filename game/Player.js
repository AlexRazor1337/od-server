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
        };
    }

    /**
     * @param {String} mobName id 
     * @param {String} skillName id
     */
    attackMob(mobName, skillName) {
        /**
         * @var {Mob} mob
         */
        let mob = this.game.mobs[mobName];
        const skill = this.skills[skillName];

        if (mob) {
            mob.hp -= skill.damage;
            mob.spawner.mobs[mob.name] = mob.serialize();
      
            if (mob.hp <= 0) {
              delete mob.spawner.mobs[mobName];
              delete this.game.mobs[mobName];
            }
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
        };
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