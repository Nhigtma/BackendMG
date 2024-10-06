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
        user_id: {
            type: "varchar",
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