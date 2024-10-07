const ReminderRepository = require('../../adapters/outbound/remindersRepository');

class ReminderService {
    constructor() {
        this.reminderRepository = new ReminderRepository();
    }

    async createReminder(reminderDate, reminderMessage, userId) {
        return await this.reminderRepository.createReminder(reminderDate, reminderMessage, userId);
    }

    async getReminders(userId) {
        return await this.reminderRepository.getAllReminders(userId);
    }

    async updateReminder(id, reminderDate, reminderMessage, isSent) {
        return await this.reminderRepository.updateReminder(id, reminderDate, reminderMessage, isSent);
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
        await this.reminderRepository.updateReminderS(id, { is_sent: true });
    }
}

module.exports = ReminderService;