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
        if (!message.member.voice.channel) return message.channel.send(`${this.client.config.emojis.failed} | You must join a voice channel to use this command.`);

        let track = args.join(" ")
        
        let song = await this.client.musicManager.getSongs(track);
        switch (song.loadType) {
            case "SEARCH_RESULT":
                this.client.musicManager.handleVideo(message, message.member.voice.channel, song.tracks[0]);
                break;
            case "NO_MATCHES":
                this.error(message, "there is no matching video with your query")
                break;
            case "LOAD_FAILED":
                this.error(message, "failed to load the track")
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
                this.error(message, "unknown error code")
                break;
        }
        

    }


    error(message, err) {
        return message.channel.send(`${this.client.config.emojis.failed} | Oops an error occured while tried to search: ${err}`)
     }

}

module.exports = Play;