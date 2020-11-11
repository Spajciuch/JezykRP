const Discord = require("discord.js")
const { database } = require("firebase")
const moment = require("moment")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.warn || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    const reason = args.join(" ").slice(args[0].length + 1)

    if (!memberID || !reason || memberID.length !== 18) message.reply("oznacz osobę, poprawne użycie to: `!warn @osoba <powód>`")

    const member = message.guild.members.cache.get(memberID)

    database().ref(`/warns/${memberID}/`).once("value").then(wData => {
        const warnData = wData.val()

        let warns = []
        let moderators = []
        let dates = []

        if (warnData) {
            warns = warnData.warns
            moderators = warnData.moderators
            dates = warnData.dates
        }

        const d = new Date()

        let hour = d.getHours()
        hour = `${hour}`.padStart(2, 0)
        let minute = d.getMinutes()
        minute = `${minute}`.padStart(2, 0)
        const time = hour + ":" + minute

        warns[warns.length] = reason
        moderators[moderators.length] = message.author.id
        dates[dates.length] = `${moment.utc(new Date()).format("DD.MM.YYYY")} o ${time}`

        database().ref(`/warns/${memberID}`).set({
            warns: warns,
            moderators: moderators,
            dates: dates
        }).then(() => {
            const count = warns.length

            let warnList = ""

            for (var i = 0; i <= warns.length - 1; i++) {
                warnList += `**Powód:** ${warns[i]}\n**Dzień:** ${dates[i]}, od:\n<@${moderators[i]}>\n\n`
            }


            const embed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setDescription(`${warnList}`)
                .setTimestamp()
            message.channel.send(embed)


            /*
            let embed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 1024, format: "png" }))
                .setDescription(`**Powód:** ${reason}\n**Dzień:** ${dates[dates.length - 1]}, od: ${message.author}`)
                .addField("Powód warna", `${reason} • ${dates[dates.length - 1]}`)
                .setFooter("© Copyright by Oskar Łysiak 2020-2021")
            if (count > 1) embed.addField("Poprzednie warny", warnList)
            message.channel.send(embed) 
            */

            if (count >= 5) {
                member.roles.add(roles.banned)
            }
        })
    })

}

module.exports.help = {
    name: "warn",
    category: "admin",
    info: "Zwarnuj osobę, przy 5 zgłoszeniach osoba dostaje specjalną rolę, użycie: `!warn @osoba <powód zgłoszenia>`"
}