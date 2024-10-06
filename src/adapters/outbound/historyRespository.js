const { AppDataSource } = require('../../config/ormConfig');
const History = require('../../core/models/history');
const wishesRepository = require('../outbound/wishesRepository');

class HistoryRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(History);
        }
    }

    async getHistory(user_id) {
        await this.initRepository();
        
        const history = await this.repository.findOne({ where: { user_id } });
        
        const wishesRepo = new wishesRepository();
        const wishes = await wishesRepo.getWishesFinalizados(user_id);
        

        return {
            history,
            wishes
        };
    }

    async addToHistory(user_id) {
        await this.initRepository();
        const historyEntry = this.repository.create({ user_id });
        return await this.repository.save(historyEntry);
    }

    async updateHighestScore(user_id, newHighestScore) {
        await this.initRepository();
        
        const entry = await this.repository.findOne({ where: { user_id } });
        
        if (entry) {
            if (newHighestScore > entry.highest_score) {
                entry.highest_score = newHighestScore;
                await this.repository.save(entry);
            }
        } else {
            const newEntry = this.repository.create({ user_id, highest_score: newHighestScore });
            await this.repository.save(newEntry);
        }
    }

    async getHighestScore(user_id) {
        await this.initRepository();
        const entry = await this.repository.findOne({
            where: { user_id },
        });

        return entry;
    }
}

module.exports = HistoryRepository;