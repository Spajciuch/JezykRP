const { database } = require("firebase")
const ms = require("ms")

module.exports.listener = async (client) => {
    const muteListener = database().ref(`/mute`)

    muteListener.on("value", () => {
        client.mute = null

        database().ref(`/mute/`).once("value").then(d => {
            const muteData = d.val()

            if (muteData) client.mute = muteData
        })
    })
}

module.exports.interval = async (client, guild) => {
    setInterval(function () {
        if (client.mute) {
            const muteData = Object.values(client.mute)
            muteData.forEach(muted => {
                const member = guild.members.cache.get(muted.id)
                const channel = guild.channels.cache.get(muted.channel)
                const role  = guild.roles.cache.find(r => r.name == "JeżykRP Mute")

                const state = ms(muted.time) - (Date.now() - muted.now) < 0

                if (state) {
                    member.roles.remove(role.id)
                    channel.send(`Odmutowano ${member}`)

                    database().ref(`/mute/${muted.id}`).remove()
                }
            })
        }
    }, 1000
    )
}