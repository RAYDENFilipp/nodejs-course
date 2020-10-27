const { Schema } = require('mongoose');

module.exports = new Schema(
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
