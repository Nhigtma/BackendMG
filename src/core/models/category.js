const { EntitySchema } = require('typeorm');

const Category = new EntitySchema({
    name: "Category",
    tableName: "category",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar",
        },
        description: {
            type: "varchar",
        }

    }
});

module.exports = Category;