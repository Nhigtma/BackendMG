const CategoryRepository = require('../../adapters/outbound/categoryRepository');

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async createCategory(name, description) {
        try {
            const newCategory = await this.categoryRepository.createCategory(name, description);
            return newCategory;
        } catch (error) {
            console.error('Error en createCategory:', error);
            throw new Error('Error al crear la categoría: ' + error.message);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await this.categoryRepository.getCategoryById(id);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }
            return category;
        } catch (error) {
            console.error('Error en getCategoryById:', error);
            throw new Error('Error al obtener la categoría: ' + error.message);
        }
    }

    async getAllCategories() {
        try {
            return await this.categoryRepository.getAllcategory();
        } catch (error) {
            console.error('Error en getAllCategories:', error);
            throw new Error('Error al obtener todas las categorías: ' + error.message);
        }
    }

    async updateCategory(id, name, description) {
        try {
            const updatedCategory = await this.categoryRepository.updateCategory(id, name, description);
            return updatedCategory;
        } catch (error) {
            console.error('Error en updateCategory:', error);
            throw new Error('Error al actualizar la categoría: ' + error.message);
        }
    }

    async deleteCategory(id) {
        try {
            return await this.categoryRepository.deleteCategory(id);
        } catch (error) {
            console.error('Error en deleteCategory:', error);
            throw new Error('Error al eliminar la categoría: ' + error.message);
        }
    }
}

module.exports = CategoryService;