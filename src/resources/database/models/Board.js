const { model, Schema } = require('mongoose');
const columnSchema = require('../schemas/Column');

const boardSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    columns: [columnSchema]
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

module.exports = model('Board', boardSchema);
