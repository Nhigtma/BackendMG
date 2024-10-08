const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('../src/adapters/inbound/userRoutes');
const wishesRoutes = require('../src/adapters/inbound/wishRoutes');
const categoryRoutes = require('../src/adapters/inbound/categoryRoutes');
const routineWishesRoutes = require('../src/adapters/inbound/routineWishesRoutes');
const historyRoutes = require('../src/adapters/inbound/historyRoutes');
const userPoints = require('../src/adapters/inbound/userPointsRoutes');
const commentRoutes = require('../src/adapters/inbound/commentRoutes');
const reminderRoutes = require('../src/adapters/inbound/reminderRoutes');
const { AppDataSource } = require('../src/config/ormConfig');
const initializeScheduler = require('../src/config/scheduler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestión de Deseos',
            version: '1.0.0',
            description: 'API para gestionar deseos, rutinas y categorías.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [path.join(__dirname, '../src/adapters/inbound/*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/protected/wishes', wishesRoutes);
app.use('/protected/category', categoryRoutes);
app.use('/protected/routines', routineWishesRoutes);
app.use('/protected/history', historyRoutes);
app.use('/protected/points', userPoints);
app.use('/protected/comment', commentRoutes);
app.use('/protected/reminders', reminderRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida.');
        
        app.server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

        initializeScheduler(app);
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });
