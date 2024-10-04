const { AppDataSource } = require('../../config/ormConfig');
const User = require('../../core/models/user');

class UserRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(User);
        }
    }

    async createUser(id, username, email) {
        await this.initRepository();
        const user = this.repository.create({id, username, email });
        return await this.repository.save(user);
    }

    async getUserById(id) {
        await this.initRepository();
        return await this.repository.findOne({ where: { id } });
    }

    async getAllUsers() {
        await this.initRepository();
        return await this.repository.find();
    }

    async deleteUser(id) {
        await this.initRepository();
        const result = await this.repository.delete({ id });
        if (result.affected === 0) throw new Error('User not found');
        return result;
    }
}

module.exports = UserRepository;