const express = require('express');
const CategoryController = require('../../ports/categoryController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: El ID único de la categoría.
 *         name:
 *           type: string
 *           description: El nombre de la categoría.
 *         description:
 *           type: string
 *           description: La descripción de la categoría.
 *       required:
 *         - name
 *         - description
 */

/**
 * @swagger
 * /protected/category:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: El nombre y la descripción son obligatorios.
 *       500:
 *         description: Error al crear la categoría
 */
router.post('/', authMiddleware, (req, res) => categoryController.createCategory(req, res));

/**
 * @swagger
 * /protected/category/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría que se quiere obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al obtener la categoría
 */
router.get('/:id', authMiddleware, (req, res) => categoryController.getCategoryById(req, res));

/**
 * @swagger
 * /protected/category:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al obtener las categorías
 */
router.get('/', authMiddleware, (req, res) => categoryController.getAllCategories(req, res));

/**
 * @swagger
 * /protected/category/{id}:
 *   put:
 *     summary: Actualiza una categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría que se quiere actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar la categoría
 */
router.put('/:id', authMiddleware, (req, res) => categoryController.updateCategory(req, res));

/**
 * @swagger
 * /protected/category/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría que se quiere eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
 */
router.delete('/:id', authMiddleware, (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;