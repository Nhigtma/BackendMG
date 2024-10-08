const RoutineWishService = require('../core/services/routineWishesService');
const WishService = require('../core/services/wishService');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

class RoutineWishController {
    constructor() {
        this.routineWishService = new RoutineWishService();
        this.wishService = new WishService();
    }

    async createWishWithRoutine(req, res) {
        const { title, description, user_id, category_id, routines, is_routine } = req.body;

        try {
            console.log('Datos recibidos:');
            console.log('Title:', title);
            console.log('Description:', description);
            console.log('User ID:', user_id);
            console.log('Category ID:', category_id);
            console.log('Routines:', routines);
            console.log('Is Routine:', is_routine);

            if (!title || !description || !user_id || !category_id || !routines || !is_routine) {
                return res.status(400).json({ message: "Faltan datos requeridos." });
            }

            const result = await this.wishService.createWishWithRoutine(
                title,
                description,
                user_id,
                category_id,
                routines,
                is_routine
            );

            return res.status(201).json({
                message: "Deseo creado con éxito",
                wish: result.wish,
                routines: result.routines
            });

        } catch (error) {
            console.error('Error en createWishWithRoutine:', error.message);
            return res.status(500).json({ message: "Error al crear el deseo con rutina: " + error.message });
        }
    }

    async getRoutinesByWishId(req, res) {
        const { wishId } = req.params;

        try {
            const routines = await this.routineWishService.getRoutinesByWishId(wishId);
            return res.status(200).json(routines);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getWishesWithLists(req, res) {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "El user_id es requerido." });
        }

        try {
            const wishesWithLists = await this.wishService.getWishesWithLists(user_id);
            return res.status(200).json(wishesWithLists);
        } catch (error) {
            console.error('Error en getWishesWithLists:', error.message);
            return res.status(500).json({ message: "Error al obtener los deseos con listas: " + error.message });
        }
    }

    async updateRoutineWish(req, res) {
        const { wishId } = req.params;
        const { routines } = req.body;

        try {
            const updatedRoutines = await this.routineWishService.updateRoutineWish(wishId, routines);
            return res.status(200).json(updatedRoutines);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteRoutineWish(req, res) {
        const { routineId } = req.params;

        try {
            const result = await this.routineWishService.deleteRoutineWish(routineId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async generatePDF(req, res) {
        const userId = req.params.userId;
        const dias = {
            LUNES: "3eaf730d-79f4-481b-9779-61f05370bf94",
            MARTES: "db467a33-3486-439a-9a26-11864fb55be6",
            MIERCOLES: "004e5c38-9266-4eb0-b71b-05b462c24d30",
            JUEVES: "6c5d6e27-8594-4999-8129-5a618c869ce5",
            VIERNES: "c53082d3-12a5-4f0d-b794-ce4fa8d8307e",
            SABADO: "44079d90-eb72-4216-a887-fc8e130f8ea8",
            DOMINGO: "d03406b9-ec67-45aa-8454-3e848ac3fcbf"
        };
    
        const weekOrder = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
        
        const wishesWithRoutines = await this.wishService.getWishesWithLists(userId);
        
        const routinesByDay = {};
    
        wishesWithRoutines.forEach(wish => {
            if (wish.is_routine) {
                wish.routines.forEach(routine => {
                    const dayKey = Object.keys(dias).find(day => dias[day] === routine.week_day_id);
                    if (dayKey) {
                        if (!routinesByDay[dayKey]) {
                            routinesByDay[dayKey] = [];
                        }
                        routinesByDay[dayKey].push({ wishTitle: routine.routines });
                    }
                });
            }
        });
    
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=routines_${userId}.pdf`);
        
        doc.pipe(res);
        doc.fontSize(25).text('Rutinas de la Semana', { align: 'center' });
        doc.moveDown();
    
        const cellWidth = (doc.page.width - 100) / weekOrder.length;
        const startX = 50;
        let startY = doc.y;
        const lineHeight = 25;
        const fontSize = 15;
    
        weekOrder.forEach((day, index) => {
            const textY = startY + (lineHeight - 10) / 2;
            doc.fontSize(fontSize).font('Helvetica-Bold').text(day, startX + index * cellWidth, textY, { width: cellWidth, align: 'center' });
        });
        startY += lineHeight;
    
        const maxRoutines = Math.max(...weekOrder.map(day => (routinesByDay[day] || []).length));
    
        weekOrder.forEach((_, index) => {
            const x = startX + index * cellWidth;
            const y = startY - lineHeight;
            doc.rect(x, y, cellWidth, lineHeight + (maxRoutines * lineHeight)).stroke();
        });
    
        for (let rowIndex = 0; rowIndex < maxRoutines; rowIndex++) {
            weekOrder.forEach((day, index) => {
                const routine = routinesByDay[day] ? routinesByDay[day][rowIndex] : null;
                const text = routine ? routine.wishTitle : '';
                const yPosition = startY + lineHeight * rowIndex;
                const textY = yPosition + (lineHeight - 10) / 2;
                doc.fontSize(fontSize).font('Helvetica').text(text, startX + index * cellWidth, textY, { width: cellWidth, align: 'center' });
                const cellX = startX + index * cellWidth;
                doc.rect(cellX, yPosition, cellWidth, lineHeight).stroke();
            });
        }
    
        doc.end();
    }
    
}

module.exports = RoutineWishController;