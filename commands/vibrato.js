const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vibrato')
        .setDescription('Make the music sound like it is vibrating')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The level of vibrato you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Normal', value: '1' }
        )
        ),
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

        // set the tremolo level
        const level = interaction.options.getString('level');
        player.filters.setVibrato(level == 0 ? false : true);

        await interaction.reply(`Vibrato mode updated to **${level == 0 ? 'Off' : 'Normal'}**`);

    },
};