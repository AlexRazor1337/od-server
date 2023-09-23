import { io } from '../server.js';
import Game from '../game/Game.js';

const game = new Game();

let entities = [

];
const players = {};
let world = {};

let spawners = [];

const initGame = () => {
  world = {};
};

setInterval(() => {
  if (Object.keys(players).length > 0) {
    io.to('game').emit('tick', players);
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
    players[data.playerName] = player;

    callback({
      player,
      players,
      world,
    });
  });

  socket.on('client-tick', (data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('client-tick', data);
    }
    players[player.name].worldX = data.worldX;
    players[player.name].worldY = data.worldY;
    players[player.name].direction = data.direction;
    players[player.name].currentState = data.currentState;
    players[player.name].speed = data.speed;

    // const capturedPlayerData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers, socket.id);
    // if (capturedPlayerData) {
    //     io.to('game').emit('player-absorb', capturedPlayerData);
    //     io.to('game').emit('update-leaderboard', getLeaderboard());
    // }
  });

  socket.on('disconnect', (data) => {
    delete players[player.name];
  });
});

initGame();

export default io;
