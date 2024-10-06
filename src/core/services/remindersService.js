const ReminderRepository = require('../../adapters/outbound/remindersRepository');

class ReminderService {
    constructor() {
        this.reminderRepository = new ReminderRepository();
    }
    async createReminder(data) {
        return await this.reminderRepository.createReminder(data);
    }

    async getReminders(userId) {
        return await this.reminderRepository.getAllReminders(userId);
    }

    async updateReminder(id, data) {
        return await this.reminderRepository.updateReminder(id, data);
    }

    async getReminder(id) {
        return await this.reminderRepository.getReminderById(id);
    }

    async deleteReminder(id) {
        await this.reminderRepository.deleteReminder(id);
    }

    async getPendingReminders() {
        return await this.reminderRepository.getAllPendingReminders();
    }

    async markAsSent(id) {
        await this.reminderRepository.updateReminder(id, { is_sent: true });
    }
}

module.exports = ReminderService;