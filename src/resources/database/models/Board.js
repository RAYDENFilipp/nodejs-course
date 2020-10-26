const { model, Schema } = require('mongoose');

const boardSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }]
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('Board', boardSchema);
