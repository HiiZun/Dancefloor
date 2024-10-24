const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop and leave the channel!'),
    async execute(interaction) {
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        // remove if any 24/7 songs are playing
        const test = await interaction.client.db.alwaysplay.findAll({
            where: {
                guild_id: interaction.guild.id,
            }
        });

        if (test.length > 0) {
            await interaction.client.db.alwaysplay.destroy({
                where: {
                    guild_id: interaction.guild.id,
                }
            });
        }

        player.destroy();
        await interaction.reply('Stopped and left the channel!');
    },
};