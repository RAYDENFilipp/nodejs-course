const { model, Schema } = require('mongoose');

const columnSchema = new Schema(
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
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Column' }]
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('Column', columnSchema);
