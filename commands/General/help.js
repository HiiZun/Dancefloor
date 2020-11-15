const Discord = require("discord.js")
const Command = require("../../Base/Command");

class Help extends Command {
        
    constructor(client) {
       super(client, {
            name: "help",
            aliases: ["h"],
            description: "Get help page."
        });
        }
        
            async run(message, args) {

		if(args[0]){

            const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));

			if(!cmd){
				return message.channel.send("Oops this command don't exist !");
			}

	
			// Creates the help embed
            const groupEmbed = new Discord.MessageEmbed()
                .addField(
                    "Name",
                    cmd.help.name||"No description provided !"
                )
				.addField(
					"Description",
					cmd.help.description||"No description provided !"
                )
				.addField(
					"Category",
					cmd.help.category||"No description provided !"
				)
				.addField(
					"Aliases",
					cmd.help.aliases.length > 0
						? cmd.help.aliases.map(a => "`" + a + "`").join("\n")
						: "No alisases found"
				)
				.setColor("BLUE")

			return message.channel.send(groupEmbed);
		}

		const categories = [];
		const commands = this.client.commands;

		commands.forEach((command) => {
			if(!categories.includes(command.help.category)){
				if(command.help.category === "Owner" && this.client.config.owners.includes(message.author.id)){
					return;
				}
				categories.push(command.help.category);
			}
		});


		const embed = new Discord.MessageEmbed()
			.setDescription("Help - Dancefloor")
			.setColor("BLUE")
		categories.sort().forEach((cat) => {
			const tCommands = commands.filter((cmd) => cmd.help.category === cat);
			embed.addField(cat+" - ("+tCommands.size+")", tCommands.map((cmd) => "`"+cmd.help.name+"`").join(", "));
		});
        
        return message.channel.send(embed);

            }
        
        }
        
        module.exports = Help;