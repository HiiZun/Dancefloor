const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current plaaying song!'),
    async execute(interaction) {
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        if (!player.current) return await interaction.reply('There are no songs in the queue to skip!');

        if(player.queue.size <= 1) {
            player.stop();
            return await interaction.reply('Stopped!');
        }

        player.stop();
        await interaction.reply('Skipped the current song!');
    },
};