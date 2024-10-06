const express = require('express');
const UserController = require('../../ports/userController');
const { userService } = require('../../core/services/userService');

const router = express.Router();
const userController = new UserController(userService);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del usuario.
 *         username:
 *           type: string
 *           description: El nombre de usuario.
 *         email:
 *           type: string
 *           description: El correo electrónico del usuario.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora en que se creó el usuario.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: La fecha y hora de la última actualización del usuario.
 *       required:
 *         - username
 *         - email
 */

/**
 * @swagger
 *  /users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nombre del usuario
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Información del usuario creado
 *                 uid:
 *                   type: string
 *                   description: ID único del usuario en Firebase
 *       400:
 *         description: Todos los campos son obligatorios.
 *       500:
 *         description: Error al crear el usuario
 */
router.post('/register', (req, res) => userController.register(req, res));

/**
 * @swagger
 *  /users/login:
 *   post:
 *     summary: Inicia sesión un usuario existente
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Información del usuario que inició sesión
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', (req, res) => userController.login(req, res));

module.exports = router;