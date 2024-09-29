const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tremolo')
        .setDescription('Make the music sound like it is playing in a cave')
        .addStringOption(option => 
        option.setName('level')
        .setDescription('The level of tremolo you want to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: '0' },
            { name: 'Sealth', value: '1' },
            { name: 'Normal', value: '2' },
            { name: 'Strong', value: '3' },
            { name: 'Heavy', value: '4' }
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
        player.filters.setTremolo(level == 0 ? false : true,  {
            // higher the depth, the more intense the effect
            // higher the frequency, the faster the effect
            frequency: 10/parseInt(level),
            depth: parseInt(level)*0.25
        });

        await interaction.reply(`Tremolo mode updated to **${level == 0 ? 'Off' : level == 1 ? 'Sealth' : level == 2 ? 'Normal' : level == 3 ? 'Strong' : level == 4 ? 'Heavy' : 'Extreme'}**`);

    },
};