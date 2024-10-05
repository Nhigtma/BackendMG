const { EntitySchema } = require('typeorm');

const History = new EntitySchema({
    name: "History",
    tableName: "history",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid"
        },
        wish_id: {
            type: "uuid",
            nullable: false
        },
        user_id: {
            type: "varchar",
            nullable: false
        },
        points: {
            type: "int",
            nullable: false
        },
        completed_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false
        },
        created_date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false
        }
    }
});


module.exports = History;