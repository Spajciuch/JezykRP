const ms = require("ms")
const { database } = require("firebase")

const cooldown = 3e+5

module.exports.listener = async (client) => {
    database().ref(`/clear/`).on("value", d => {
        client.clear = d.val()
    })
}

module.exports.interval = (client, guild) => {
    setInterval(() => {
        guild.members.cache.forEach(member => {
            if (client.clear) {
                const clearData = client.clear[member.id]

                if (clearData) {
                    const time = clearData.time
                    const timeCondition = cooldown - (Date.now() - time) < 0

                    if (timeCondition) {
                        database().ref(`/clear/${member.id}`).remove()
                    }
                }
            }
        })
    }, 1000)
}