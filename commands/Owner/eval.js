const Command = require("../../Base/Command");

class Eval extends Command {

    constructor(client) {
        super(client, {
            name: "eval",
            aliases: ["ev", "exec"],
            description: "Execute code"
        });
    }

    async run(message, args) {
        if (!this.client.config.owners.includes(message.author.id)) return;
        if (args.join(" ").startsWith("exec") || args.join(" ").startsWith("--exec") || args.join(" ").startsWith("-ex")) {
        const { exec } = require("child_process");
        exec(args.slice(1).join(" "), (err, stdout, stderr) => {
                try {
                    if (err) message.channel.send(`\`\`\`bash\n${err}\`\`\``);
                    if (stdout) message.channel.send(`\`\`\`bash\n${stdout}\`\`\``);
                    if (stderr) message.channel.send(`\`\`\`bash\n${stderr}\`\`\``);
                } catch (e) {
                    return message.channel.send(`\`\`\`\n${e.message}\`\`\``);
                }
            });
        } else {
            try {
                let evaled = await eval(args.join(" "));
                if (typeof evaled !== "string") {
                        evaled = require("util").inspect(evaled, { depth: 0 });
                }
                message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
            } catch (e) {
                return message.channel.send(`\`\`\`js\n${e.message}\`\`\``);
            }
        }
    }

}

module.exports = Eval;