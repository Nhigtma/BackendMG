const WishService = require('../core/services/wishService');
const WishRepository = require('../adapters/outbound/wishesRepository');

class WishController {
    constructor() {
        this.wishRepository = new WishRepository();
        this.wishService = new WishService(this.wishRepository);
    }

    async createWish(req, res) {
        const { title, description, user_id, category_id } = req.body;

        try {
            if (!title || !description || !user_id || !category_id) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }

            const newWish = await this.wishService.createWish(title, description, user_id, category_id);
            res.status(201).json(newWish);
        } catch (error) {
            console.error('Error en createWish:', error.message);
            res.status(500).json({ error: 'Error al crear el deseo: ' + error.message });
        }
    }

    async getWishById(req, res) {
        const { id } = req.params;

        try {
            const wish = await this.wishService.getWishById(id);
            if (!wish) {
                return res.status(404).json({ error: 'Deseo no encontrado' });
            }
            res.status(200).json(wish);
        } catch (error) {
            console.error('Error en getWishById:', error.message);
            res.status(500).json({ error: 'Error al obtener el deseo: ' + error.message });
        }
    }

    async getAllWishes(req, res) {
        const { user_id } = req.params;

        try {
            const wishes = await this.wishService.getAllWishes(user_id);
            res.status(200).json(wishes);
        } catch (error) {
            console.error('Error en getAllWishes:', error.message);
            res.status(500).json({ error: 'Error al obtener los deseos: ' + error.message });
        }
    }

    async updateWish(req, res) {
        const { id } = req.params;
        const { title, description } = req.body;

        try {
            const updatedWish = await this.wishService.updateWish(id, title, description);
            res.status(200).json(updatedWish);
        } catch (error) {
            console.error('Error en updateWish:', error.message);
            res.status(500).json({ error: 'Error al actualizar el deseo: ' + error.message });
        }
    }

    async deleteWish(req, res) {
        const { id } = req.params;

        try {
            await this.wishService.deleteWish(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error en deleteWish:', error.message);
            res.status(500).json({ error: 'Error al eliminar el deseo: ' + error.message });
        }
    }

    async completeWish(req, res) {
        const {wish_id} = req.params;
        const {user_id} = req.body;

        try {
            const completeWish = await this.wishService.completeWish(wish_id, user_id);
            res.status(200).json(completeWish);
        } catch (error) {
            console.error('error en completeWish: ', error.message);
            res.status(500).json({ error: 'Error al completar el deseo: ' + error.message});
        }
    }

    async performRoutine (req, res) {
        const {wish_id} = req.params;
        const {user_id} = req.body;

        try {
            const performRoutine = await this.wishService.performRoutine(wish_id, user_id);
            res.status(200).json(performRoutine);
        } catch (error) {
            console.error('Error al realizar la rutina: ', error.message);
            res.status(500).json({error: 'Error al realizar la rutina ' + error.message});
        }
    }

    async getWishByCategory (req,res){
        const {category_id} = req.params;

        try {
            const wishes = await this.wishService.getWishByCategory(category_id);
            console.log(wishes);
            res.status(200).json(wishes);
        } catch (error) {
            console.error('Error en getWishByCategory: ', error.message);
            res.status(500).json({error: 'Error al obtener los deseos de la categoria ' + error.message});
        }
    }
}

module.exports = WishController;