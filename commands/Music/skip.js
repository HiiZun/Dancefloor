const Command = require("../../Base/Command");

class Skip extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "Resume music after a pause.",
      aliases: [],
      usage: ["resume"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

    //Get song
    const song = await this.client.player.resume(message.guild.id);

    //If there's no music
    if(!song) return message.channel.send(`${this.client.msgemojis.no} | There is no songs currently playing !`);

    //Message
    message.channel.send(`${this.client.msgemojis.yes} | Song \`${song.name}\` skipped !`);
  }
}

module.exports = Skip;
