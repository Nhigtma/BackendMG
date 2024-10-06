const CommentRepository = require('../../adapters/outbound/commentRepository');

class CommentService {
    constructor() {
        this.commentRepository = new CommentRepository();
    }

    async createComment(wish_id, comment_text) {
        const commentData = { wish_id, comment_text };
        return await this.commentRepository.createComment(commentData);
    }

    async getCommentsByWishId(wish_id) {
        return await this.commentRepository.getCommentsByWishId(wish_id);
    }

    async deleteComment(id) {
        return await this.commentRepository.deleteComment(id);
    }

    async updateComment(id, comment_text) {
        return await this.commentRepository.updateComment(id, { comment_text });
    }
}

module.exports = CommentService;
