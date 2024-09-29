const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the volume!')
        .addIntegerOption(option => option.setName('volume').setDescription('Volume to set')
        .setRequired(true)),
    async execute(interaction) {
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        const volume = interaction.options.getInteger('volume');
        if(volume < 1 || volume > 200) return await interaction.reply('Volume must be between 1 and 200!');
        player.setVolume(volume);

        await interaction.reply(`Volume set to ${volume}%!`);
    },
};