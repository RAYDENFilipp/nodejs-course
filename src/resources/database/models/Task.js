const { model, Schema } = require('mongoose');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column' },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board' }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('Task', taskSchema);
