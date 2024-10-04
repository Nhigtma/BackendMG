const RoutineWishRepository = require('../../adapters/outbound/routineWishRepository');

class RoutineWishService {
    constructor() {
        this.routineWishRepository = new RoutineWishRepository();
    }

    async createRoutineWish(wishId, routines) {
        try {
            if (!routines || Object.keys(routines).length === 0) {
                throw new Error("Debe asignar al menos una rutina.");
            }

            const createdRoutines = [];

            for (const day of Object.keys(routines)) {
                const weekDayId = process.env[day.toUpperCase()];
                if (!weekDayId) {
                    throw new Error(`Día de la semana inválido: ${day}`);
                }

                const newRoutine = await this.routineWishRepository.createRoutineWish({
                    wishId,
                    weekDayId
                });

                createdRoutines.push(newRoutine);
            }

            return createdRoutines;
        } catch (error) {
            console.error("Error al crear las rutinas:", error.message);
            throw new Error("No se pudo crear la rutina: " + error.message);
        }
    }

    async getRoutinesByWishId(wishId) {
        try {
            const routines = await this.routineWishRepository.getRoutinesByWishId(wishId);
            if (!routines || routines.length === 0) {
                throw new Error("No se encontraron rutinas asociadas a este deseo.");
            }
            return routines;
        } catch (error) {
            console.error("Error al obtener las rutinas:", error.message);
            throw new Error("No se pudieron obtener las rutinas: " + error.message);
        }
    }

    async updateRoutineWish(wishId, routines) {
        try {
            if (!routines || Object.keys(routines).length === 0) {
                throw new Error("Debe proporcionar al menos una rutina para actualizar.");
            }

            const updatedRoutines = [];

            for (const day of Object.keys(routines)) {
                const weekDayId = process.env[day.toUpperCase()];
                if (!weekDayId) {
                    throw new Error(`Día de la semana inválido: ${day}`);
                }

                const existingRoutine = await this.routineWishRepository.getRoutineByWishAndDay(wishId, weekDayId);

                if (existingRoutine) {
                    const updatedRoutine = await this.routineWishRepository.updateRoutineWish(
                        existingRoutine.id
                    );
                    updatedRoutines.push(updatedRoutine);
                } else {
                    throw new Error(`No se encontró una rutina para el día ${day} asociada a este deseo.`);
                }
            }

            return updatedRoutines;
        } catch (error) {
            console.error("Error al actualizar las rutinas:", error.message);
            throw new Error("No se pudieron actualizar las rutinas: " + error.message);
        }
    }

    async deleteRoutineWish(routineId) {
        try {
            await this.routineWishRepository.deleteRoutineWish(routineId);
            return { message: "Rutina eliminada correctamente" };
        } catch (error) {
            console.error("Error al eliminar la rutina:", error.message);
            throw new Error("No se pudo eliminar la rutina: " + error.message);
        }
    }
}

module.exports = RoutineWishService;