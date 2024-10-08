const HistoryService = require('./historyServices');
const UserPointsService = require('./userPointsService');
const MessageService = require('./MessageService');
const { createNeuralNetwork, evaluatePerformance } = require('../../config/neuralNetworkConfig');

class PerformanceService {
    constructor() {
        this.historyService = new HistoryService();
        this.userPointsService = new UserPointsService();
        this.messageService = new MessageService();
        this.network = createNeuralNetwork();
    }

    async evaluateUserPerformance(userId, sendNotification) {
        const [currentPoints, highestScore] = await Promise.all([
            this.userPointsService.getCurrentPoints(userId),
            this.historyService.getHistoryByUserId(userId),
        ]);

        const performanceScore = evaluatePerformance(this.network, currentPoints.points, highestScore.highest_score);
        const performancePercentage = performanceScore * 100;

        const messageType = performancePercentage >= 40 ? 'congratulation' : 'motivation';
        const messages = await this.messageService.getMessages(messageType);
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

        await sendNotification(userId, selectedMessage.content);
        await this.messageService.updateMessageProbability(selectedMessage.id, selectedMessage.usageProbability - 5);

        return performancePercentage;
    }
}

module.exports = PerformanceService;