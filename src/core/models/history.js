const { EntitySchema } = require('typeorm');

const History = new EntitySchema({
    name: "History",
    tableName: "history",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        wish_id: {
            type: "uuid",
        },
        created_date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }

    }
});

module.exports = History;