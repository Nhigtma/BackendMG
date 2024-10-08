const cron = require('node-cron');
const WebSocket = require('ws');
const ReminderService = require('../core/services/remindersService');
const WishService = require('../core/services/wishService');
const MessageService = require('../core/services/MessageService');
const UserService = require('../core/services/userService');
const PerformanceService = require('../core/services/performanceService');
const NotificationService = require('../core/services/notificationService');

const initializeScheduler = (app) => {
    const wss = new WebSocket.Server({ noServer: true });

    app.server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    const reminderService = new ReminderService();
    const messageService = new MessageService();
    const userService = new UserService();
    const wishService = new WishService();
    const performanceService = new PerformanceService();
    const notificationService = new NotificationService();

    // Verificación de recordatorios cada 5 minutos
    cron.schedule('*/5 * * * *', async () => {
        try {
            const reminders = await reminderService.getPendingReminders();
            reminders.forEach(reminder => {
                const reminderDate = new Date(reminder.reminder_date);
                const now = new Date();

                const timeDifference = reminderDate - now;

                if (timeDifference <= 360000 && timeDifference > 0 && !reminder.is_sent) {
                    const notification = {
                        type: 'reminder',
                        id: reminder.id,
                        user_id: reminder.user_id,
                        timeRemaining: reminder.reminder_date,
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

    // Evaluación de usuarios todos los días a las 12 del mediodía
    cron.schedule('22 19 * * *', async () => {
        try {
            const users = await userService.getAllUsers();

            for (const user of users) {
                const performanceEvaluation = await performanceService.evaluateUserPerformance(user.id, notificationService.sendNotification.bind(notificationService));

                let message;
                let type;
                if (performanceEvaluation >= 40) {
                    const congratulationMessages = await messageService.getMessages('congratulation');
                    message = selectMessage(congratulationMessages);
                    type = 'evaluation'; // Tipo de notificación
                } else {
                    const motivationMessages = await messageService.getMessages('motivation');
                    message = selectMessage(motivationMessages);
                    type = 'evaluation'; // Tipo de notificación
                }

                // Enviar la notificación al usuario
                sendNotificationToClients(wss, { type, userId: user.id, message });
            }

            console.log('Evaluaciones de usuarios completadas.');
        } catch (error) {
            console.error('Error evaluando usuarios:', error);
        }
    });

    // Resetear rutinas todos los días a la medianoche
    cron.schedule('0 0 * * *', async () => {
        try {
            await wishService.resetWasPerformed();
            console.log('Rutinas actualizadas correctamente a nivel global.');

            // Enviar notificación de rutina
            const notification = {
                type: 'routine', // Tipo de notificación
                message: 'Las rutinas han sido actualizadas correctamente.',
            };
            sendNotificationToClients(wss, notification);
        } catch (error) {
            console.error('Error actualizando rutinas:', error);
        }
    });
};

// Función para seleccionar un mensaje basado en la probabilidad de uso
const selectMessage = (messages) => {
    const totalProbability = messages.reduce((sum, msg) => sum + msg.usageProbability, 0);
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const msg of messages) {
        cumulativeProbability += msg.usageProbability;
        if (random <= cumulativeProbability) {
            const newProbability = Math.max(msg.usageProbability - 10, 10);
            messageService.updateMessageProbability(msg.id, newProbability);
            return msg.content; // Retornar el contenido del mensaje seleccionado
        }
    }
    return null; // En caso de que no se seleccione ningún mensaje
};

const sendNotificationToClients = (wss, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = initializeScheduler;