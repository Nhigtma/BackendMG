const CommentService = require('../core/services/commentService');

class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    async createComment(req, res) {
        const { wish_id, comment_text } = req.body;

        try {
            if (!wish_id || !comment_text) {
                return res.status(400).json({ error: 'El wish_id y el comentario son obligatorios.' });
            }

            const newComment = await this.commentService.createComment(wish_id, comment_text);
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error en createComment:', error.message);
            res.status(500).json({ error: 'Error al crear el comentario: ' + error.message });
        }
    }

    async getCommentsByWishId(req, res) {
        const { wish_id } = req.params;

        try {
            const comments = await this.commentService.getCommentsByWishId(wish_id);
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error en getCommentsByWishId:', error.message);
            res.status(500).json({ error: 'Error al obtener los comentarios: ' + error.message });
        }
    }

    async deleteComment(req, res) {
        const { id } = req.params;

        try {
            await this.commentService.deleteComment(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error en deleteComment:', error.message);
            res.status(500).json({ error: 'Error al eliminar el comentario: ' + error.message });
        }
    }

    async updateComment(req, res) {
        const { id } = req.params;
        const { comment_text } = req.body;

        try {
            const updatedComment = await this.commentService.updateComment(id, comment_text);
            res.status(200).json(updatedComment);
        } catch (error) {
            console.error('Error en updateComment:', error.message);
            res.status(500).json({ error: 'Error al actualizar el comentario: ' + error.message });
        }
    }
}

module.exports = CommentController;
