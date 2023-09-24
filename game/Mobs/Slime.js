import Mob from "./Mob.js";

export default class Slime extends Mob {
    constructor(spawner, config = {}) {
        super(spawner, config);

        const spawnerCenterX = spawner.getCenterX();
        const spawnerCenterY = spawner.getCenterY();

        this.height = 22;
        this.width = 36;

        this.worldX = spawnerCenterX - this.width / 2;
        this.worldY = spawnerCenterY - this.height / 2;

        this.name = 'Slime_' + makeid(10);
        this.lvl = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    }
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}