const auth = require('../config/Firebase');
const UserService = require('../core/services/userService');
const UserRepository = require('../../src/adapters/outbound/userRepository');

class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        this.userService = new UserService(this.userRepository);
    }

    async register(req, res) {
        console.log('Register called:', req.body);
        const { name, email, password } = req.body;
    
        try {
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }
    
            const nameString = String(name).trim();
            const emailString = String(email).trim();
            const passwordString = String(password).trim();
    
            if (passwordString === '') {
                throw new Error('La contraseña debe ser una cadena no vacía');
            }
    
            const { user, uid } = await this.userService.registerUser(nameString, emailString, passwordString);
    
            res.status(201).json({ user, uid });
        } catch (error) {
            console.error('Error en registerUser:', error);
            res.status(500).json({ error: 'Error al crear el usuario: ' + error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const { user} = await this.userService.login(email, password);
            res.status(200).json({ user});
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            res.status(401).json({ error: 'Credenciales inválidas: ' + error.message });
        }
    }
}

module.exports = UserController;