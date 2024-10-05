const { EntitySchema } = require('typeorm');

const Wish = new EntitySchema({
    name: "Wish",
    tableName: "wishes",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true,
        },
        user_id: {
            type: "uuid",
        },
        category_id: {
            type: "uuid",
        },
        state_id: {
            type: "uuid",
        },
        title: {
            type: "varchar",
            length: 255,
        },
        description: {
            type: "varchar",
            length: 255,
        },
        wasperformed: {
            type: "boolean",
            default: false
        },
        is_routine: {
            type: "boolean",
            default: "false"
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
module.exports = Wish;
