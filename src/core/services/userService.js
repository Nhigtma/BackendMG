const { auth } = require('../../config/Firebase');
const UserRepository = require('../../adapters/outbound/userRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(username, email, password) {
        try {
            const usernameString = String(username).trim();
            const emailString = String(email).trim();
            const passwordString = String(password).trim();

            const userRecord = await auth.createUser({
                email: emailString,
                password: passwordString,
                displayName: usernameString
            });

            const newUser = await this.userRepository.createUser(
                userRecord.uid,
                usernameString,
                userRecord.email
            );

            return { user: newUser, uid: userRecord.uid };
        } catch (error) {
            console.error('Error en registerUser:', error);
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    async login(email, password) {
        try {
            const userRecord = await auth.getUserByEmail(email);
            if (!userRecord) {
                throw new Error('Usuario no encontrado');
            }
            return { user: userRecord.uid };
        } catch (error) {
            throw new Error('Error al autenticar el usuario: ' + error.message);
        }
    }

    async verifyToken(token) {
        try {
            const decodedToken = await auth.verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new Error('Token inválido: ' + error.message);
        }
    }
}

module.exports = UserService;