const Discord = require("discord.js")
const moment = require("moment")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.kick || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    const reason = args.join(" ").slice(args[0].length + 1)
    if (!memberID || memberID.length !== 18 || !reason) return message.reply("poprawne użycie to: `!kick @osoba <powód>`")

    const member = message.guild.members.cache.get(memberID)

    if (!member.kickable) return message.reply("nie jestem w stanie wyrzucić tego użytkownika")

    const d = new Date()

    let hour = d.getHours()
    hour = `${hour}`.padStart(2, 0)
    let minute = d.getMinutes()
    minute = `${minute}`.padStart(2, 0)
    const time = hour + ":" + minute

    member.kick({ reason: reason }).then(() => {
        const embed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 1024, format: "png" }))
            .setDescription(`Wyrzucono **${member.user.tag}** przez ${message.member}`)
            .addField("Powód", `${moment.utc(new Date()).format("DD.MM.YYYY")} - ${time} • **${reason}**`)
            .setFooter("© Copyright by Oskar Łysiak 2020-2021")
        message.channel.send(embed)
    })
}

module.exports.help = {
    name: "kick",
    category: "admin",
    info: "Wyrzuć użytkownika z serwera, użycie: `!kick @osoba <powód>`"
}