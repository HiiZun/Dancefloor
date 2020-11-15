const Command = require("../../Base/Command");
const Dancefloor = require("../../Base/Dancefloor")
const {MessageEmbed, Client} = require("discord.js")

class Play extends Command {

    constructor(client) {
        super(client, {
            name: "play",
            aliases: ["p"],
            description: "Play a music from Youtube, SoundCloud, Mixer (rip peace), Twitch, HTTP Streams and many more !"
        });
    }

    async run(message, args) {
        if (!message.member.voice.channel) return message.channel.send("You must join a voice channel to use this command.");

        let track = args.join(" ")
        
        let song = await this.client.musicManager.getSongs(track);
        switch (song.loadType) {
            case "SEARCH_RESULT":
                this.client.musicManager.handleVideo(message, message.member.voice.channel, song.tracks[0]);
                break;
            case "NO_MATCHES":
                error("there is no matching video with your query")
                break;
            case "LOAD_FAILED":
                error("failed to load the track")
                break;
            case "PLAYLIST_LOADED":
                let selected = song.playlistInfo.selectedTrack;

                if (selected !== -1)
                  return [ song.tracks[selected] ];
      
                let playlist = song.tracks.slice(0, 200);
                this.client.musicManager.handleVideo(message, message.member.voice.channel, playlist);
                break;
            case "TRACK_LOADED":
                this.client.musicManager.handleVideo(message, message.member.voice.channel, song.tracks[0]);
                break;
            default:
                error("unknown error code")
                break;
        }
        
function error(err) {
   return message.channel.send(`Oops an error occured while tried to search: ${err}`)
}






    }

}

module.exports = Play;