const express = require('express');
const CategoryController = require('../../ports/categoryController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const categoryController = new CategoryController();

router.post('/', authMiddleware, (req, res) => categoryController.createCategory(req, res));
router.get('/:id', authMiddleware, (req, res) => categoryController.getCategoryById(req, res));
router.get('/', authMiddleware, (req, res) => categoryController.getAllCategories(req, res));
router.put('/:id', authMiddleware, (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', authMiddleware, (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;