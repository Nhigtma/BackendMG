const { AppDataSource } = require('../../config/ormConfig');
const Message = require('../../core/models/message');

class MessageRepository {
    constructor() {
        this.repository = AppDataSource.getRepository(Message);
    }

    async getMessagesByType(type) {
        return await this.repository.find({ where: { type } });
    }

    async updateMessageProbability(id, newProbability) {
        const message = await this.repository.findOne({ where: { id } });
        if (message) {
            message.usageProbability = newProbability;
            return await this.repository.save(message);
        }
        return null;
    }
}

module.exports = MessageRepository;