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
    userId: Schema.Types.ObjectId,
    columnId: Schema.Types.ObjectId,
    boardId: Schema.Types.ObjectId
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

taskSchema.plugin(toJson);

module.exports = model('Task', taskSchema);
