const { Schema } = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

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
    }
  },
  {
    versionKey: false,
    strict: 'throw'
  }
);

columnSchema.plugin(toJson);

module.exports = columnSchema;
