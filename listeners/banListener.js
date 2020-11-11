const { database } = require("firebase")
const ms = require("ms")

module.exports.listener = async (client) => {
    const banListener = database().ref(`/ban`)

    banListener.on("value", () => {
        client.ban = null

        database().ref(`/ban/`).once("value").then(d => {
            const bannedata = d.val()

            if (bannedata) client.ban = bannedata
        })
    })
}

module.exports.interval = async (client, guild) => {
    setInterval(function () {
        if (client.ban) {
            const bannedata = Object.values(client.ban)
            bannedata.forEach(banned => {
                const state = ms(banned.time) - (Date.now() - banned.now) < 0

                if (state) {
                    guild.members.unban(banned.id)
                    database().ref(`/ban/${banned.id}`).remove()
                }
            })
        }
    }, 1000
    )
}