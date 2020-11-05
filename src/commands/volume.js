module.exports = {
    name: "volume",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!args[0]) {
            message.channel.send(`Current volume: **${serverQueue.volume}%**.`);
        } else {
            const value = args[0];
            if (isNaN(value)) return message.channel.send("Make sure the value is a number.");
            if(parseInt(value) > 250) return message.channel.send("Volume limit reached (250%)")
            if(parseInt(value) < 0) return message.channel.send("Invalid value (less than 0%)")
            serverQueue.setVolume(parseInt(value));
            message.channel.send(`New volume: **${value}%**.`);
        }
    }
};