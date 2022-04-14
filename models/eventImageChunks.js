const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chunks = new Schema({
  files_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  n: {
    type: Number,
  },
  data: {
    type: Buffer,
  },
});

module.exports = mongoose.model("eventimage.chunks", chunks);