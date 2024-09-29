const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nightcore')
        .setDescription('Accelerate the music to nightcore')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The pitch of nightcore you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Quicker', value: '1' },
            { name: 'Fast', value: '2' },
            { name: 'Fastest', value: '3' }
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
        player.filters.setNightcore(level == 0 ? false : true, {
            rate: level == 1 ? 1.15 : level == 2 ? 1.75 : 2.5
        });

        await interaction.reply(`Nighcore mode updated to **${level == 0 ? 'Off' : level == 1 ? 'Quicker' : level == 2 ? 'Fast' : 'Fastest'}**`);

    },
};