const { AppDataSource } = require('../../config/ormConfig');
const Category = require('../../core/models/category');

class CategoryRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(Category);
        }
    }

    async createCategory(name, description) {
        await this.initRepository();
        const category = this.repository.create({ name, description });
        return await this.repository.save(category);
    }

    async getCategoryById(id) {
        await this.initRepository();
        return await this.repository.findOne({ where: { id } });
    }

    async getAllCategories() {
        await this.initRepository();
        return await this.repository.find();
    }

    async updateCategory(id, name, description) {
        await this.initRepository();
        const category = await this.repository.findOne({ where: { id } });
        if (!category) throw new Error('Category not found');
        category.name = name;
        category.description = description;
        return await this.repository.save(category);
    }

    async deleteCategory(id) {
        await this.initRepository();
        const result = await this.repository.delete({ id });
        if (result.affected === 0) throw new Error('Category not found');
        return result;
    }
}

module.exports = CategoryRepository;