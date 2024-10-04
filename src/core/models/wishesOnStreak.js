const { EntitySchema } = require('typeorm');

const WishesOnStreak = new EntitySchema({
    name: "WishesOnStreak",
    tableName: "wishes_on_streak",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        wish_id: {
            type: "uuid",
        },
        streak_count: {
            type: "int",
        },
        category_id: {
            type: "uuid",
        },
        created_date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        update_date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }

    }
});

module.exports = WishesOnStreak;