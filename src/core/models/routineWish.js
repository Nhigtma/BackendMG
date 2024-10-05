const { EntitySchema } = require('typeorm');

const RoutineWish = new EntitySchema({
    name: "routine_wish",
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
        routines: {
            type: "jsonb",
        }
    }
});

module.exports = RoutineWish;