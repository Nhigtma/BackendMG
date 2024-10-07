const WishRepository = require('../../adapters/outbound/wishesRepository');
const RoutineWishRepository = require('../../adapters/outbound/routineWishRepository');
const routineWishService = require('../../core/services/routineWishesService');
const UserPointsService = require('../services/userPointsService');
const HistoryService = require('../services/historyServices');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');


class WishService {
    constructor() {
        this.wishRepository = new WishRepository();
        this.RoutineWishRepository = new RoutineWishRepository();
        this.routineWishService = new routineWishService();
        this.userPointsService = new UserPointsService();
        this.historyService = new HistoryService();

    }

    estados = {
        RUTINA: "0647ca37-553d-4c80-9d91-a821e08c1a6d",
        FINALIZADA: "30d5f606-6b40-4243-991b-ea654a04baf3",
        EN_PROGRESO: "95795a6f-0479-421d-8482-7dd1f5a0fd05",
        ABANDONADA: "a7db2056-474c-4214-96c1-ad5e24a1d5b0"
    }

    async createWish(title, description, user_id, category_id) {
        try {
            const state_id = this.estados.EN_PROGRESO;
            const daylyCounter = 0;
            const wasperformed = false;
            const newWish = await this.wishRepository.createWish(title, description, user_id, category_id, state_id, daylyCounter, wasperformed);
            return newWish;
        } catch (error) {
            console.error('Error en createWish', error);
            throw new Error('Error al crear un deseo: ' + error.message);
        }
    }

    async createWishWithRoutine(title, description, user_id, category_id, routines, is_routine) {
        try {
            const state_id = this.estados.RUTINA;
            const daylyCounter = 0;
            const wasperformed = false;
            const newWish = await this.wishRepository.createWishRoutine(title, description, user_id, category_id, is_routine, state_id, daylyCounter, wasperformed);

            let createdRoutines = [];

            if (is_routine && routines && Object.keys(routines).length > 0) {
                createdRoutines = await this.routineWishService.createRoutineWish(newWish.id, routines);
            }

            return {
                wish: newWish,
                routines: createdRoutines
            };
        } catch (error) {
            console.error('Error en createWishWithRoutine:', error);
            throw new Error('Error al crear un deseo con rutina: ' + error.message);
        }
    }

    async getWishById(id) {
        try {
            const wish = await this.wishRepository.getWishById(id);

            if (wish.is_routine) {
                const routines = await this.RoutineWishRepository.getRoutinesByWishId(id);
                return { ...wish, routines };
            }

            return wish;
        } catch (error) {
            console.error('Error en getWishById', error);
            throw new Error('Error al obtener el deseo: ' + error.message);
        }
    }

    async getAllWishes(user_id) {
        try {
            return await this.wishRepository.getAllWishes(user_id);
        } catch (error) {
            console.error('Error en getAllWishes', error);
            throw new Error('Error al obtener los deseos: ' + error.message);
        }
    }

    async getWishesWithLists(user_id) {
        try {
            const wishes = await this.wishRepository.getAllWisheslist(user_id);
            
            if (!wishes || wishes.length === 0) {
                return [];
            }
    
            const wishesWithRoutines = await Promise.all(wishes.map(async (wish) => {
                if (wish.is_routine) {
                    const routines = await this.RoutineWishRepository.getRoutinesByWishId(wish.id);
                    return {
                        ...wish,
                        routines
                    };
                }
                return wish;
            }));
    
            return wishesWithRoutines;
        } catch (error) {
            console.error('Error en getWishesWithLists', error);
            throw new Error('Error al obtener los deseos con listas: ' + error.message);
        }
    }

    async updateWish(id, title, description) {
        try {
            return await this.wishRepository.updateWish(id, title, description);
        } catch (error) {
            console.error('Error en updateWish', error);
            throw new Error('Error al actualizar el deseo: ' + error.message);
        }
    }

    async deleteWish(id) {
        try {
            const wish = await this.wishRepository.getWishById(id);

            if (wish.is_routine) {
                await this.RoutineWishRepository.deleteRoutinesByWishId(id);
            }

            return await this.wishRepository.deleteWish(id);
        } catch (error) {
            console.error('Error en deleteWish', error);
            throw new Error('Error al eliminar el deseo: ' + error.message);
        }
    }

    async completeWish(wish_id, user_id) {
        try {
            const wish = await this.getWishById(wish_id);
            if (!wish) throw new Error('Wish not found');

            if (wish.is_routine) throw new Error('This wish is a routine. Use performRoutine instead.');
            await this.wishRepository.completeWish(wish_id);
            const createdDate = new Date(wish.created_at);
            const completedDate = new Date();
            const daysElapsed = Math.floor((completedDate - createdDate) / (1000 * 60 * 60 * 24));
            const points = Math.floor((daysElapsed / 1.5) * 50);

            return await this.routineWishService.updateRoutineWish(user_id, points);
        } catch (error) {
            console.error('Error en completeWish', error);
            throw new Error('Error al completar el deseo: ' + error.message);
        }
    }

    async performRoutine(wish_id, user_id) {
        try {
            const wish = this.wishRepository.getWishById(wish_id);
            await this.wishRepository.updateWeeklyCounter(wish);
            return await this.wishRepository.performRoutine(wish_id, user_id);
        } catch (error) {
            console.error('Error en performRoutine', error);
            throw new Error('Error al completar la rutina: ' + error.message);
        }
    }

    async resetWasPerformed() {
        const wishes = await this.wishRepository.getWishesWithLists();
        let updated = false;
    
        for (const wish of wishes) {
            const updatedWish = await this.wishRepository.updateWasPerformed(wish.id);
            if (updatedWish) {
                updated = true;
            }
        }
    
        return updated ? 'Rutinas actualizadas correctamente.' : 'No se encontraron rutinas que actualizar.';
    }

    async updateWeeklyCounter(wish) {
        if (wish.is_routine && wish.wasperformed) {
            let newCounter = wish.weekly_counter + 1;
            if (newCounter === 7) {
                await this.userPointsService.updateMultiplier(wish.user_id)
                newCounter = 0;
            }
            await this.wishRepository.updateWeeklyCounter(wish.id, newCounter);
        }
    }

    async getWishByCategory(category_id) {
        try {
            const wishes = await this.wishRepository.getWishesByCategory(category_id);
            console.log (wishes);
            return wishes;
        } catch (error) {
            console.error('Error en getWishesByCategory', error);
            throw new Error('Error al obtener los deseos de category: ' + error.message);
        }
    }

    async generatePDF(req, res) {
        const userId = req.params.userId;
        const dias = {
            LUNES: "3eaf730d-79f4-481b-9779-61f05370bf94",
            MARTES: "db467a33-3486-439a-9a26-11864fb55be6",
            MIERCOLES: "004e5c38-9266-4eb0-b71b-05b462c24d30",
            JUEVES: "6c5d6e27-8594-4999-8129-5a618c869ce5",
            VIERNES: "c53082d3-12a5-4f0d-b794-ce4fa8d8307e",
            SABADO: "44079d90-eb72-4216-a887-fc8e130f8ea8",
            DOMINGO: "d03406b9-ec67-45aa-8454-3e848ac3fcbf"
        };
    
        const weekOrder = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
        const wishesWithRoutines = await this.getWishesWithLists(userId);
        
        const routinesByDay = {};
    
        wishesWithRoutines.forEach(wish => {
            if (wish.is_routine) {
                const routines = wish.routines;
                routines.forEach(routine => {
                    const dayKey = Object.keys(dias).find(day => dias[day] === routine.week_day_id);
                    if (dayKey) {
                        if (!routinesByDay[dayKey]) {
                            routinesByDay[dayKey] = [];
                        }
                        routinesByDay[dayKey].push({ wishTitle: wish.title });
                    }
                });
            }
        });
    
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=routines_${userId}.pdf`);
    
        doc.pipe(res);
    
        doc.fontSize(25).text('Rutinas de la semana', { align: 'center' });
        doc.moveDown();
    
        let dayIndex = 0;
        let totalRoutines = 0;
        Object.values(routinesByDay).forEach(routines => {
            totalRoutines += routines.length;
        });
    
        let printedRoutines = 0;
        while (printedRoutines < totalRoutines) {
            const currentDay = weekOrder[dayIndex % weekOrder.length];
            const routines = routinesByDay[currentDay];
            if (routines && routines.length > 0) {
                doc.fontSize(20).text(currentDay);
                doc.fontSize(14).text('Rutinas:');
                routines.forEach(routine => {
                    doc.text(`- ${routine.wishTitle}`);
                    printedRoutines++;
                });
                doc.moveDown();
            }
            dayIndex++;
        }
    
        doc.end();
    }
}

module.exports = WishService;