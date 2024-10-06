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
        user_id: {
            type: "varchar",
            nullable: false
        },
        highest_score: {
            type: "int",
            nullable: false,
            default: 0
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