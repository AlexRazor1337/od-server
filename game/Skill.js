import { SkillConfig } from "../public/src/DTO/SkillConfig.js";

export default class Skill {
    constructor(entity, name) {
        this.entity = entity;
        this.name = name;

        const config = SkillConfig[name];
        this.damage = config.damage;
        this.lvl = config.lvl;
        this.mpDrain = config.mp_drain;
        this.hpDrain = config.hp_drain;
        this.cooldown = config.cooldown;
        this.castTime = config.cast_time;
        this.isCastingNow = false;

        this.timer = 0;
    }
}