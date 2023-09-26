import { io } from '../server.js';
import Game from '../game/Game.js';
import Skill from '../game/Skill.js';

const game = new Game();

setInterval(() => {
  if (Object.keys(game.players).length > 0) {
    let mobs = {};
    for (let i = 0; i < game.spawners.length; i++) {
      mobs = {...mobs, ...game.spawners[i].mobs};
    }

    io.to('game').emit('tick', {
      mobs: mobs,
      players: game.players,
    });
  }
}, 1000 / 40);

io.on('connect', (socket) => {
  let player = {};

  socket.on('init', (data, callback) => {
    socket.join('game');
    player = {
      id: socket.id,
      name: data.playerName,
      worldX: 16 * 48,
      worldY: 16 * 48,
    };
    game.players[data.playerName] = player;
    
    let mobs = {};
    for (let i = 0; i < game.spawners.length; i++) {
      mobs = {...game.spawners[i].mobs};
    }

    callback({
      player,
      players: game.players,
      mobs: mobs,
    });
  });

  socket.on('client-tick', (data) => {
    if (process.env.NODE_ENV === 'development') {
      //console.log('client-tick', data);
    }
    game.players[player.name].worldX = data.worldX;
    game.players[player.name].worldY = data.worldY;
    game.players[player.name].direction = data.direction;
    game.players[player.name].currentState = data.currentState;
    game.players[player.name].speed = data.speed;

    // const capturedPlayerData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers, socket.id);
    // if (capturedPlayerData) {
    //     io.to('game').emit('player-absorb', capturedPlayerData);
    //     io.to('game').emit('update-leaderboard', getLeaderboard());
    // }
  });

  socket.on('client-player-casts-skill', (data) => {
    let mob = game.mobs[data.enemy];
    let skill = new Skill(player, data.skill);

    if (mob) {
      mob.hp -= skill.damage;
      mob.spawner.mobs[mob.name] = mob.serialize();

      if (mob.hp <= 0) {
        delete mob.spawner.mobs[data.enemy];
        delete game.mobs[data.enemy];
      }
    }
  });

  socket.on('disconnect', (data) => {
    delete game.players[player.name];
  });
});

game.start();

export default io;
