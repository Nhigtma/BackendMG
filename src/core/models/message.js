const { EntitySchema } = require('typeorm');

const Message = new EntitySchema({
    name: "Message",
    tableName: "messages",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid"
        },
        content: {
            type: "varchar",
            nullable: false
        },
        type: { // 'congratulation' o 'motivation'
            type: "varchar",
            nullable: false
        },
        usageProbability: {
            type: "float",
            nullable: false,
            default: 50.0
        }
    }
});

module.exports = Message;