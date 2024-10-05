const userPoints = new EntitySchema({
    name: "UserPoints",
    tablename: "user_points",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid"
        },
        points: {
            type: "int",
            nullable: false,
            default: 0
        },
        multiplier: {
            type: "float",
            nullable: false,
            default: 1.0
        }
    }
});
module.exports = userPoints