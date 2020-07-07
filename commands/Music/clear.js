const Command = require("../../Base/Command");

class Clear extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "Clear the queue, and end the playing.",
      aliases: ["clear-queue", "clearqueue", "queueclear", "clr", "c"],
      usage: ["clear"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    if(!client.player.isPlaying(message.guild.id)) return message.channel.send(`No music playing on this server !`);

    client.player.clearQueue(message.guild.id);

    message.channel.send(`Queue cleared !`);
  }
}

module.exports = Clear;
