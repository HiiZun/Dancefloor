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
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    //Get song
    const song = await client.player.resume(message.guild.id);

    //If there's no music
    if(!song) return message.channel.send(`No songs currently playing !`);

    //Message
    message.channel.send(`Song ${song.name} resumed !`);
  }
}

module.exports = Skip;
