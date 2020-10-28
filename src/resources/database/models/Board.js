const { model, Schema } = require('mongoose');
const columnSchema = require('../schemas/Column');
const toJson = require('@meanie/mongoose-to-json');

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

boardSchema.plugin(toJson);

module.exports = model('Board', boardSchema);
