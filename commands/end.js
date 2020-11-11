const Discord = require("discord.js")
const config = require("../config.json")
const ms = require("ms")
const moment = require("moment")

module.exports.run = async (client, message, args, embedColor, roles) => {
    message.delete()

    const channel = client.channels.cache.get(config.channels.alertChannel)
    const lastId = channel.lastMessageID

    if (!lastId) return message.reply("wystąpił błąd przy odczytywaniu informacji o poprzednim kodzie")

    channel.messages.fetch(lastId).then(msg => {
        if (!msg.embeds[0]) return message.reply("wystąpił błąd przy odczytywaniu informacji o poprzednim kodzie")

        const content = msg.embeds[0].description
        let code = "???"

        if (content.toLowerCase().includes("czarny")) code = "czarny"
        if (content.toLowerCase().includes("czerwony")) code = "czerwony"
        if (content.toLowerCase().includes("zielony")) code = "zielony"
        if (content.toLowerCase().includes("pomarańczowy")) code = "pomarańczowy"

        code = code.toUpperCase()

        const time = ms(Date.now() - msg.createdTimestamp)

        const embed = new Discord.MessageEmbed()
            .setColor("WHITE")
            .setAuthor("Los Santos Police Department", "https://i.imgur.com/QIUumhR.png")
            .setDescription(`**UWAGA OBYWATELE**\n\nKod: **${code}** został zakończony.\nTrwał on **${time}**\nAby dowiedzieć się więcej, kliknij [here](https://discord.com/channels/729216237703528490/736863952973332490/736863977967059075)`)
        channel.send(embed)
    })
}

module.exports.help = {
    name: "koniec",
    category: "admin",
    info: "Kończy poprzedni kod"
}