import { io } from '../server.js'

const players = {};
let world = {};

const initGame = () => {
    world = {}
}

setInterval(() => {
    if (Object.keys(players).length > 0) {
        io.to('game').emit('tick', players);
    }
}, Math.floor(1000 / 30));

io.on('connect', (socket) => {
    let player = {};
    socket.on('init', (data, callback) => {
        socket.join('game');
        player = {
            id: socket.id,
            name: data.playerName,
            worldX: Math.floor(Math.random() * 10) + 6,
            worldY: Math.floor(Math.random() * 10) + 6,
        };
        players[data.playerName] = player;

        callback({
           player,
           players,
           world,
        });
    });

    socket.on('client-tick', (data) => {
        console.log('client-tick', data)
        players[player.name].worldX = data.worldX;
        players[player.name].worldY = data.worldY;
        players[player.name].direction = data.direction;

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
