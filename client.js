let socket;

const init = async () => {
    const SERVER_URL = await fetch(`${window.location.origin}/api/server-url`)
        .then((res) => res.json())
        .then((data) => data.SERVER_URL);

    socket = io.connect(SERVER_URL);
    const initdData = await socket.emitWithAck('init', {
        playerName: player.name
    });

    orbs = initdData.orbs;
    player.index = initdData.index;

    setInterval(() => {
        socket.emit('client-tick', {
            xVector: player.xVector ? player.xVector : .1,
            yVector: player.yVector ? player.yVector : .1,
        });
    }, 1000 / 30);

    player.x = Math.floor(Math.random() * WW);
    player.y = Math.floor(Math.random() * WH);
    draw();

    socket.on('tick', (newPlayers) => {
        players = newPlayers;

        if (players[player.index].playerData) {
            player.x = players[player.index].playerData.x;
            player.y = players[player.index].playerData.y;
        }
    });

    // On disconnect, refresh the page
    socket.on('disconnect', () => {
        window.location.href = window.location.href + '/';
    });
}
