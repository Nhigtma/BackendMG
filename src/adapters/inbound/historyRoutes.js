const express = require('express');
const router = express.Router();
const HistoryController = require('../../ports/historyController');
const authMiddleware = require('../../middleweres/verifyToken');

const historyController = new HistoryController();

/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del historial
 *         user_id:
 *           type: string
 *           description: ID del usuario asociado
 *         highest_score:
 *           type: integer
 *           description: Puntuación más alta lograda por el usuario
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se completó la última rutina
 *         created_date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *
 *     Wish:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del deseo.
 *         user_id:
 *           type: string
 *           description: El ID del usuario que creó el deseo.
 *         title:
 *           type: string
 *           description: El título del deseo.
 *         description:
 *           type: string
 *           description: La descripción del deseo.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora en que se creó el deseo.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora de la última actualización del deseo.
 *
 *   responses:
 *     HistoryWithWishes:
 *       description: Devuelve el historial del usuario junto con los deseos finalizados
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               history:
 *                 $ref: '#/components/schemas/History'
 *               wishes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Wish'
 *
 *   parameters:
 *     userId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del usuario para el cual se quiere obtener el historial
 */

/**
 * @swagger
 * /protected/history/{id}:
 *   get:
 *     summary: Obtiene el historial del usuario y sus deseos finalizados
 *     description: Retorna el historial del usuario, incluyendo la puntuación más alta y los deseos que ha finalizado.
 *     tags:
 *       - Historial
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HistoryWithWishes'
 *       404:
 *         description: Historial no encontrado para el usuario especificado
 *       500:
 *         description: Error interno del servidor
 */

router.get('/:id', authMiddleware, (req, res) => historyController.getHistory(req, res));

module.exports = router;