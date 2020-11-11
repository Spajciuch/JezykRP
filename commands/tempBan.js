const Discord = require("discord.js")
const { database } = require("firebase")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.ban || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    const time = args[1]
    let reason = `JeżykRP - Zbanowano przez ${message.author.tag}`

    if (!memberID || memberID.length !== 18 || !time) return message.reply("poprawne użycie: `!temp-ban @osoba <czas> <opcjonalnie: powód>`")

    const member = message.guild.members.cache.get(memberID)
    if (!member.bannable) return message.reply("nie mogę zbanować tej osoby")

    member.ban({ reason: reason })

    message.channel.send(`✅ Pomyślnie zbanowano **${member.user.tag}** na: ${time}`)

    database().ref(`/ban/${message.guild.id}/${memberID}`).set({
        time: time,
        now: Date.now(),
        id: member.user.id,
        channel: message.channel.id
    })
}

module.exports.help = {
    name: "temp-ban",
    category: "admin",
    info: "Zbanuj użytkownika na jakiś określony czas, użycie: `!temp-ban @osoba <czas (np: 10m)>`"
}