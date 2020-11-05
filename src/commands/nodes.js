const { MessageEmbed } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "nodes",
    run: async (client, message, args) => {

        message.channel.send("Fetching nodes status please wait...").then((msg) => {

            let embed = new MessageEmbed()
            .setDescription("List of available audio nodes")
            client.musicManager.startedNodes.forEach(node => {
                embed.addField(`🟢 - ${node.id}`,`
ID: **${node.id}**
Playing streams: **${node.stats.playingPlayers}**
Uptime: **${ms(node.stats.uptime, { long: true })}**
`)
            });

msg.edit("", {
    embed: embed,
    content: null
})
        })

    },
};