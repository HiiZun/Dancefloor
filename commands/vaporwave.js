const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vaporwave')
        .setDescription('Make the music sound like it is a vaporwave song')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The pitch of vaporwave you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Sealth', value: '1' },
            { name: 'Slow', value: '2' },
            { name: 'Slowest', value: '3' }
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
        player.filters.setVaporwave(level == 0 ? false : true, {
            pitch: 1/(parseInt(level)*2)
        });

        await interaction.reply(`Vaporwave mode updated to **${level == 0 ? 'Off' : level == 1 ? 'Sealth' : level == 2 ? 'Slow' : 'Slowest'}**`);

    },
};