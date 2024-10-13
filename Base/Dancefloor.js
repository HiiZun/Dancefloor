const { Client: DiscordClient, Collection, REST, Routes, Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const Logger = require("./Logger");
const {Riffy} = require("riffy");
const pkg = require("../package.json");
const nodes = require("../nodes.json");
const {Classic} = require("musicard")


class Client extends DiscordClient {

    constructor(...args) {
        super(...args);
        this.riffy;
        this.initMusic();
        this.registerSlashCommands();
        this.registerEvents();
        this.auth(process.env.TOKEN||"TOKEN");
    }

    async initMusic() {
       this.riffy = new Riffy(this, require("../nodes.json"), {
           send: (payload) => {
               const guild = this.guilds.cache.get(payload.d.guild_id);
               if (guild) guild.shard.send(payload);
           },
           defaultSearchPlatform: "ytmsearch",
           reconnectTimeout: 5000,
           reconnectTries: 3,
           restVersion: "v4", // Or "v3" based on your Lavalink version.
       }).on("error", (error) => {
              Logger.log(`Riffy Error: ${error}`, "error");
       }).on('debug', (message) => {
             // Logger.log(`Riffy Debug: ${message}`, "debug");
         }).on('nodeConnect', (node) => {
                Logger.log(`Riffy Node Connected: ${node}`, "debug");
             }).on('nodeError', (node, error) => {
                Logger.log(`Riffy Node Error: ${node} - ${error}`, "error");
             }).on('nodeReconnect', (node) => {
                Logger.log(`Riffy Node Reconnecting: ${node}`, "debug");
             }).on('nodeDisconnect', (node, reason) => {
                Logger.log(`Riffy Node Disconnected: ${node} - ${reason.toString()}`, "warn");
             }).on('trackStart', async (player, track) => {
                Logger.log(`Riffy Track Start: ${track.info.author} - ${track.info.title}`, "debug");

                    let {embed, file: buffer} = await this._getNPEmbed(player, track);

                    let channel = await this.channels.cache.get(player.textChannel);

                    await channel.send({
                    embeds: [embed],                   
                    files: [{
                        attachment: buffer,
                        name: 'music.png'
                    }]
                }).then((msg) => {
                    track['messageId'] = msg.id;
                })

             }).on('trackEnd', (player, track, reason) => {
                Logger.log(`Riffy Track End`, "debug");
                
                // remove the message id from the track object

                if(track.messageId) {
                    try {
                    let channel = this.channels.cache.get(player.textChannel);
                    channel.messages.fetch(track.messageId).then((msg) => {
                        msg.delete();
                    });
                } catch (error) {
                    Logger.log(`Error while deleting message: ${error}`, "error");
                }
                }

             }).on('queueEnd', (player) => {
                Logger.log(`Riffy Queue End.`, "debug");

                //autoplay
                if(player.autoplaymode) {
                    player.autoplay(player)
                } else {
                    player.destroy();
                }

                // send a message to the text channel
                let channel = this.channels.cache.get(player.textChannel);
                channel.send("Queue has ended.");

             }).on('playerPause', (player) => {
                Logger.log(`Riffy Player Pause`, "debug");
             }).on('playerResume', (player) => {
                Logger.log(`Riffy Player Resume`, "debug");
             }).on('playerUpdate', (player, state) => {
                Logger.log(`Riffy Player Update`, "debug");

                if(Math.random() > 0.3) return;
                if(player.current && player.current.messageId) {
                    console.log("Updating message") 
                    this._getNPEmbed(player, player.current).then(({embed, file: buffer}) => {
                        console.log("Got data")
                        let channel = this.channels.cache.get(player.textChannel);
                        channel.messages.fetch(player.current.messageId).then((msg) => {
                            msg.edit({
                                embeds: [embed],
                                files: [{
                                    attachment: buffer,
                                    name: 'music.png'
                                }]
                            });
                        });
                    });
                }

             }).on('playerDestroy', (player) => {
                Logger.log(`Riffy Player Destroy: ${player.guild}`, "debug");
             }).on('playerConnect', (player) => {
                Logger.log(`Riffy Player Connect: ${player.guild}`, "debug");
             }).on('playerDisconnect', (player) => {
                Logger.log(`Riffy Player Disconnect: ${player.guild}`, "debug");
             }).on('playerError', (player, error) => {
                Logger.log(`Riffy Player Error: ${player.guild} - ${error}`, "error");
             });
            

            this.on("raw", (d) => this.riffy.updateVoiceState(d));
    }

    async registerSlashCommands() {
        this.commands = [];
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        if(commandFiles.length === 0) return Logger.log("No commands found", "warn");
        for (const file of commandFiles) {
            try {
                Logger.log(`Loading command ${file}`, "debug");
                const command = require(`../commands/${file}`);
                this.commands.push(await command.data.toJSON());
            } catch (error) {
                Logger.log(`Error while loading command ${file}: ${error}`, "error");
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            Logger.log('Started refreshing application (/) commands.', "debug");
          
            await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: this.commands });
            await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID), { body: this.commands });
          
            Logger.log('Successfully reloaded application (/) commands.', "debug");
          } catch (error) {
            console.error(error);
          }

    }

    async registerEvents() {
        const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            try {
            Logger.log(`Loading event ${file}`, "debug");
            const event = require(`../events/${file}`);
            const eventName = file.split(".")[0];
            const EVENT = new event(this);
            this.on(Events[eventName], (...args) => EVENT.run(...args));
            } catch (error) {
                Logger.log(`Error while loading event ${file}: ${error}`, "error");
            }
        }
    }

    async _getNPEmbed(player, track) {
        
            return new Promise(async (resolve, reject) => {
                // get the progress of the track between 0 and 100
                let getProgress = await Math.floor(player.position / track.info.length*100);

                console.log(`Progress: ${getProgress}%`)
                // total time in MM:SS format
                let totalTime = "";
                let minutes = Math.floor(track.info.length / 60000);
                let seconds = ((track.info.length % 60000) / 1000).toFixed(0);
                totalTime = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                
                let currentTime = "";
                let currentMinutes = Math.floor(player.position / 60000);
                let currentSeconds = ((player.position % 60000) / 1000).toFixed(0);
                currentTime = currentMinutes + ":" + (currentSeconds < 10 ? '0' : '') + currentSeconds;

                console.log(totalTime)

                Classic({
                    thumbnailImage: track.info.thumbnail,
                    backgroundColor: '#000000',
                    progress: getProgress,
                    progressColor: '#FF7A00',
                    progressBarColor: '#5F2D00',
                    name: track.info.title,
                    nameColor: '#FF7A00',
                    author: track.info.author,
                    authorColor: '#696969',
                    startTime: currentTime,
                    endTime: totalTime,
                    timeColor: '#FF7A00',
                }).then((buffer) => {

                    return resolve({
                    embed: new EmbedBuilder() 
                        .setTitle("Now Playing")
                        .setDescription(`[${track.info.title}](${track.info.uri})`)
                        .setImage("attachment://music.png")
                        .setFooter({
                            text: `Requested by ${track.info.requester?.tag}`,
                            iconURL: track.info.requester?.displayAvatarURL({dynamic: true})
                        })
                        .setTimestamp(new Date()),
                    file: buffer
                    })
                    })   
                })       
    }

    auth(token = null) {
        return super.login(token);
    }

}

module.exports = Client;