const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: "varchar",
            primary: true,
        },
        username: {
            type: "varchar",
        },
        email: {
            type: "varchar",
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }

    }
});

module.exports = User;