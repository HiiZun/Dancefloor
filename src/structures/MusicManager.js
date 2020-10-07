const { Collection } = require("discord.js");
const { Manager } = require("@lavacord/discord.js");
const { Rest } = require("lavacord");
const { select } = require("./NodeSelector")
const Queue = require("./Queue");

/**
 * @class MusicManager
 */
class MusicManager {
    /**
     * @param {import("./Dancefloor")} client
     */
    constructor(client) {
        this.client = client;
        this.startedNodes = [];
        this.manager = new Manager(client, client.config.nodes,  {
            user: client.user.id,
            shards: client.shard ? client.shard.count : 1
        });
        this.manager.connect();
        
        this.queue = new Collection();

        this.manager.on("ready", node => {
            console.log(`[Node : ${node.id}] connected !`)
            this.startedNodes.push({ "id":node.id, "host":node.host, "port":node.port, "password":node.password, "stats":node.stats })
        }).on("disconnect", (wsevent, node) => {
            console.log(`[Node : ${node.id}] disconnected: ${wsevent}`)
        }).on("error", (err, node) => {
            console.log(`[Node : ${node.id}] Error: ${err}`) 
        }).on("reconnecting", (node) => {
            console.log(`[Node : ${node.id}] Reconnecting...`) 
        })


    }

    async handleVideo(message, voiceChannel, song) {
        if(!this.startedNodes.length) return message.channel.send("Oops there is no audio sending server available !")
        const serverQueue = this.queue.get(message.guild.id);
        song.requestedBy = message.author;
        if (!serverQueue) {
            console.log(this.startedNodes)
            const queue = new Queue(this.client, {
                textChannel: message.channel,
                voiceChannel,
                node: select(this.client, this.startedNodes)
            });
            queue.songs.push(song);
            this.queue.set(message.guild.id, queue);

            try {
                const player = await this.manager.join({
                    channel: voiceChannel.id,
                    guild: message.guild.id,
                    node: await queue.getNode()
                }, {
                    selfdeaf: true
                });
                queue.setPlayer(player);
                this.play(message.guild, song);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                this.queue.delete(message.guild.id);
                this.manager.leave(message.guild.id);
                message.channel.send(`I could not join the voice channel: ${error.message}`);
            }
        } else {
            serverQueue.songs.push(song);
            message.channel.send(`Successfully added **${song.info.title}** to the queue!`);
        }
    }

    play(guild, song) {
        const serverQueue = this.queue.get(guild.id);
        if (!song) {
            serverQueue.textChannel.send("Queue is empty! Leaving voice channel..");
            this.manager.leave(guild.id);
            this.queue.delete(guild.id);
        } else {
            serverQueue.player.play(song.track);
            serverQueue.player
                .once("error", console.error)
                .once("end", data => {
                    if (data.reason === "REPLACED") return;
                    const shiffed = serverQueue.songs.shift();
                    if (serverQueue.loop === true) {
                        serverQueue.songs.push(shiffed);
                    }
                    this.play(guild, serverQueue.songs[0]);
                });
            serverQueue.player.volume(serverQueue.volume);
            serverQueue.textChannel.send(`Now playing: **${song.info.title}** by *${song.info.author}*`);
        }
    }

    async getSongs(query) {
        const node = this.manager.nodes.get(select(this.client, this.startedNodes));
        const result = await Rest.load(node, query);
        return result.tracks;
    }
}

module.exports = MusicManager;