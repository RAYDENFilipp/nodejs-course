const { model, Schema } = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

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
    userId: { type: Schema.Types.ObjectId, default: null },
    columnId: { type: Schema.Types.ObjectId, default: null },
    boardId: { type: Schema.Types.ObjectId, default: null }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

taskSchema.plugin(toJson);

module.exports = model('Task', taskSchema);
