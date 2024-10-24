const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const Logger = require('../Base/Logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Play music 24/7 in the voice channel based on a query that will be played and then autoplayed')
        .addStringOption(option => 
        option.setName('query')
        .setDescription('The song you want to play')
        .setRequired(true)
        ),
    async execute(interaction) {

        // check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return await interaction.reply('You need to be in a voice channel to play music!');
        }
        
        // Check if the bot has permission to join the voice channel
        const permissions = interaction.member.voice.channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
            return await interaction.reply('I need the permissions to join and speak in your voice channel!');
        }

        // there should be no queue and no player in the guild
        const testplayer = interaction.client.riffy.players.get(interaction.guild.id);
        if (testplayer) return await interaction.reply('There is already a player in this server!');

        // check if there are no 24/7 songs playing
        const test = await interaction.client.db.alwaysplay.findAll({
            where: {
                guild_id: interaction.guild.id,
            }
        });
        if (test.length > 0) return await interaction.reply('There is already a 24/7 music playing in this server! To remove it use /stop');


        // get the query
        const query = interaction.options.getString('query');


        // create a player
        const player = await interaction.client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            deaf: true,
        });

        // resolve the query
        const resolve = await interaction.client.riffy.resolve({
            query: query,
            requester: interaction.user,
        });

        // get the tracks
        const { loadType, tracks, playlistInfo } = resolve;

        // it should not be a playlist
        if (loadType === "playlist") return await interaction.reply('This command does not support playlists!');


        // add the track to the queue
        player.queue.add(tracks[0]);

        // enable autoplay
        player.autoplaymode = true;

        player.is247 = true;

        // play the music
        if (!player.playing && !player.paused) 
            player.play();

                // add to the db for 24/7
                await interaction.client.db.alwaysplay.create({
                    guild_id: interaction.guild.id,
                    channel_id: interaction.member.voice.channel.id,
                    song: query,
                })

        return interaction.reply(`Playing 24/7 music in the voice channel: **${interaction.member.voice.channel.name}**`);


    },
};