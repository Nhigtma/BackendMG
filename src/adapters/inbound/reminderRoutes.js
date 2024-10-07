const express = require('express');
const ReminderController = require('../../ports/remindersController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const reminderController = new ReminderController();

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Gestión de recordatorios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reminder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: El ID único del recordatorio.
 *         reminder_date:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora del recordatorio.
 *         reminder_message:
 *           type: string
 *           description: El mensaje del recordatorio.
 *         is_sent:
 *           type: boolean
 *           description: Indica si el recordatorio ha sido enviado.
 *         user_id:
 *           type: string
 *           description: El ID del usuario asociado al recordatorio.
 *       required:
 *         - reminder_date
 *         - user_id
 *         - reminder_message
 */

/**
 * @swagger
 * /protected/reminders:
 *   post:
 *     summary: Crea un nuevo recordatorio
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reminder'
 *     responses:
 *       201:
 *         description: Recordatorio creado exitosamente
 *       400:
 *         description: Error en la solicitud, faltan campos requeridos.
 *       500:
 *         description: Error al crear el recordatorio
 */
router.post('/', authMiddleware, (req, res) => reminderController.createReminder(req, res));

/**
 * @swagger
 * /protected/reminders/{userId}:
 *   get:
 *     summary: Obtiene todos los recordatorios de un usuario
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario para obtener sus recordatorios
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de recordatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener los recordatorios
 */
router.get('/:userId', authMiddleware, (req, res) => reminderController.getReminders(req, res));

/**
 * @swagger
 * /protected/reminders/{id}:
 *   get:
 *     summary: Obtiene un recordatorio por ID
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del recordatorio que se quiere obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recordatorio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       404:
 *         description: Recordatorio no encontrado
 *       500:
 *         description: Error al obtener el recordatorio
 */
router.get('/:id', authMiddleware, (req, res) => reminderController.getReminder(req, res));

/**
 * @swagger
 * /protected/reminders/{id}:
 *   put:
 *     summary: Actualiza un recordatorio por ID
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del recordatorio que se quiere actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reminder'
 *     responses:
 *       200:
 *         description: Recordatorio actualizado exitosamente
 *       404:
 *         description: Recordatorio no encontrado
 *       500:
 *         description: Error al actualizar el recordatorio
 */
router.put('/:id', authMiddleware, (req, res) => reminderController.updateReminder(req, res));

/**
 * @swagger
 * /protected/reminders/{id}:
 *   delete:
 *     summary: Elimina un recordatorio por ID
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del recordatorio que se quiere eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Recordatorio eliminado correctamente
 *       404:
 *         description: Recordatorio no encontrado
 *       500:
 *         description: Error al eliminar el recordatorio
 */
router.delete('/:id', authMiddleware, (req, res) => reminderController.deleteReminder(req, res));

module.exports = router;
