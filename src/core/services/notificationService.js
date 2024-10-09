const MessageService = require('./MessageService');

class NotificationService {
    constructor() {
        this.messageService = new MessageService();
    }

    async sendNotification(userId, messageContent) {
        const notification = {
            userId,
            message: messageContent,
        };

        sendNotificationToClients(notification);
    }

    async evaluateAllUsers(performanceService) {
        try {
            const users = await getAllUsers();
            for (const user of users) {
                await performanceService.evaluateUserPerformance(user.id, this.sendNotification.bind(this));
            }
            console.log('Evaluación de rendimiento completada para todos los usuarios.');
        } catch (error) {
            console.error('Error en la evaluación de rendimiento:', error);
        }
    }
}

const sendNotificationToClients = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = NotificationService;