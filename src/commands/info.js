const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "info",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
    if (err) {
        message.channel.send("failed to fetch current branch !")
    }

    let branch, version;


    if(typeof stdout === "string"){
        branch = stdout.trim()
    }

    version = require("../../package.json").version

    let embed = new MessageEmbed()
    .setDescription(`${client.user.tag} is an instance of Dancefloor [GitHub](${require("../../package.json").repository.url}) created with <3 by HiiZun (/!\\ REMOVING THIS LIGNE WILL REMOVE YOU THE RIGHT TO USE THIS PROJECT /!\\)`)
    .addField("Branch", branch)
    .addField("Version", version)
    .addField("Users cached", client.users.cache.size)
    .addField("Guilds cached", client.guilds.cache.size)
    .addField("Running Audio nodes", client.musicManager.startedNodes.length)
    .addField("All Audio nodes", client.config.nodes.length)

message.channel.send(embed)
});



    }
};