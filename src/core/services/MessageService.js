const MessageRepository = require('../../adapters/outbound/messageRepository');

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
    }

    async getMessages(type) {
        return await this.messageRepository.getMessagesByType(type);
    }

    async updateMessageProbability(id, newProbability) {
        return await this.messageRepository.updateMessageProbability(id, newProbability);
    }
}

module.exports = MessageService;