const { AppDataSource } = require('../../config/ormConfig');
const Wish = require('../../core/models/wishes');
const UserPointsRepository = require('../../adapters/outbound/userPointsRepository');
const { validate: isUuid } = require('uuid');


class WishRepository {
    estados = {
        RUTINA: "0647ca37-553d-4c80-9d91-a821e08c1a6d",
        FINALIZADA: "30d5f606-6b40-4243-991b-ea654a04baf3",
        EN_PROGRESO: "95795a6f-0479-421d-8482-7dd1f5a0fd05",
        ABANDONADA: "a7db2056-474c-4214-96c1-ad5e24a1d5b0"
    }
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(Wish);
        }
    }

    async createWish(title, description, user_id, category_id, state_id, weekly_counter, wasperformed) {
        await this.initRepository();
        const wish = this.repository.create({ title, description, user_id, category_id, state_id, weekly_counter, wasperformed });
        console.log('datos de creacion: '+wish);
        return await this.repository.save(wish);
    }
    async createWishRoutine(title, description, user_id, category_id, is_routine, state_id, weekly_counter, wasperformed) {
        await this.initRepository();
        const wish = this.repository.create({ title, description, user_id, category_id, is_routine, state_id, weekly_counter, wasperformed });
        console.log('Creando nuevo deseo con los siguientes datos:', {
            title,
            description,
            user_id,
            category_id,
            is_routine,
            state_id,
            weekly_counter,
            wasperformed
        });
        return await this.repository.save(wish);
    }

    async getWishById(id) {
        await this.initRepository();
        return await this.repository.findOne({ where: { id } });
    }

    async getAllWishes(user_id) {
        await this.initRepository();
        return await this.repository.find({ where: { user_id, is_routine: false, state_id: this.estados.EN_PROGRESO } });
    }

    async getWishesWithLists() {
        try {
            return await this.repository.find({ where: { is_routine: true, state_id: this.estados.RUTINA } });
        } catch (error) {
            console.error('Error en getWishesWithLists', error);
            throw new Error('Error al obtener los deseos con listas: ' + error.message);
        }
    }

    async getWishesByCategory(category_id) {
        await this.initRepository();
        try {
            console.log(`Buscando deseos para la categoría: ${category_id}`);
            if (!category_id || !isUuid(category_id)) {
                throw new Error('El ID de la categoría es inválido o requerido.');
            }
    
            const wishes = await this.repository.find({
                where: { category_id }
            });
    
            console.log(`Deseos encontrados:`, wishes);
    
            if (wishes.length === 0) {
                console.log(`No se encontraron deseos para la categoría con ID: ${category_id}`);
            }
    
            return wishes;
        } catch (error) {
            console.error('Error en getWishesByCategory:', error.message || error);
            throw new Error('Error al obtener los deseos de la categoría.');
        }
    }

    async getWishesFinalizados(user_id) {
        try {
            return await this.repository.find({ where: { user_id, state_id: this.estados.FINALIZADA } });
        } catch (error) {
            console.error('Error en getWishesFinalizados', error);
            throw new Error('Error al obtener los deseos finalizados: ' + error.message);
        }
    }

    async updateWish(id, title, description) {
        await this.initRepository();
        const wish = await this.repository.findOne({ where: { id } });
        if (!wish) throw new Error('Wish not found');
        wish.title = title;
        wish.description = description;
        return await this.repository.save(wish);
    }
    async updateWasPerformed(wishId) {
        await this.initRepository();
        const wish = await this.repository.findOne({ where: { id: wishId } });
        if (!wish) {
            throw new Error('Wish not found');
        }

        if (wish.wasperformed) {
            const userPointsRepo = new UserPointsRepository();
            await userPointsRepo.resetPoints(wish.user_id);

            wish.wasperformed = false;
        } else {
            wish.wasperformed = true;
        }

        return await this.repository.save(wish);
    }

    async deleteWish(id) {
        await this.initRepository();
        const result = await this.repository.delete({ id });
        if (result.affected === 0) throw new Error('Wish not found');
        return result;
    }

    async completeWish(wish_id) {
        await this.initRepository();
        const wish = await this.getWishById(wish_id);
        if (!wish) throw new Error('Wish not found');

        if (wish.is_routine) throw new Error('This wish is a routine. Use performRoutine instead.');

        wish.state_id = process.env.FINALIZADA;
        return await this.repository.save(wish);
    }

    async performRoutine(wish_id, user_id) {
        await this.initRepository();
        const wish = await this.getWishById(wish_id);
        if (!wish || !wish.is_routine) throw new Error('Routine not found');


        wish.wasperformed = true;
        await this.repository.save(wish);


        const points = 100;
        const userPointsRepo = new UserPointsRepository();
        const userPoints = await userPointsRepo.updateUserPoints(user_id, points);
        return userPoints;
    }

    async updateWeeklyCounter(wish_id, counterValue) {
        await this.initRepository();
        const wish = await this.getWishById(wish_id);
        if (!wish) throw new Error('Wish not found');

        wish.weekly_counter = counterValue;
        return await this.repository.save(wish);
    }
}

module.exports = WishRepository;