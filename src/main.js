require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('../src/adapters/inbound/userRoutes');
const wishesRoutes = require('../src/adapters/inbound/wishRoutes');
const categoryRoutes = require('../src/adapters/inbound/categoryRoutes')
const routineWishesRoutes = require('../src/adapters/inbound/routineWishesRoutes')
const { AppDataSource } = require('../src/config/ormConfig');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/protected/wishes', wishesRoutes);
app.use('/protected/category', categoryRoutes);
app.use('/protected/routines', routineWishesRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });