const express = require('express');
const router = express.Router();
const RoutineWishController = require('../../ports/routineWishesController');
const authMiddleware = require('../../middleweres/verifyToken');

const routineWishController = new RoutineWishController();

/**
 * @swagger
 * components:
 *   schemas:
 *     RoutineWish:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         wish_id:
 *           type: string
 *           format: uuid
 *         week_day_id:
 *           type: string
 *           format: uuid
 *         routines:
 *           type: object
 *           additionalProperties:
 *             type: string
 *     Wish:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         category_id:
 *           type: string
 *           format: uuid
 *         state_id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         description:
 *           type: string
 *           maxLength: 255
 *         is_routine:
 *           type: boolean
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /protected/routines/wishesRoutine:
 *   post:
 *     summary: Crear un deseo con rutina
 *     tags: [RoutineWishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: string
 *               category_id:
 *                 type: string
 *               is_routine:
 *                 type: boolean
 *                 default: false
 *               routines:
 *                 type: object
 *                 example:
 *                   lunes: "some description"
 *                   martes: "some description"
 *                   miercoles: "some description"
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Deseo creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 wish:
 *                   $ref: '#/components/schemas/Wish'
 *                 routines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RoutineWish'
 */
router.post('/wishesRoutine', authMiddleware, (req, res) => routineWishController.createWishWithRoutine(req, res));

/**
 * @swagger
 * /protected/routines/wishes/{wishId}/routines:
 *   get:
 *     summary: Obtener rutinas por ID de deseo
 *     tags: [RoutineWishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: wishId
 *         in: path
 *         required: true
 *         description: ID del deseo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rutinas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoutineWish'
 */
router.get('/wishes/:wishId/routines', authMiddleware, (req, res) => routineWishController.getRoutinesByWishId(req, res));

/**
 * @swagger
 * /protected/routines/allRoutines:
 *   get:
 *     summary: Obtener todos los deseos con sus rutinas
 *     tags: [RoutineWishes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deseos y rutinas obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       category_id:
 *                         type: string
 *                       is_routine:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       routines:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             wish_id:
 *                               type: string
 *                             week_day_id:
 *                               type: string
 */
router.get('/allRoutines', authMiddleware, (req, res) => routineWishController.getWishesWithLists(req, res));

/**
 * @swagger
 * /protected/routines/wishes/{wishId}/routines:
 *   put:
 *     summary: Actualizar rutinas de un deseo
 *     tags: [RoutineWishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: wishId
 *         in: path
 *         required: true
 *         description: ID del deseo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routines:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rutinas actualizadas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoutineWish'
 */
router.put('/wishes/:wishId/routines', authMiddleware, (req, res) => routineWishController.updateRoutineWish(req, res));

/**
 * @swagger
 * /protected/routines/wishes/routines/{routineId}:
 *   delete:
 *     summary: Eliminar una rutina
 *     tags: [RoutineWishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: routineId
 *         in: path
 *         required: true
 *         description: ID de la rutina a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rutina eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/wishes/routines/:routineId', authMiddleware, (req, res) => routineWishController.deleteRoutineWish(req, res));

module.exports = router;