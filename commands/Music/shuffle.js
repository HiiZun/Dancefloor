const Command = require("../../Base/Command");

class Shuffle extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      description: "Shuffle the queue.",
      aliases: ["shuf"],
      usage: ["shuffle"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`${this.client.msgemojis.no} | There is no music playing on this server !`);


    this.client.player.shuffle(message.guild.id);

    return message.channel.send(`${this.client.msgemojis.yes} | Queue shuffled !`);
  }
}

module.exports = Shuffle;
