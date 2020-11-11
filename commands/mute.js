const ms = require("ms")
const { database } = require("firebase")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.mute || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    const time = args[1]

    if (!memberID || memberID.length !== 18 || !time) return message.reply("poprawne użycie `!mute @osoba <czas>`")

    const member = message.guild.members.cache.get(memberID)

    let muteRole = message.guild.roles.cache.find(r => r.name == "JeżykRP Mute")

    if (!muteRole) {
        muterole = await message.guild.roles.create({
            data: {
                name: "JeżykRP Mute",
                color: "#000000",
                permissions: []
            }
        })
        message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            })
        })
    }

    await (member.roles.add(muteRole.id))

    database().ref(`/mute/${message.guild.id}/${memberID}`).set({
        time: time,
        now: Date.now(),
        id: member.user.id,
        channel: message.channel.id
    }).then(() => message.channel.send(`✅ Mute nadany poprawnie na: ${member}`))
}

module.exports.help = {
    name: "mute",
    category: "admin",
    info: "Wycisz użytkownika na określony czas, użycie: `!mute @osoba <czas (np: 10m)>`"
}