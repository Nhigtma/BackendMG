const { EntitySchema } = require('typeorm');

const Week = new EntitySchema({
    name: "Week",
    tableName: "week",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        day_name: {
            type: "varchar",
        }
    }
});

module.exports = Week;