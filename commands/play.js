const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play Music!')
        .addStringOption(option => option.setName('song').setDescription('The song you want to play').setRequired(true)),

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     * @returns void
     */
    async execute(interaction) {
    
        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return await interaction.reply('You need to be in a voice channel to play music!');
        }

        // Check if the bot has permission to join the voice channel
        const permissions = interaction.member.voice.channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
            return await interaction.reply('I need the permissions to join and speak in your voice channel!');
        }

        // Get the song the user wants to play
        const song = interaction.options.getString('song');

        const player = await interaction.client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            deaf: true,
        });

        const resolve = await interaction.client.riffy.resolve({
            query: song,
            requester: interaction.user,
        });

        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === "playlist") {
            for (const track of resolve.tracks) {
                track.info.requester = interaction.user;
                player.queue.add(track);
            }

            const embed = new EmbedBuilder()
                .setTitle('Playlist Added')
                .setDescription(`Added ${resolve.tracks.length} songs from the playlist: **${playlistInfo.name}**`)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.reply({ embeds: [embed] });

            if (!player.playing && !player.paused) return player.play();

        } else if (loadType === "search" || loadType === "track") {
            const track = tracks.shift();
            track.info.requester = interaction.user;
            player.queue.add(track);

            const position = player.queue.size > 0 ? `Position in queue: ${player.queue.size}` : '';
            const embed = await this.getEmbed(false, track, player, position);

            await interaction.reply({ embeds: [embed.embed] });

            if (!player.playing && !player.paused) return player.play();

        } else {
            return interaction.reply("There are no results found.");
        }
    },

    getEmbed(firstTrack = true, track, player, position = "") {
        return new Promise((resolve) => {
            // format MM:SS
            let totalTime = "";
            let minutes = Math.floor(track.info.length / 60000);
            let seconds = ((track.info.length % 60000) / 1000).toFixed(0);
            totalTime = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

            return resolve({ embed: new EmbedBuilder()
                .setTitle(firstTrack ? "Now Playing" : "Added to Queue")
                .setDescription(`[${track.info.title} - ${track.info.author}](${track.info.uri})
${track.stream ? "🔴 Live" : `[${totalTime}]`} - Node: ${player.node?.name || "Unknown"}
${position}`)
                .setThumbnail(track.info.thumbnail)
                .setFooter({
                    text: `Requested by ${track?.info?.requester?.tag}`,
                    iconURL: track.info.requester.displayAvatarURL({ dynamic: true })
                })
            });
        });
    }
};
