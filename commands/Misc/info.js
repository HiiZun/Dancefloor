const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")
class Info extends Command {

    constructor(client) {
        super(client, {
            name: "info",
            aliases: [],
            description: "Show informations about the bot"
        });
    }

    async run(message, args) {
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
    .setDescription(`${this.client.user.tag} is an instance of Dancefloor [GitHub](${require("../../package.json").repository.url}) created with <3 by [HiiZun](https://github.com/HiiZun)`)
    .addField("Branch", branch)
    .addField("Version", version)
    .addField("Owner(s)", this.client.config.owners.map(o => this.client.users.cache.get(o).tag||o))
    .addField("Users cached", this.client.users.cache.size)
    .addField("Guilds cached", this.client.guilds.cache.size)
    .addField("Running Audio nodes", this.client.musicManager.startedNodes.length)
    .addField("All Audio nodes", this.client.config.nodes.length)
    .setColor("GREEN")

message.channel.send(embed)
});
    }

}

module.exports = Info;