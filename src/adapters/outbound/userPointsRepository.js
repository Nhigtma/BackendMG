const { AppDataSource } = require('../../config/ormConfig');
const History = require('../../core/models/history');
class WishHistoryRepository {
    constructor(dataSource) {
        this.repository = null;
    }
    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(History);
        }
    }

    async save(wishHistory) {
        return await this.repository.save(wishHistory);
    }
}