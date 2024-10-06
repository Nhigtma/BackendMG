const { AppDataSource } = require('../../config/ormConfig');
const comment = require('../../core/models/comment');

class CommentRepository {
    constructor() {
        this.repository = null;
    }

    async initRepository() {
        if (!this.repository) {
            this.repository = AppDataSource.getRepository(comment);
        }
    }

    async createComment(id_wish, comment_text) {
        const newComment = this.repository.create(id_wish, comment_text);
        return await this.repository.save(newComment);
    }

    async getCommentsByWishId(wish_id) {
        return await this.repository.find({ where: { wish_id } });
    }

    async deleteComment(id) {
        return await this.repository.delete(id);
    }

    async updateComment(id, comment_text) {
        return await this.repository.update(id, comment_text);
    }
}

module.exports = CommentRepository;