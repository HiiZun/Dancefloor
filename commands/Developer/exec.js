const Command = require("../../Base/Command");
const { exec } = require("child_process");

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: "exec",
      description: "Executes a command in terminal.",
      usage: ["exec <command>"],
      aliases: ["execute", "cmd", "terminal"],
      permissions: ["Developer"]
    });
  }

  async execute(message, args, Discord) {
    if (!this.client.config.admin.includes(message.author.id))
      return message.channel.send("nope...");
    try {
      message.channel.startTyping();
      exec(args.join(" ") || "date", function(err, stdout, stderr) {
        if (err) {
          const emErr = new Discord.MessageEmbed()
            .setAuthor(`Command Executed!`)
            .addField(`📥 INPUT 📥`, `\`\`\`xl\n${args.join(" ")}\`\`\``)
            .addField(
              `📤 OUTPUT 📤`,
              `\`\`\`xl\n${err.toString().substr(0, 1000)}\n\`\`\``
            )
            .setTimestamp()
            .setColor("#FF0000")
            .setFooter(`Requested by: ${message.author.tag}`);
          message.channel.stopTyping(true);
          return message.channel.send(emErr);
        }
        const emSuccess = new Discord.MessageEmbed()
          .setAuthor(`Command Executed!`)
          .addField(`📥 INPUT 📥`, `\`\`\`xl\n${args.join(" ")}\`\`\``)
          .addField(`📤 OUTPUT 📤`, `\`\`\`xl\n${stdout}\n\`\`\``)
          .setTimestamp()
          .setColor(123456)
          .setFooter(`Requested by: ${message.author.tag}`);
        message.channel.stopTyping(true);
        return message.channel.send(emSuccess).catch(err => {
          const emSuccess = new Discord.MessageEmbed()
            .setAuthor(`Command Executed!`)
            .addField(`📥 INPUT 📥`, `\`\`\`xl\n${args.join(" ")}\`\`\``)
            .addField(
              `📤 OUTPUT 📤`,
              `\`\`\`xl\n${stdout.substr(0, 1000)}\n\`\`\``
            )
            .setTimestamp()
            .setColor(123456)
            .setFooter(`Requested by: ${message.author.tag}`);
          message.channel.send(emSuccess);
          return message.channel.stopTyping(true);
        });
      });
    } catch (err) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Command Executed!`)
        .addField(`📥 INPUT 📥`, `\`\`\`xl\n${args.join(" ")}\`\`\``)
        .addField(`📤 OUTPUT 📤`, `\`\`\`xl\n${err.toString()}\n\`\`\``)
        .setTimestamp()
        .setColor("#FF0000")
        .setFooter(`Requested by: ${message.author.tag}`);
      message.channel.send(embed);
      return message.channel.stopTyping(true);
    }
  }
}

module.exports = Exec;
