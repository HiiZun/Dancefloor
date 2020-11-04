const { Collection, MessageEmbed } = require("discord.js");
const { Manager } = require("@lavacord/discord.js");
const fetch = require("node-fetch")
const { select } = require("./NodeSelector")
const Queue = require("./Queue");
const { UV_FS_O_FILEMAP } = require("constants");

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
        this.manager.defaultRegions = {
            asia: ["sydney", "singapore", "japan", "hongkong"],
            eu: ["london", "frankfurt", "amsterdam", "russia", "eu-central", "eu-west"],
            us: ["us-central", "us-west", "us-east", "us-south", "brazil"]
        };
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

        if (!serverQueue) {
            const queue = new Queue(this.client, {
                textChannel: message.channel,
                voiceChannel,
                node: select(this.client, this.startedNodes).id
            });
            if(Array.isArray(song)){
                message.channel.send(`[Audioserver ${serverQueue.node} 🎶] Importing **${song.length}** videos, please wait...`)
                for (let i = 0; i < song.length; i++) {
                    const s = song[i];
                    s.requestedBy = message.author
                    queue.songs.push(s)
                }
            } else {
            song.requestedBy = message.author
            queue.songs.push(song);
            }
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
                this.play(message.guild, Array.isArray(song) ? song[0] : song);
            } catch (error) {
                console.error(`[Audioserver ${queue.getNode()} 🎶] I could not join the voice channel: ${error}`);
                message.channel.send(`[Audioserver ${queue.getNode()} 🎶] I could not join the voice channel: ${error.message}`);
                this.queue.delete(message.guild.id);
                this.manager.leave(message.guild.id);
            }
        } else {
            if(Array.isArray(song)){
                message.channel.send(`[Audioserver ${serverQueue.node} 🎶] Importing **${song.length}** videos, please wait...`)

                if(song.length + serverQueue.songs.length >= 200) return message.channel.send("Oops you reached the queue's limit (200) !")

                for (let i = 0; i < song.length; i++) {
                    const s = song[i];
                    s.requestedBy = message.author
                    serverQueue.songs.push(s)
                }
            } else {
                if(serverQueue.songs.length + 1 >= 200) return message.channel.send("Oops you reached the queue's limit (200) !")
            song.requestedBy = message.author
            serverQueue.songs.push(song);
            }
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
                console.log(song)
                let npembed = new MessageEmbed()
                .setTitle("Now Playing")
                .setURL(song.info.uri)
                .setThumbnail(`http://img.youtube.com/vi/${song.info.identifier}/hqdefault.jpg`)
                .setDescription(`Title: **${song.info.title}**\nBy **${song.info.author}**\nrequested by **${song.requestedBy.tag}**\nAudio Server: **${serverQueue.node}**`)
                .setColor("GREEN")
                .setFooter(`requested by ${song.requestedBy.tag}`, song.requestedBy.displayAvatarURL({ dynamic: trye }))

            serverQueue.player.volume(serverQueue.volume);
            serverQueue.textChannel.send(npembed);
        }
    }

    async getSongs(query) {
        const node = select(this.client, this.startedNodes);
        const params = new URLSearchParams();
        const isHttp = /^https?:\/\//.test(query);
        query = isHttp ? query : `ytsearch: ${query}`;
        params.append('identifier', query); 

        let res = fetch(`http://${ node.host }:${ node.port }/loadtracks?${params.toString()}`, { 
            headers: { 
                Authorization: node.password 
            } 
        }).then(res => res.json())
        .catch(err => {
          console.error(err)
          return null
        })

        return res;

    }
}

module.exports = MusicManager;