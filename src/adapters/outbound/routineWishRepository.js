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

    async createRoutineWish(wishId, weekDayId, routines) {
        await this.initRepository();
        console.log("deseo id " + wishId);
        console.log("día " + weekDayId);
        console.log("rutina " + routines);


        const newRoutineWish = this.repository.create({
            wish_id: wishId,
            week_day_id: weekDayId,
            routines: routines
        });


        return await this.repository.save(newRoutineWish);
    }

    async getRoutinesByWishId(wishId) {
        await this.initRepository();
        return await this.repository.find({ where: { wish_id: wishId } });
    }

    async updateRoutineWish(routineId, routines) {
        await this.initRepository();
        await this.repository.update(routineId, {
            routines: routines
        });
        return await this.repository.findOne({ where: { id: routineId } });
    }

    async deleteRoutineWish(routineId) {
        await this.initRepository();
        return await this.repository.delete({ id: routineId });
    }
}

module.exports = RoutineWishRepository;