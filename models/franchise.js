const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FranchiseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

FranchiseSchema.virtual("url").get(function () {
  return `/franchise/${this._id}`;
});

module.exports = mongoose.model("Franchise", FranchiseSchema);
