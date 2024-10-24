const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Now playing song!'),
    async execute(interaction) {
        // list songs in the queue with their rank, titles, authors and durations and time left to play
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        if (!player.current) return await interaction.reply('There are no songs playing!');
        
        const current = player.current;

        return await interaction.reply(`Now Playing: [${current.info.title} - ${current.info.author}](${current.info.uri})`);

    },
};