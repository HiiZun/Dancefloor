const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class NowPlaying extends Command {

    constructor(client) {
        super(client, {
            name: "nowplaying",
            aliases: ["np", "now", "current", "now-playing"],
            description: "See the currently played track"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!serverQueue.playing) return message.channel.send("Player paused.");
        const currSong = serverQueue.songs[0];
        message.channel.send(`Now playing: **${currSong.info.title}** by **${currSong.info.author}**, requested by ${currSong.requestedBy.tag}`);
    }

}

module.exports = NowPlaying;