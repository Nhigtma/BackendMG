const UserPointsService = require('../core/services/userPointsService');

class UserPointsController {
    constructor(){
        this.userPointsService = new UserPointsService();
    }

    async getScore (req, res){
        const {user_id} = req.param;

        try {
            const getHistory = await this.userPointsService.getCurrentPoints(user_id);
            res.status(201).json(getHistory);
        } catch (error) {
            console.error('Error en getHistory:', error);
            res.status(500).json({ error: 'Error al obtener el historial: ' + error.message });
        }

    }
}

module.exports = UserPointsController;