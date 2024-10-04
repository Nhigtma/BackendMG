const RoutineWishService = require('../core/services/routineWishesService');
const WishService = require('../core/services/wishService');

class RoutineWishController {
    constructor() {
        this.routineWishService = new RoutineWishService();
        this.wishService = new WishService();
    }

    async createWishWithRoutine(req, res) {
        const { title, description, user_id, category_id, routines, is_routine } = req.body;

        try {
            if (!title || !description || !user_id || !category_id || !routines || !is_routine) {
                return res.status(400).json({ message: "Faltan datos requeridos." });
            }

            const result = await this.wishService.createWishWithRoutine(
                title,
                description,
                user_id,
                category_id,
                routines,
                is_routine
            );

            return res.status(201).json({
                message: "Deseo creado con éxito",
                wish: result.wish,
                routines: result.routines
            });

        } catch (error) {
            console.error('Error en createWishWithRoutine:', error.message);
            return res.status(500).json({ message: "Error al crear el deseo con rutina: " + error.message });
        }
    }

    async getRoutinesByWishId(req, res) {
        const { wishId } = req.params;

        try {
            const routines = await this.routineWishService.getRoutinesByWishId(wishId);
            return res.status(200).json(routines);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getWishesWithLists(req, res) {
        try {
            const wishesWithLists = await this.wishService.getWishesWithLists();
            return res.status(200).json(wishesWithLists);
        } catch (error) {
            console.error('Error en getWishesWithLists:', error.message);
            return res.status(500).json({ message: "Error al obtener los deseos con listas: " + error.message });
        }
    }

    async updateRoutineWish(req, res) {
        const { wishId } = req.params;
        const { routines } = req.body;

        try {
            const updatedRoutines = await this.routineWishService.updateRoutineWish(wishId, routines);
            return res.status(200).json(updatedRoutines);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteRoutineWish(req, res) {
        const { routineId } = req.params;

        try {
            const result = await this.routineWishService.deleteRoutineWish(routineId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = RoutineWishController;