module.exports = {
    name: "resume",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send("Queue is empty!");
        serverQueue.songs = shuffle(serverQueue.songs)
        return message.channel.send(`Queue shuffled !`)
    }
};

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}