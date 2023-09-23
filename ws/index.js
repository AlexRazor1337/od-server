import { io } from '../server.js';
import Game from '../game/Game.js';

const game = new Game();

setInterval(() => {
  if (Object.keys(game.players).length > 0 || Object.keys(game.mobs).length > 0) {
    io.to('game').emit('tick', {
      mobs: game.mobs,
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

    callback({
      player,
      players: game.players,
      mobs: game.mobs,
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

  socket.on('disconnect', (data) => {
    delete game.players[player.name];
  });
});

game.start();

export default io;
