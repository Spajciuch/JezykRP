module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.ban || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    let reason = `JeżykRP - Zbanowano przez ${message.author.tag}`
    if (args[1]) reason = args.join(" ").slice(args[0].length + 1)

    if (!memberID || memberID.length !== 18) return message.reply("musisz oznaczyć osobę")

    const member = message.guild.members.cache.get(memberID)
    if (!member.bannable) return message.reply("nie mogę zbanować tego użytkownika")

    member.ban({ reason: reason }).then(() => {
        message.channel.send("✅ Zbanowano poprawnie!")
    })
}

module.exports.help = {
    name: "majorka",
    category: "admin",
    info: "Tą komendą możesz banować osoby, użycie: `!majorka @osoba <opcjonalnie: powód>`"
}