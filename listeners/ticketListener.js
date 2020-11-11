const Discord = require("discord.js")
const { database } = require("firebase")

module.exports.run = async (client, channels) => {
    function pad(num) {
        const size = 4

        const s = "000000000" + num
        return s.substr(s.length - size)
    }

    client.on("raw", async packet => {
        if (packet.t !== "MESSAGE_REACTION_ADD") return

        const channelId = packet.d.channel_id
        const channel = client.channels.cache.get("749601534995726336")
        const guildID = packet.d.guild_id
        const guild = client.guilds.cache.get(guildID)
        const category = guild.channels.cache.get(channels.category)
        const everyone = guild.roles.cache.find(r => r.name == "@everyone")
        const user = client.users.cache.get(packet.d.user_id)
        // const message = channel.messages.fetch(packet.d.message_id)
        // const reactions = message.reactions.cache.filter(r => r.users.cache.get.has(user.id))

        // for (const reaction of reactions.values()) {
        //     await reaction.users.remove(user.id)
        // }
console.log("Trzecia")
        if (channelId == channels.trzecia) {
            
            database().ref(`/trzecia-postać/count`).once("value", d => {
                let count = d.val()

                if (!count) count = 0
                count++

                guild.channels.create(`trzecia-postać-${pad(count || 1)}`, {
                    parent: category, permissionOverwrites: [{
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL"]
                    }, {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }]
                }).then(channel => {
                    channel.send(`<@!${user.id}>`)

                    const embed = new Discord.MessageEmbed()
                        .setColor("000f0f0")
                        .setTitle("Trzecia postać")
                        .setDescription("\\> **1️⃣ Ile masz lat?\n**Odpowiedź:\n\\> **2️⃣ Kiedy i o której masz czas na spotkanie się z administratorem?\n**Odpowiedź:\n\\> **3️⃣ Czy spełniasz nasze wymogi co do trzeciej postaci?**\nOdpowiedź:")
                        .setTimestamp()
                    channel.send(embed).then(msg => {
                        msg.react("❌")

                        const filter = (reaction, member) => reaction.emoji.name == "❌" && member.id == user.id
                        const cancel = msg.createReactionCollector(filter)

                        cancel.on("collect", r => {
                            r.users.remove(user.id)

                            const embed = new Discord.MessageEmbed()
                                .setColor("ff0000")
                                .setTitle("Tytuł?")
                                .setDescription("Jakis opis - ale że zakończenie?")
                                .setTimestamp()
                            msg.edit(embed)

                            channel.updateOverwrite(user, { "VIEW_CHANNEL": false })
                            channel.setName(channel.name.replace("trzecia-postać", "zamknięty"))
                        })
                    })
                })
                database().ref(`/trzecia-postać`).set({
                    count: count
                })
            })
        } else if (channelId == channels.mechanik) {
            database().ref(`/mechanik/count`).once("value", d => {
                let count = d.val()

                if (!count) count = 0
                count++

                guild.channels.create(`mechanik-${pad(count || 1)}`, {
                    parent: category, permissionOverwrites: [{
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL"]
                    }, {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }]
                }).then(channel => {
                    const embed = new Discord.MessageEmbed()
                        .setColor("000f0f0")
                        .setTitle("Tytuł?")
                        .setDescription("Jakis opis?")
                        .setTimestamp()
                    channel.send(embed).then(msg => {
                        msg.react("❌")

                        const filter = (reaction, member) => reaction.emoji.name == "❌" && member.id == user.id
                        const cancel = msg.createReactionCollector(filter)

                        cancel.on("collect", r => {
                            r.users.remove(user.id)

                            const embed = new Discord.MessageEmbed()
                                .setColor("ff0000")
                                .setTitle("Tytuł?")
                                .setDescription("Jakis opis - ale że zakończenie?")
                                .setTimestamp()
                            msg.edit(embed)

                            channel.updateOverwrite(user, { "VIEW_CHANNEL": false })
                            channel.setName(channel.name.replace("mechanik", "zamknięty"))
                        })
                    })
                })
                database().ref(`mechanik`).set({
                    count: count
                })
            })
        } else if (channelId == channels.doj) {

        } else if (channelId == channels.lspd) {

        } else if (channelId == channels.ems) {

        } else if (channelId == channels.ems) {

        }
    })
}