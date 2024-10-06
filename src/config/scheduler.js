const cron = require('node-cron');
const WebSocket = require('ws');
const ReminderService = require('../core/services/remindersService');
const initializeScheduler = (app) => {
    const wss = new WebSocket.Server({ noServer: true });

    app.server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    const reminderService = new ReminderService();

    cron.schedule('* * * * *', async () => {
        try {
            const reminders = await reminderService.getPendingReminders();
            reminders.forEach(reminder => {
                const reminderDate = new Date(reminder.reminder_date);
                const now = new Date();

                if (reminderDate <= now && !reminder.is_sent) {
                    const notification = {
                        id: reminder.id,
                        message: reminder.reminder_message,
                    };

                    sendNotificationToClients(wss, notification);

                    reminderService.markAsSent(reminder.id);
                }
            });
        } catch (error) {
            console.error('Error fetching reminders for notifications:', error);
        }
    });
};

const sendNotificationToClients = (wss, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = initializeScheduler;