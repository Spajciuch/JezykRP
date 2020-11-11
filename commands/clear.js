const {database} = require("firebase")
const ms = require("ms")

module.exports.run = async(client, message, args, embedColor, roles) => {
    database().ref(`/clear/${message.author.id}/`).once("value", async d => {
        const cooldown = 3e+5

        const clearData = d.val()
        let usesLeft = 100
        let time = Date.now()

        if(clearData) {
            time = clearData.time
            usesLeft = clearData.usesLeft
        }

        const toClear = Number(args[0]) + 1
        if(usesLeft <= 0) return message.reply("nie możesz na razie użyć tej komendy")
        if(toClear <= 0 || toClear >= 100) return message.reply("podaj liczbę w zakresie `1-100`")
        if(usesLeft < toClear) return message.reply("nie możesz na razie usunąć tylu wiadomości, twój aktualny limit wynosi: " + usesLeft)
        usesLeft -= toClear

        await message.channel.bulkDelete(toClear)

        database().ref(`/clear/${message.author.id}`).set({
            usesLeft: usesLeft,
            time: time
        }, () => message.reply("usunięto wiadomości", msg => msg.delete({timeout: 1500})))
    })
} 

module.exports.help = {
    name: "clear",
    category: "admin",
    info: "Czyści wybraną liczbę wiadomości, z limitem 100 wiadomości na 5 minut"
}