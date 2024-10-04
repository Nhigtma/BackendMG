const { DataSource } = require('typeorm');
const User = require('../core/models/user');
const Wish = require('../core/models/wishes');
const Category = require('../core/models/category');
const Comment = require('../core/models/comment');
const History = require('../core/models/history');
const WishesOnStreak = require('../core/models/wishesOnStreak');
const WishesState = require('../core/models/WishesState');

const connectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'sturdy-spirit-7353.g8z.gcp-us-east1.cockroachlabs.cloud',
    port: parseInt(process.env.DB_PORT, 10) || 26257,
    username: process.env.DB_USER || 'julian',
    password: process.env.DB_PASSWORD || '3ayCn9aYlQNRkbpExGv74g',
    database: process.env.DB_NAME || 'modo_guerra',
    synchronize: false,
    logging: true,
    entities: [User,Wish,Category,Comment,History,WishesOnStreak,WishesState],
    ssl: {
        rejectUnauthorized: true,
    },
};

const AppDataSource = new DataSource(connectionOptions);


AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos inicializada');
    })
    .catch((error) => console.log('Error al inicializar la base de datos:', error));

module.exports = {
    AppDataSource
};