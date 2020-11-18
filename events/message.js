class Message {

    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;

        const prefix = this.client.config.prefix;

        if (message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        const command = this.client.getCommand(cmd);
        if (!command) return;

        if(command.help.category === "Owner" && !this.client.config.owners.includes(message.author.id)){
            return message.channel.send(`${this.client.config.emojis.failed} | Hey ! This command is only allowed to bot developers`)
        }

        try {
            await command.run(message, args);
            this.client.logger.log(`${message.author.tag} ran the command ${command.name}`, 'cmd')
        } catch(e) {
            console.error(e);
            return message.channel.send(`${this.client.config.emojis.failed} | Something went wrong while executing command "**${cmd}**"!`);
        }
    }

}

module.exports = Message;