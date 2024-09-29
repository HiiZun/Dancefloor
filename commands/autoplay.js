const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Automatically play related songs!'),
    async execute(interaction) {

        // check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return await interaction.reply('You need to be in a voice channel to play music!');
        }

        // check if its currently playing
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        // if it is livestream return
        if (player.current.stream) return await interaction.reply('This command is not available for livestreams!');

        // toggle the autoplay
        player.autoplaymode = !player.autoplaymode;

        await interaction.reply(`Autoplay mode has been ${player.autoplaymode ? 'enabled' : 'disabled'}`);
    },
};