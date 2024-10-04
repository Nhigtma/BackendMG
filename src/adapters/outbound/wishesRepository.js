const { AppDataSource } = require('../../config/ormConfig');
const Wish = require('../../core/models/wishes');

class WishRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(Wish);
        }
    }

    async createWish(title, description, user_id, category_id, state_id) {
        await this.initRepository();
        const wish = this.repository.create({ title, description, user_id, category_id, state_id });
        return await this.repository.save(wish);
    }

    async getWishById(id) {
        await this.initRepository();
        return await this.repository.findOne({ where: { id } });
    }

    async getAllWishes(user_id) {
        await this.initRepository();
        return await this.repository.find({ where: { user_id } });
    }

    async getWishesWithLists() {
        try {
            return await this.repository.find({ where: { is_routine: true } });
        } catch (error) {
            console.error('Error en getWishesWithLists', error);
            throw new Error('Error al obtener los deseos con listas: ' + error.message);
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

    async deleteWish(id) {
        await this.initRepository();
        const result = await this.repository.delete({ id });
        if (result.affected === 0) throw new Error('Wish not found');
        return result;
    }
}

module.exports = WishRepository;