const cron = require('node-cron');
const WebSocket = require('ws');
const ReminderService = require('../core/services/remindersService');
const WishService = require('../core/services/wishService');
const UserPointsService = require('../core/services/userPointsService');
const HistoryService = require('../core/services/historyServices');
const MessageService = require('../core/services/MessageService');
const UserService = require('../core/services/userService');

const initializeScheduler = (app) => {
    const wss = new WebSocket.Server({ noServer: true });

    app.server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    const reminderService = new ReminderService();
    const userPointsService = new UserPointsService();
    const historyService = new HistoryService();
    const messageService = new MessageService();
    const userService = new UserService();
    const wishService = new WishService();

    // Verificación de recordatorios cada 5 minutos
    cron.schedule('*/5 * * * *', async () => {
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

    // Evaluación de usuarios todos los días a las 12 del mediodía
    cron.schedule('0 12 * * *', async () => {
        try {
            // Obtener todos los usuarios
            const users = await userService.getAllUsers(); // Suponiendo que existe un método para obtener todos los usuarios.

            for (const user of users) {
                const currentPoints = await userPointsService.getCurrentPoints(user.id);
                const highestScore = await historyService.getHistoryByUserId(user.id);

                // Lógica de evaluación usando la red neuronal
                const performanceEvaluation = evaluatePerformance(currentPoints, highestScore);
                
                let message;
                if (performanceEvaluation >= 40) {
                    const congratulationMessages = await messageService.getMessages('congratulation');
                    message = selectMessage(congratulationMessages);
                } else {
                    const motivationMessages = await messageService.getMessages('motivation');
                    message = selectMessage(motivationMessages);
                }

                // Enviar la notificación al usuario
                sendNotificationToClients(wss, { userId: user.id, message });
            }

            console.log('Evaluaciones de usuarios completadas.');
        } catch (error) {
            console.error('Error evaluando usuarios:', error);
        }
    });

    cron.schedule('0 0 * * *', async () => {
        try {
            await  wishService.resetWasPerformed();
            console.log('Rutinas actualizadas correctamente a nivel global.');
        } catch (error) {
            console.error('Error actualizando rutinas:', error);
        }
    });
};

// Función para seleccionar un mensaje basado en la probabilidad de uso
const selectMessage = (messages) => {
    // Implementa la lógica para seleccionar un mensaje en base a su probabilidad de uso
    const totalProbability = messages.reduce((sum, msg) => sum + msg.usageProbability, 0);
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const msg of messages) {
        cumulativeProbability += msg.usageProbability;
        if (random <= cumulativeProbability) {
            // Actualizar la probabilidad de uso del mensaje
            const newProbability = Math.max(msg.usageProbability - 10, 10); // Disminuir la probabilidad
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