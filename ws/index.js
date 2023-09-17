import { io } from '../server.js'

const settings = {
    worldHeight: parseInt(process.env.WORLD_HEIGHT),
    worldWidth: parseInt(process.env.WORLD_WIDTH),
    orbRadius: parseInt(process.env.DEFAULT_SIZE),
    orbCount: parseInt(process.env.ORB_COUNT),
    defaultZoom: parseFloat(process.env.DEFAULT_ZOOM),
    defaultSpeed: parseInt(process.env.DEFAULT_SPEED)
};

const players = [];
let world = {};

const initGame = () => {
    world = {}
}

setInterval(() => {
    if (players.length > 0) {
        io.to('game').emit('tick', players);
    }
}, Math.floor(1000 / 30));

io.on('connect', (socket) => {
    let player = {};
    socket.on('init', (data, callback) => {
        socket.join('game');
        player = new Player(socket.id);
        players.push(player);

        callback({
           player,
           players,
           world,
        });
    });

    socket.on('client-tick', (data) => {
        const speed = 6;
        const xV = player.playerConfig.xVector = data.xVector;
        const yV = player.playerConfig.yVector = data.yVector;

        if ((player.playerData.x > 5 && xV < 0) || (player.playerData.x < settings.worldWidth) && (xV > 0)) {
            player.playerData.x += speed * xV;
        }
        if ((player.playerData.y > 5 && yV > 0) || (player.playerData.y < settings.worldHeight) && (yV < 0)) {
            player.playerData.y -= speed * yV;
        }

        const capturedPlayerData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers, socket.id);
        if (capturedPlayerData) {
            io.to('game').emit('player-absorb', capturedPlayerData);
            io.to('game').emit('update-leaderboard', getLeaderboard());
        }
    });

    socket.on('disconnect', (data) => {
        players.forEach((player, index) => {
            if (socket.id === player.socketId) {
                players.splice(index, 1, {});
            }
        });
    });
});

initGame();

export default io;
