const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const files = new Schema({
  length: {
    type: Number,
  },
  chunkSize: {
    type: Number,
  },
  uploadDate: {
    type: Date,
  },
  filename: {
      type: String,
  },
  contentType: {
      type: String
  }
});

module.exports = mongoose.model("studymaterialfile.files", files);

