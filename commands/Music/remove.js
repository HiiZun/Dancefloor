const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Remove extends Command {

    constructor(client) {
        super(client, {
            name: "remove",
            aliases: ["rem", "del"],
            description: "Remove a track from the queue."
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!args[0] || isNaN(args[0])) return message.channel.send("Please provide a number to select the video in the queue (see queue command)")

        let selection = parseInt(args[0])

       if(selection < 1) return message.channel.send("You can't give a number smaller than 1 !")
       if(selection == 1) return message.channel.send("Remove the current track is deprecated, please use the skip command to remove the current playing command !")
       if(selection > serverQueue.songs.length) return message.channel.send("You provided a number bigger than the number of videos in the queue !")


       selection = selection - 1

    try {
        message.channel.send(`Removed **${serverQueue.songs[selection].info.title||serverQueue.songs[selection].info.identifier}** from the queue.`);

        serverQueue.songs = serverQueue.songs.filter(s => serverQueue.songs.indexOf(s) != selection)


    } catch (e) {
        message.channel.send(`An error occured: ${e.message}.`);
    }

        }


}

module.exports = Remove;