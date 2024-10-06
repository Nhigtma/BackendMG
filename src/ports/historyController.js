const HistoryService = require('../core/services/historyServices');

class HistoryController {
    constructor(){
        this.historyService = new HistoryService();
    }

    async getHistory (req, res){
        const {user_id} = req.param;

        try {
            const getHistory = await this.historyService.getHistory(user_id);
            res.status(201).json(getHistory);
        } catch (error) {
            console.error('Error en getHistory:', error);
            res.status(500).json({ error: 'Error al obtener el historial: ' + error.message });
        }

    }
}

module.exports = HistoryController;