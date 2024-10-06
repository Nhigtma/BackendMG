const HistoryRepository = require('../../adapters/outbound/historyRespository');

class HistoryService {
    constructor() {
        this.historyRepository = new HistoryRepository();
    }

    async getHistory(user_id){
        try {
            return await this.historyRepository.getHistory(user_id)
        } catch (error) {
            console.error('Error en getHistory', error);
            throw new Error('Error al obtener el historial: ' + error.message);
        }
    }

    async getHistoryByUserId(userId) {
        try {
            return await this.historyRepository.getHighestScore(userId);
        } catch (error) {
            console.error('Error en getHistoryByUserId', error);
            throw new Error('Error al obtener historial por usuario: ' + error.message);
        }
    }

    async updateHighestScore(userId, newScore) {
        try {
            return await this.historyRepository.updateHighestScore(userId, newScore);
        } catch (error) {
            console.error('Error en updateHighestScore', error);
            throw new Error('Error al actualizar la puntuación más alta: ' + error.message);
        }
    }
}

module.exports = HistoryService;