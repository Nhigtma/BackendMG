const { EntitySchema } = require('typeorm');

const Comment = new EntitySchema({
    name: "Comment",
    tableName: "comment",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: true
        },
        wish_id: {
            type: "uuid",
        },
        comment_text: {
            type: "varchar",
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }

    }
});

module.exports = Comment;