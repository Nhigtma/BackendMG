const { EntitySchema } = require('typeorm');

const WishesState = new EntitySchema({
    name: "WishesState",
    tableName: "wishes_state",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        state_name: {
            type: "varchar",
        }
    }
});

module.exports = WishesState;