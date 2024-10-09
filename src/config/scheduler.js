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

    cron.schedule('*/1 * * * *', async () => {
        try {
            console.log('Iniciando la verificación de recordatorios...');

            const reminders = await reminderService.getPendingReminders();
            console.log(`Se han obtenido ${reminders.length} recordatorios pendientes:`, reminders);

            const now = new Date();
            const notificationsToSend = [];

            reminders.forEach((reminder) => {
                const reminderDate = new Date(reminder.reminder_date);
                const timeDifference = reminderDate - now;

                console.log(`Evaluando recordatorio ID: ${reminder.id}, Fecha: ${reminderDate}, Diferencia de tiempo: ${timeDifference} ms`);

                if (timeDifference <= 60000 && timeDifference > 0 && !reminder.is_sent) {
                    const notification = {
                        type: 'reminder',
                        id: reminder.id,
                        user_id: reminder.user_id,
                        timeRemaining: reminder.reminder_date,
                        message: reminder.reminder_message,
                    };

                    notificationsToSend.push(notification);
                    console.log('Notificación a enviar:', notification);
                } else {
                    console.log(`Recordatorio ID: ${reminder.id} no requiere envío.`);
                }
            });

            if (notificationsToSend.length > 0) {
                notificationsToSend.forEach(async (notification) => {
                    console.log(`Enviando notificación:`, notification);
                    await sendNotificationToClients(wss, notification);
                    await reminderService.markAsSent(notification.id);
                    console.log(`Recordatorio ID: ${notification.id} marcado como enviado.`);
                });
            } else {
                console.log('No hay notificaciones para enviar en este ciclo.');
            }

            reminders.forEach(async (reminder) => {
                const reminderDate = new Date(reminder.reminder_date);
                const minutesDifference = (now - reminderDate) / 60000;

                if (minutesDifference >= 1) {
                    console.log(`Eliminando recordatorio antiguo con ID: ${reminder.id}, Diferencia en minutos: ${minutesDifference.toFixed(2)}`);
                    await reminderService.deleteReminder(reminder.id);
                    console.log(`Recordatorio ID: ${reminder.id} eliminado.`);
                } else {
                    console.log(`Recordatorio ID: ${reminder.id} aún es válido. No se eliminará.`);
                }
            });

        } catch (error) {
            console.error('Error al verificar los recordatorios para enviar notificaciones:', error);
        }
    });


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
                    type = 'evaluation';
                } else {
                    const motivationMessages = await messageService.getMessages('motivation');
                    message = selectMessage(motivationMessages);
                    type = 'evaluation';
                }

                sendNotificationToClients(wss, { type, userId: user.id, message });
            }

            console.log('Evaluaciones de usuarios completadas.');
        } catch (error) {
            console.error('Error evaluando usuarios:', error);
        }
    });

    cron.schedule('44 15 * * *', async () => {
        try {
            await wishService.resetWasPerformed();
            console.log('Rutinas actualizadas correctamente a nivel global.');

            const notification = {
                type: 'routine',
                message: 'Las rutinas han sido reseteadas correctamente',
            };
            sendNotificationToClients(wss, notification);
        } catch (error) {
            console.error('Error actualizando rutinas:', error);
        }
    });
};

const selectMessage = (messages) => {
    const totalProbability = messages.reduce((sum, msg) => sum + msg.usageProbability, 0);
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const msg of messages) {
        cumulativeProbability += msg.usageProbability;
        if (random <= cumulativeProbability) {
            const newProbability = Math.max(msg.usageProbability - 10, 10);
            messageService.updateMessageProbability(msg.id, newProbability);
            return msg.content;
        }
    }
    return null;
};

const sendNotificationToClients = (wss, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = initializeScheduler;