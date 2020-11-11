const Discord = require("discord.js")
const config = require("../config.json")
const moment = require("moment")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.zarząd || r.id == roles.alert)) return message.reply("nie masz wymaganych uprawnień")

    message.delete()

    const d = new Date()
    let hour = d.getHours()
    hour = `${hour}`.padStart(2, 0)

    let minute = d.getMinutes()
    minute = `${minute}`.padStart(2, 0)

    const time = hour + ":" + minute
    const date = moment.utc(new Date()).format("DD.MM.YYYY")

    const channel = client.channels.cache.get(config.channels.alertChannel)

    const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("Los Santos Police Department", "https://i.imgur.com/QIUumhR.png")
        .setDescription(`**UWAGA OBYWATELE**\n\nDnia **${date}, ${time}** kod: **ZIELONY**\nAby dowiedzieć się więcej, kliknij [here](https://discord.com/channels/729216237703528490/736863952973332490/736863977967059075)`)
    channel.send(embed)
}

module.exports.help = {
    name: "zielony",
    category: "admin",
    info: "Wprowadza kod zielony"
}