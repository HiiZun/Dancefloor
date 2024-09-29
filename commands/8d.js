const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8d')
        .setDescription('Add an 8D effect to the music')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The pitch of nightcore you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Realistic', value: '1' },
            { name: 'Fantastic', value: '2' },
            { name: 'Overpowered', value: '3' }
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
        player.filters.set8D(level == 0 ? false : true, {
            rotationHz: level*0.2
        });

        await interaction.reply(`8D mode updated to **${level == 0 ? 'Off' : level == 1 ? 'Realistic' : level == 2 ? 'Fantastic' : 'Overpowered'}**`);

    },
};