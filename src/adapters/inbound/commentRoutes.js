const express = require('express');
const CommentController = require('../../ports/commentController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const commentController = new CommentController();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestión de comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del comentario.
 *         wish_id:
 *           type: string
 *           description: El ID del deseo al que pertenece el comentario.
 *         comment_text:
 *           type: string
 *           description: El texto del comentario.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora en que se creó el comentario.
 *       required:
 *         - wish_id
 *         - comment_text
 */

/**
 * @swagger
 * /protected/comment/create:
 *   post:
 *     summary: Crea un nuevo comentario
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wish_id:
 *                 type: string
 *                 description: ID del deseo al cual pertenece el comentario.
 *               comment_text:
 *                 type: string
 *                 description: Texto del comentario.
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: El wish_id y el comentario son obligatorios.
 *       500:
 *         description: Error al crear el comentario
 */
router.post('/create', authMiddleware, (req, res) => commentController.createComment(req, res));

/**
 * @swagger
 * /protected/comment/allcomment/{wish_id}:
 *   get:
 *     summary: Obtiene todos los comentarios por wish_id
 *     tags: [Comments]
 *     parameters:
 *       - name: wish_id
 *         in: path
 *         required: true
 *         description: ID del deseo al cual pertenecen los comentarios
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       404:
 *         description: No se encontraron comentarios para este deseo
 *       500:
 *         description: Error al obtener los comentarios
 */
router.get('/allcomment/:wish_id', authMiddleware, (req, res) => commentController.getCommentsByWishId(req, res));

/**
 * @swagger
 * /protected/comment/{id}:
 *   delete:
 *     summary: Elimina un comentario por ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comentario que se quiere eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comentario eliminado exitosamente
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error al eliminar el comentario
 */
router.delete('/:id', authMiddleware, (req, res) => commentController.deleteComment(req, res));

/**
 * @swagger
 * /protected/comment/{id}:
 *   put:
 *     summary: Actualiza un comentario por ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comentario que se quiere actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_text:
 *                 type: string
 *                 description: Nuevo texto del comentario.
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error al actualizar el comentario
 */
router.put('/:id', authMiddleware, (req, res) => commentController.updateComment(req, res));

module.exports = router;
