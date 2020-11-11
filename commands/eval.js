const Discord = require("discord.js")

module.exports.run = async (client, message, args, embedColor, config) => {
    if (message.author.id != "367390191721381890") return message.reply("nie masz uprawnień")

    const result = eval(args.join(" "))

    const embed = new Discord.MessageEmbed()
        .setTitle("Eval")
        .addField(":inbox_tray: Wejście", "```" + args.join(" ") + "```")
        .addField(":outbox_tray: Wyjście", "```" + result + "```")
        .setColor(embedColor)
    message.channel.send(embed)
}
module.exports.help = {
    name: "eval",
}