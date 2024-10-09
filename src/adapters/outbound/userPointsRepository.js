const { AppDataSource } = require('../../config/ormConfig');
const UserPoints = require('../../core/models/userPoints');
const HistoryRepository = require('../../adapters/outbound/historyRespository')

class UserPointsRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {

            this.repository = AppDataSource.getRepository(UserPoints);
        }
    }

    async createUserPoints(user_id) {
        await this.initRepository();
        const points = 0;
        const multiplier = 1.0;
        const userPoints = await this.repository.create({ user_id, points, multiplier });
        return userPoints
    }
    async getUserPoints(user_id) {
        await this.initRepository();
        const points = await this.repository.findOne({ where: { user_id } });
        console.log(points);
        return points;
    }

    async updateUserPoints(user_id, points) {
        await this.initRepository();
        const userPoints = await this.getUserPoints(user_id);
        if (!userPoints) {
            const newUserPoints = this.repository.create({ user_id, points });
            return await this.repository.save(newUserPoints);
        } else {
            const x = userPoints.multiplier;
            const y = points;
            const newPoints = (x * y)
            userPoints.points += newPoints;
            return await this.repository.save(userPoints);
        }
    }

    async resetPoints(user_id) {
        await this.initRepository();
        let userPoints = await this.getUserPoints(user_id);

        if (userPoints === null) {
            userPoints = await this.createUserPoints(user_id);
        }

        const historyRepo = new HistoryRepository();
        await historyRepo.updateHighestScore(user_id, userPoints.points);

        userPoints.points = 0;
        userPoints.multiplier = 1.0;

        return await this.repository.save(userPoints);
    }


    async updateMultiplier(user_id) {
        await this.initRepository();
        const userPoints = await this.getUserPoints(user_id);
        if (userPoints.multiplier < 5.0) {
            userPoints.multiplier = (userPoints.multiplier + 0.5);
        }
        return userPoints;
    }
}

module.exports = UserPointsRepository;