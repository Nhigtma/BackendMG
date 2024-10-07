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
            console.log('Datos recibidos:');
            console.log('Title:', title);
            console.log('Description:', description);
            console.log('User ID:', user_id);
            console.log('Category ID:', category_id);
            console.log('Routines:', routines);
            console.log('Is Routine:', is_routine);
    
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
        const { user_id } = req.params;
    
        if (!user_id) {
            return res.status(400).json({ message: "El user_id es requerido." });
        }
    
        try {
            const wishesWithLists = await this.wishService.getWishesWithLists(user_id);
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

    async generatePDF(req, res) {
        // Asegúrate de que req.params existe
        console.log(req.params); // Añade esto para depurar

        const { userId } = req.params; // Aquí es donde se genera el error si userId no existe

        if (!userId) {
            return res.status(400).json({ error: 'El userId es requerido.' });
        }

        try {
            const pdfPath = await this.wishService.generatePDF(userId);
            res.download(pdfPath, (err) => {
                if (err) {
                    console.error('Error al enviar el PDF:', err);
                    res.status(500).send('Error al generar el PDF');
                }
            });
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).send('Error al generar el PDF');
        }
    }
}

module.exports = RoutineWishController;