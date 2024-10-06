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

    async createReminder(data) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const reminder = this.repository.create(data);
        await this.repository.save(reminder); // Cambia a this.repository
        return reminder;
    }

    async getAllReminders(userId) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        return await this.repository.find({ where: { user_id: userId } });
    }

    async updateReminder(id, data) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        await this.repository.update(id, data);
        return this.getReminderById(id);
    }

    async getReminderById(id) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        const reminder = await this.repository.findOne({ where: { id } }); // Cambiado a objeto donde
        if (!reminder) {
            throw new Error('Reminder not found');
        }
        return reminder;
    }

    async deleteReminder(id) {
        await this.initRepository(); // Asegúrate de inicializar el repositorio
        await this.repository.delete(id);
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
}

module.exports = ReminderRepository;