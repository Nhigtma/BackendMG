const PerformanceService = require('./performanceService');
const MessageService = require('./MessageService');

class NotificationService {
    constructor() {
        this.performanceService = new PerformanceService();
        this.messageService = new MessageService();
    }

    async sendNotification(userId, messageContent) {
        // Lógica para enviar la notificación usando WebSocket
        const notification = {
            userId,
            message: messageContent,
        };


        sendNotificationToClients(notification);
    }

    async evaluateAllUsers() {
        try {
            const users = await getAllUsers();
            for (const user of users) {
                await this.performanceService.evaluateUserPerformance(user.id);
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