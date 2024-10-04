const express = require('express');
const router = express.Router();
const RoutineWishController = require('../../ports/routineWishesController');
const authMiddleware = require('../../middleweres/verifyToken');

const routineWishController = new RoutineWishController();


router.post('/wishesRoutine',authMiddleware, (req, res) => routineWishController.createWishWithRoutine(req, res));

router.get('/wishes/:wishId/routines',authMiddleware, (req, res) => routineWishController.getRoutinesByWishId(req, res));

router.get('/allRoutines',authMiddleware, (req, res) => routineWishController.getWishesWithLists(req,res));

router.put('/wishes/:wishId/routines',authMiddleware, (req, res) => routineWishController.updateRoutineWish(req, res));

router.delete('/wishes/routines/:routineId',authMiddleware, (req, res) => routineWishController.deleteRoutineWish(req, res));

module.exports = router;