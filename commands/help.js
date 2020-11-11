const Discord = require("discord.js")

module.exports.run = async (client, message, args, embedColor, roles) => {
    const rawString = "[" + client.commands.filter(cmd => cmd.help.category === 'admin').map(cmd => '"' + cmd.help.name + '"').join(", ") + "]"
    const commandsArray = JSON.parse(rawString)
    let description = ""

    for (var i = 0; i <= commandsArray.length - 1; i++) {
        description += "**" + commandsArray[i] + "**" + " - " + client.commands.filter(cmd => cmd.help.name === commandsArray[i]).map(cmd => cmd.help.info) + "\n"
    }

    const embed = new Discord.MessageEmbed()
        .setAuthor("Komendy Bota", client.user.displayAvatarURL())
        .setColor(embedColor)
        .setDescription(description)
    message.channel.send(embed)
}

module.exports.help = {
    name: "help"
}