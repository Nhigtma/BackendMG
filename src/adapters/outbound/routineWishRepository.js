const { AppDataSource } = require('../../config/ormConfig');
const RoutineWish = require('../../core/models/routineWish');

class RoutineWishRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(RoutineWish);
        }
    }

    async createRoutineWish(wishId, weekDayId, routineDescription, routines) {
        await this.initRepository();
        const newRoutineWish = this.repository.create({
            wish_id: wishId,
            week_day_id: weekDayId,
            routine_description: routineDescription,
            routines: routines
        });
        return await this.repository.save(newRoutineWish);
    }

    async getRoutinesByWishId(wishId) {
        await this.initRepository();
        return await this.repository.find({ where: { wish_id: wishId } });
    }

    async updateRoutineWish(routineId, routineDescription, routines) {
        await this.initRepository();
        await this.repository.update(routineId, {
            routine_description: routineDescription,
            routines: routines
        });
        return await this.repository.findOne(routineId);
    }

    async deleteRoutineWish(routineId) {
        await this.initRepository();
        return await this.repository.delete(routineId);
    }
}

module.exports = RoutineWishRepository;