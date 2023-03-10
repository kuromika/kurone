const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FigureSchema = new Schema({
  name: { type: String, required: true },
  character: {
    type: Schema.Types.ObjectId,
    ref: "Character",
    required: "true",
  },
  manufacturer: { type: String },
  specs: { type: String },
  includes: { type: String },
  price: { type: Number, min: 0 },
  store: { type: String },
  height: { type: Number, min: 0 },
});

FigureSchema.virtual("url").get(function () {
  return `/figure/${this._id}`;
});

module.exports = mongoose.model("Figure", FigureSchema);
