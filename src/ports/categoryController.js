const CategoryService = require('../core/services/categoryService');

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    async createCategory(req, res) {
        const { name, description } = req.body;

        try {
            if (!name || !description) {
                return res.status(400).json({ error: 'El nombre y la descripción son obligatorios.' });
            }

            const newCategory = await this.categoryService.createCategory(name, description);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error en createCategory:', error);
            res.status(500).json({ error: 'Error al crear la categoría: ' + error.message });
        }
    }

    async getCategoryById(req, res) {
        const { id } = req.params;

        try {
            const category = await this.categoryService.getCategoryById(id);
            res.status(200).json(category);
        } catch (error) {
            console.error('Error en getCategoryById:', error);
            res.status(404).json({ error: 'Categoría no encontrada: ' + error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error en getAllCategories:', error);
            res.status(500).json({ error: 'Error al obtener las categorías: ' + error.message });
        }
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;

        try {
            const updatedCategory = await this.categoryService.updateCategory(id, name, description);
            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error('Error en updateCategory:', error);
            res.status(500).json({ error: 'Error al actualizar la categoría: ' + error.message });
        }
    }

    async deleteCategory(req, res) {
        const { id } = req.params;

        try {
            await this.categoryService.deleteCategory(id);
            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        } catch (error) {
            console.error('Error en deleteCategory:', error);
            res.status(500).json({ error: 'Error al eliminar la categoría: ' + error.message });
        }
    }
}

module.exports = CategoryController;