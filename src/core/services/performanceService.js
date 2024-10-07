const HistoryService = require('./historyServices');
const UserPointsService = require('./userPointsService');
const MessageService = require('./MessageService');
const NotificationService = require('./notificationService.js');
const { createNeuralNetwork, evaluatePerformance } = require('../../config/neuralNetworkConfig');

class PerformanceService {
    constructor() {
        this.historyService = new HistoryService();
        this.userPointsService = new UserPointsService();
        this.messageService = new MessageService();
        this.notificationService = new NotificationService();
        this.network = createNeuralNetwork();
    }

    async evaluateUserPerformance(userId) {
        const [currentPoints, highestScore] = await Promise.all([
            this.userPointsService.getCurrentPoints(userId),
            this.historyService.getHistoryByUserId(userId),
        ]);

        const performance = evaluatePerformance(this.network, currentPoints.points, highestScore.highest_score);
        
        const messageType = performance ? 'congratulation' : 'motivation';
        const messages = await this.messageService.getMessages(messageType);
        
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        
        await this.notificationService.sendNotification(userId, selectedMessage.content);
        
        await this.messageService.updateMessageProbability(selectedMessage.id, selectedMessage.usageProbability - 5);
    }
}

module.exports = PerformanceService;