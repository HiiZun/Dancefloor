const Command = require("../../Base/Command");

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "get the waiting queue.",
      aliases: ["list", "q"],
      usage: ["queue"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
 if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

 const queue = this.client.player.getQueue(message.guild.id);

 if(!queue) return message.channel.send(`${this.client.msgemojis.no} | I'm not playing any music, please make me playing something with before !`);

 message.channel.send(`**Server queue**\nCurrent - ${queue.playing.name} | ${queue.playing.author}\n`+
 (
     queue.tracks.map((track, i) => {
         return `#${i+1} - ${track.name} | ${track.author}`
     }).join('\n')
 ), { split:true });
  }
}

module.exports = Queue;
