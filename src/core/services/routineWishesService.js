const RoutineWishRepository = require('../../adapters/outbound/routineWishRepository');
require('dotenv').config();


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
            const dias = {
                LUNES: "3eaf730d-79f4-481b-9779-61f05370bf94",
                MARTES: "db467a33-3486-439a-9a26-11864fb55be6",
                MIERCOLES: "004e5c38-9266-4eb0-b71b-05b462c24d30",
                JUEVES: "6c5d6e27-8594-4999-8129-5a618c869ce5",
                VIERNES: "c53082d3-12a5-4f0d-b794-ce4fa8d8307e",
                SABADO: "44079d90-eb72-4216-a887-fc8e130f8ea8",
                DOMINGO: "d03406b9-ec67-45aa-8454-3e848ac3fcbf"
            };
            console.log("deseo routtine "+wishId)
            console.log("rutina routine"+routines)
            for (const day of Object.keys(routines)) {
                const dayUppercase = day.toUpperCase();
                const weekDayId = process.env[dayUppercase]; // Aquí obtienes el ID del día desde el .env
            
                if (weekDayId) {
                    // Llama a createRoutineWish pasando los valores individuales
                    const newRoutine = await this.routineWishRepository.createRoutineWish(
                        wishId,          // Este es el UUID del deseo
                        weekDayId,       // Este es el UUID del día
                        routines[day]    // Este es el JSONB (o string) que representa las rutinas
                    );
            
                    createdRoutines.push(newRoutine);
                } else {
                    console.error(`No se encontró el ID para el día: ${day}`);
                }
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