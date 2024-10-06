const { AppDataSource } = require('../../config/ormConfig');
const UserPointsRepository = require('../../adapters/outbound/userPointsRepository');

class UserPointsService {
    constructor() {
        this.userPointsRepository = new UserPointsRepository();
    }

    async resetPoints(userId) {
        try {
            return await this.userPointsRepository.resetPoints(userId);
        } catch (error) {
            console.error('Error en resetPoints', error);
            throw new Error('Error al reiniciar puntos: ' + error.message);
        }
    }

    async getCurrentPoints(userId) {
        try {
            return await this.userPointsRepository.getUserPoints(userId);
        } catch (error) {
            console.error('Error en getCurrentPoints', error);
            throw new Error('Error al obtener puntos actuales: ' + error.message);
        }
    }

    async updateUserPoints(user_id,points){
        try{
            return await this.userPointsRepository.updateUserPoints(user_id , points)
        }catch (error) {
            console.error('Error en updateUserPoints', error);
            throw new Error('Error al actualizar los puntos: ' + error.message);
        }
    }
    
    async updateMultiplier(user_id){
        try {
            return await this.userPointsRepository.updateMultiplier(user_id)
        } catch (error) {
            console.error('Error en updateMultiplier', error);
            throw new Error('Error al actualizar el multiplicador: ' + error.message);
        }

    }
}

module.exports = UserPointsService;