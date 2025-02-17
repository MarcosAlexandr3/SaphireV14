import { User } from 'discord.js'
import { Database, SaphireClient as client } from '../../../classes/index.js'
import { Config as config } from '../../../util/Constants.js'

User.prototype.isVip = async function () {

    const userData = await Database.User.findOne({ id: this.id }, 'Vip')
    if (!userData) return false

    const DateNow = userData?.Vip?.DateNow || null
    const TimeRemaing = userData?.Vip?.TimeRemaing || 0

    if (userData?.Vip?.Permanent) return true

    return Date.Timeout(TimeRemaing, Date.now() - DateNow) || undefined
}

User.prototype.isMod = async function () {
    const clientData = await Database.Client.findOne({ id: client.user.id }, 'Moderadores Administradores') || []
    const staff = [...clientData?.Administradores, ...clientData?.Moderadores, config.ownerId]
    return staff.includes(this.id)
}

User.prototype.balance = async function () {

    const userData = await Database.User.findOne({ id: this.id }, 'Balance')

    if (!userData || !userData.Balance) return 0

    return parseInt(userData.Balance) || 0
}

User.prototype.color = async function () {
    
    const userData = await Database.User.findOne({ id: this.id }, 'Color')
    if (!userData || !userData?.Color.Perm || !userData?.Color.Set) return client.blue

    return client.blue
}