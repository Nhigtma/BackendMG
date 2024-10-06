const express = require('express');
const router = express.Router();
const UserPointsController = require('../../ports/userPointsController');
const authMiddleware = require('../../middleweres/verifyToken');

const userPointsController = new UserPointsController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPoints:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del registro de puntos
 *         user_id:
 *           type: string
 *           description: ID del usuario asociado
 *         points:
 *           type: integer
 *           description: Puntos actuales del usuario
 *         multiplier:
 *           type: number
 *           format: float
 *           description: Multiplicador actual del usuario
 *
 *   responses:
 *     UserPointsResponse:
 *       description: Devuelve los puntos y multiplicador actuales del usuario
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPoints'
 *
 *   parameters:
 *     userId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del usuario cuyos puntos se quieren obtener
 */

/**
 * @swagger
 * /protected/points/{id}:
 *   get:
 *     summary: Obtiene los puntos actuales y el multiplicador de un usuario
 *     description: Retorna los puntos actuales del usuario junto con su multiplicador.
 *     tags:
 *       - UserPoints
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserPointsResponse'
 *       404:
 *         description: No se encontraron puntos para el usuario especificado
 *       500:
 *         description: Error interno del servidor
 */

router.get('/:id', authMiddleware, (req, res) => userPointsController.getScore(req, res));

module.exports = router;