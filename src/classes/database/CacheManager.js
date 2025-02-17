import { QuickDB as Cache } from 'quick.db'

export default new class CacheManager extends Cache {
    constructor() {
        super({ filePath: 'cache.sqlite' })
        this.General = this.table('General')
        this.GameChannels = this.table('GameChannels')
        this.Giveaways = this.table('Giveaways')
        this.Polls = this.table('Polls')
        this.WordleGame = this.table('WordleGame')
        this.Client = this.table('Client')
        this.Bet = this.table('Bet')
        this.Pay = this.table('Payment')
        this.Ranking = this.table('Ranking')
        this.Blackjack = this.table('Blackjack')
    }

    async clearTables(shardId) {
        await this.General.delete(shardId)
        await this.Giveaways.delete(shardId)
        await this.Polls.delete(shardId)
        await this.Ranking.deleteAll()
        await this.General.delete('Looped')
        return true
    }

}