import { Database, SaphireClient as client } from '../../../../classes/index.js'
import NotifyUser from './notifier.reminder.js'
import revalidateTime from './revalidateTimer.reminder.js'
import { Emojis as e } from '../../../../util/util.js'

export default async function reminderStart({ user, data }) {

    const RemindMessage = data.RemindMessage.slice(0, 3500)
    const Time = data.Time
    const DateNow = data.DateNow
    const isAutomatic = data.isAutomatic
    const TimeOver = Date.Timeout(Time, DateNow)

    if (!TimeOver && !data.Alerted) {

        const Channel = await client.channels.fetch(data.ChannelId).catch(() => NotifyUser(user, RemindMessage, data.id))

        if (!Channel || !Channel.guild || !Channel.guild?.members.cache.has(user.id))
            return NotifyUser(user, RemindMessage, data.id)

        let userNotified = false

        const msg = await Channel.send(`${e.Notification} | ${user}, lembrete pra você.\n🗒️ | **${RemindMessage}**`)
            .catch(async () => {
                userNotified = true
                return NotifyUser()
            })

        if (userNotified) return
        if (isAutomatic) return await Database.deleteReminders(data.id)

        await Database.Reminder.updateOne(
            { id: data.id },
            { Alerted: true }
        )

        const emojis = ['📅', '🗑️']

        for (let i of emojis) msg?.react(i).catch(() => { })

        const collector = msg.createReactionCollector({
            filter: (reaction, u) => emojis.includes(reaction.emoji.name) && u.id === user.id,
            idle: 600000,
            errors: ['idle']
        })
            .on('collect', (reaction) => {

                if (reaction.emoji.name === emojis[0]) {
                    msg.delete().catch(() => { })
                    return revalidateTime(Channel, user, data)
                }

                if (reaction.emoji.name === emojis[1]) {
                    Database.deleteReminders(data.id)
                    collector.stop()
                    return msg.edit(`${e.Notification} | ${user}, lembrete pra você.\n🗒️ | **${RemindMessage}**\n${e.Info} | Lembrete deletado.`)
                }

                return
            })
            .on('end', (_, reason) => {
                if (reason !== 'user') return
                Database.deleteReminders(data.id)
                if (!msg) return
                return msg.edit(`${e.Notification} | ${user}, lembrete pra você.\n🗒️ | **${RemindMessage}**\n${e.Info} | Lembrete deletado.`).catch(() => { })
            })


        return
    }

    if (data.Alerted && !Date.Timeout(Time + 600000, DateNow))
        return Database.deleteReminders(data.id)

    return
}