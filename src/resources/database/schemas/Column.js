const { Schema, Types } = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

const columnSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: new Types.ObjectId()
    },
    title: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    strict: 'throw',
    _id: false
  }
);

columnSchema.plugin(toJson);

module.exports = columnSchema;
