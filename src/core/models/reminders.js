const { EntitySchema } = require('typeorm');

const Reminder = new EntitySchema({
    name: "reminders",
    tableName: "reminders",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true,
        },
        reminder_date: {
            type: "timestamp",
            nullable: false,
        },
        reminder_message: {
            type: "varchar", // Usa "varchar" en vez de "STRING" para TypeORM
            nullable: true,
        },
        is_sent: {
            type: "boolean",
            default: false,
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: true,
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: true,
        },
        user_id: {
            type: "varchar",
            nullable: true,
        },
    },
});

module.exports = Reminder;