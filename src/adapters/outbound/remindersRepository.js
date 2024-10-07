const { AppDataSource } = require('../../config/ormConfig');
const Reminder = require('../../core/models/reminders');
const { LessThan } = require('typeorm'); // Asegúrate de importar LessThan

class ReminderRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(Reminder);
        }
    }

    async createReminder(reminderDate, reminderMessage, userId) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const reminder = this.repository.create({
            reminder_date: reminderDate,
            reminder_message: reminderMessage,
            user_id: userId,
        });
        await this.repository.save(reminder);
        return reminder;
    }

    async getAllReminders(userId) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        return await this.repository.find({ where: { user_id: userId } });
    }

    async updateReminder(id, reminderDate, reminderMessage, isSent) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const updateData = {};

        if (reminderDate) updateData.reminder_date = reminderDate;
        if (reminderMessage) updateData.reminder_message = reminderMessage;
        if (isSent !== undefined) updateData.is_sent = isSent; // Permite que isSent sea un booleano

        await this.repository.update(id, updateData);
        return this.getReminderById(id);
    }

    async getReminderById(id) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const reminder = await this.repository.findOne({ where: { id } });
        if (!reminder) {
            throw new Error('Reminder not found');
        }
        return reminder;
    }

    async deleteReminder(id) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new Error('Reminder not found or already deleted');
        }
    }

    async getAllPendingReminders() {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const currentDate = new Date();
        return await this.repository.find({
            where: {
                reminder_date: LessThan(currentDate),
                is_sent: false,
            },
        });
    }

    async updateReminderS(id, data) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        await this.repository.update(id, data);
        return this.getReminderById(id);
    }
}

module.exports = ReminderRepository;