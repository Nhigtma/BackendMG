const WishRepository = require('../../adapters/outbound/wishesRepository');
const RoutineWishRepository = require('../../adapters/outbound/routineWishRepository');
const routineWishService = require('../../core/services/routineWishesService');

class WishService {
    constructor() {
        this.wishRepository = new WishRepository();
        this.RoutineWishRepository = new RoutineWishRepository();
        this.routineWishService = new routineWishService();
    }

    async createWish(title, description, user_id, category_id) {
        try {
            const state_id = process.env.EN_PROGRESO;
            const newWish = await this.wishRepository.createWish(title, description, user_id, category_id,state_id );
            return newWish;
        } catch (error) {
            console.error('Error en createWish', error);
            throw new Error('Error al crear un deseo: ' + error.message);
        }
    }

    async createWishWithRoutine(title, description, user_id, category_id, routines, is_routine) {
        try {
            const state_id = process.env.RUTINA;
            const newWish = await this.wishRepository.createWishRoutine(title, description, user_id, category_id, is_routine,state_id);
        
            let createdRoutines = [];
    
            if (is_routine && routines && Object.keys(routines).length > 0) {
                console.log(newWish.id);
                console.log(routines);
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
            return await this.wishRepository.getAllwishes(user_id);
        } catch (error) {
            console.error('Error en getAllWishes', error);
            throw new Error('Error al obtener los deseos: ' + error.message);
        }
    }
    async getWishesWithLists() {
        try {
            const wishes = await this.wishRepository.getWishesWithLists();
            
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
}

module.exports = WishService;