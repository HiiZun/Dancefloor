const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bassboost')
        .setDescription('Boost the basses!')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The level of bassboost you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Low', value: '1' },
            { name: 'Medium', value: '2' },
            { name: 'High', value: '3' },
            { name: 'Very High', value: '4' },
            { name: 'Extreme', value: '5' }
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

        // set the bassboost level
        const level = interaction.options.getString('level');
        player.filters.setBassboost(level == 0 ? false : true,  {
            rate: parseInt(level)
        });

        await interaction.reply(`Bassboost level updated to **${level == 0 ? 'Off' : level == 1 ? 'Low' : level == 2 ? 'Medium' : level == 3 ? 'High' : level == 4 ? 'Very High' : 'Extreme'}**`);

    },
};