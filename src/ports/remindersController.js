const reminderService = require('../core/services/remindersService');

class ReminderController {
    constructor(){
        this.reminderService = new reminderService();
    }
    async createReminder(req, res) {
        try {
            const reminder = await this.reminderService.createReminder(req.body);
            res.status(201).json(reminder);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getReminders(req, res) {
        try {
            const reminders = await this.reminderService.getReminders(req.params.userId);
            res.status(200).json(reminders);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateReminder(req, res) {
        try {
            const updatedReminder = await this.reminderService.updateReminder(req.params.id, req.body);
            res.status(200).json(updatedReminder);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getReminder(req, res) {
        try {
            const reminder = await this.reminderService.getReminder(req.params.id);
            res.status(200).json(reminder);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteReminder(req, res) {
        try {
            await this.reminderService.deleteReminder(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ReminderController();