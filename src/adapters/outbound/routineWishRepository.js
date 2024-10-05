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
        console.log("deseo id " + wishId); // Asegúrate de que es un UUID válido
        console.log("día " + weekDayId); // Asegúrate de que es un UUID válido
        console.log("rutina " + routines); // Debe ser un JSON válido o string
    
        // Crea un nuevo objeto RoutineWish
        const newRoutineWish = this.repository.create({
            wish_id: wishId, // UUID válido para wish_id
            week_day_id: weekDayId, // UUID válido para week_day_id
            routines: routines // JSONB field, se recomienda serializar si es necesario
        });
    
        // Guarda la nueva rutina en la base de datos
        return await this.repository.save(newRoutineWish);
    }

    async getRoutinesByWishId(wishId) {
        await this.initRepository();
        return await this.repository.find({ where: { wish_id: wishId } });
    }

    async updateRoutineWish(routineId, routines) {
        await this.initRepository();
        await this.repository.update(routineId, {
            routines: routines // Actualiza directamente el campo routines (JSONB)
        });
        return await this.repository.findOne({ where: { id: routineId } });
    }

    async deleteRoutineWish(routineId) {
        await this.initRepository();
        return await this.repository.delete({ id: routineId });
    }
}

module.exports = RoutineWishRepository;