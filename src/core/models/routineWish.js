const { EntitySchema } = require('typeorm');

const RoutineWish = new EntitySchema({
    name: "Routine_wish",
    tableName: "routine_wish",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        wish_id: {
            type: "uuid",
        },
        week_day_id: {
            type: "uuid",
        },
        routine_description: {
            type: "text",
        },
        routines: {
            type: "JSONB",
        }
    }
});

module.exports = RoutineWish;