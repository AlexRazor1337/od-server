import { io } from '../server.js';
import Game from '../game/Game.js';
import Player from '../game/Player.js';
import { CLIENT_CAST_SKILL, CLIENT_TICK, DISCONNECT, INIT, SERVER_TICK, CONNECT } from '../public/emits.js';

const game = new Game();

setInterval(() => {
  if (Object.keys(game.players).length > 0) {
    let mobs = {};
    for (let i = 0; i < game.spawners.length; i++) {
      mobs = {...mobs, ...game.spawners[i].mobs};
    }

    io.to('game').emit(SERVER_TICK, {
      mobs: mobs,
      players: game.players,
    });
  }
}, 1000 / 40);

io.on(CONNECT, (socket) => {
  let player = new Player(game);

  socket.on(INIT, (data, callback) => {
    socket.join('game');

    player.id = socket.id;
    player.name = data.playerName;

    game.players[data.playerName] = player.serialize();
    
    let mobs = {};
    for (let i = 0; i < game.spawners.length; i++) {
      mobs = {...mobs, ...game.spawners[i].mobs};
    }

    callback({
      player: player.serialize(),
      players: game.players,
      mobs: mobs,
    });
  });

  socket.on(CLIENT_TICK, (data) => {
    if (process.env.NODE_ENV === 'development') {
      //console.log(CLIENT_TICK, data);
    }
    game.players[player.name] = player.unserialize(data).serialize();
  });

  socket.on(CLIENT_CAST_SKILL, (data) => {
    let mob = game.mobs[data.enemy];
    const skill = player.skills[data.skill];

    if (mob) {
      mob.hp -= skill.damage;
      mob.spawner.mobs[mob.name] = mob.serialize();

      if (mob.hp <= 0) {
        delete mob.spawner.mobs[data.enemy];
        delete game.mobs[data.enemy];
      }
    }
  });

  socket.on(DISCONNECT, (data) => {
    delete game.players[player.name];
  });
});

game.start();

export default io;
