const express = require('express');
const WishController = require('../../ports/wishController');
const authMiddleware = require('../../middleweres/verifyToken');

const router = express.Router();
const wishController = new WishController();

router.post('/create', authMiddleware, (req, res) => wishController.createWish(req, res));
router.get('/:id', authMiddleware, (req, res) => wishController.getWishById(req, res));
router.get('/user/:user_id', authMiddleware, (req, res) => wishController.getAllWishes(req, res));
router.put('/:id', authMiddleware, (req, res) => wishController.updateWish(req, res));
router.delete('/:id', authMiddleware, (req, res) => wishController.deleteWish(req, res));

module.exports = router;