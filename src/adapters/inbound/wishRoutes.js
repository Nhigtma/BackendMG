const express = require('express');
const WishController = require('../../ports/wishController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const wishController = new WishController();

/**
 * @swagger
 * tags:
 *   name: Wishes
 *   description: Gestión de deseos
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *         wasperformed:
 *           type: boolean
 *           description: Si la rutina fue realizada o no.
 *         is_routine:
 *           type: boolean
 *           description: Indica si es una rutina.
 *         weekly_counter:
 *           type: integer
 *           description: Contador semanal de rutinas cumplidas.
 *       required:
 *         - user_id
 *         - title
 */

/**
 * @swagger
 * /protected/wishes/create:
 *   post:
 *     summary: Crea un nuevo deseo
 *     tags: [Wishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID del usuario que crea el deseo.
 *               title:
 *                 type: string
 *                 description: Título del deseo.
 *               description:
 *                 type: string
 *                 description: Descripción del deseo.
 *     responses:
 *       201:
 *         description: Deseo creado exitosamente
 *       400:
 *         description: El título y el ID del usuario son obligatorios.
 *       500:
 *         description: Error al crear el deseo
 */
router.post('/create', authMiddleware, (req, res) => wishController.createWish(req, res));

/**
 * @swagger
 * /protected/wishes/{id}:
 *   get:
 *     summary: Obtiene un deseo por ID
 *     tags: [Wishes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del deseo que se quiere obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deseo encontrado
 *       404:
 *         description: Deseo no encontrado
 *       500:
 *         description: Error al obtener el deseo
 */
router.get('/:id', authMiddleware, (req, res) => wishController.getWishById(req, res));

/**
 * @swagger
 * /protected/wishes/user/{user_id}:
 *   get:
 *     summary: Obtiene todos los deseos de un usuario
 *     tags: [Wishes]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario del cual se quieren obtener los deseos
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de deseos del usuario
 *       404:
 *         description: No se encontraron deseos para este usuario
 *       500:
 *         description: Error al obtener los deseos
 */
router.get('/user/:user_id', authMiddleware, (req, res) => wishController.getAllWishes(req, res));

/**
 * @swagger
 * /protected/wishes/{id}:
 *   put:
 *     summary: Actualiza un deseo por ID
 *     tags: [Wishes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del deseo que se quiere actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título del deseo.
 *               description:
 *                 type: string
 *                 description: Nueva descripción del deseo.
 *     responses:
 *       200:
 *         description: Deseo actualizado exitosamente
 *       404:
 *         description: Deseo no encontrado
 *       500:
 *         description: Error al actualizar el deseo
 */
router.put('/:id', authMiddleware, (req, res) => wishController.updateWish(req, res));

/**
 * @swagger
 * /protected/wishes/{id}:
 *   delete:
 *     summary: Elimina un deseo por ID
 *     tags: [Wishes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del deseo que se quiere eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deseo eliminado correctamente
 *       404:
 *         description: Deseo no encontrado
 *       500:
 *         description: Error al eliminar el deseo
 */
router.delete('/:id', authMiddleware, (req, res) => wishController.deleteWish(req, res));

/**
 * @swagger
 * /protected/wishes/complete/{wish_id}:
 *   post:
 *     summary: Marca un deseo como completado
 *     tags: [Wishes]
 *     parameters:
 *       - name: wish_id
 *         in: path
 *         required: true
 *         description: ID del deseo que se quiere completar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID del usuario que completa el deseo.
 *     responses:
 *       200:
 *         description: Deseo completado
 *       500:
 *         description: Error al completar el deseo
 */
router.post('/complete/:wish_id', authMiddleware, (req, res) => wishController.completeWish(req, res));

/**
 * @swagger
 * /protected/wishes/performRoutine/{wish_id}:
 *   post:
 *     summary: Marca la rutina del deseo como realizada
 *     tags: [Wishes]
 *     parameters:
 *       - name: wish_id
 *         in: path
 *         required: true
 *         description: ID del deseo con rutina
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID del usuario que realizó la rutina.
 *     responses:
 *       200:
 *         description: Rutina marcada como realizada
 *       500:
 *         description: Error al realizar la rutina
 */
router.post('/performRoutine/:wish_id', authMiddleware, (req, res) => wishController.performRoutine(req, res));

/**
 * @swagger
 * /protected/wishes/resetWasPerformed/{user_id}:
 *   post:
 *     summary: Reinicia el estado "wasperformed" de las rutinas del usuario
 *     tags: [Wishes]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado "wasperformed" reiniciado
 *       500:
 *         description: Error al reiniciar el estado "wasperformed"
 */
router.post('/resetWasPerformed/:user_id', authMiddleware, (req, res) => wishController.resetWasPerformed(req, res));

module.exports = router;