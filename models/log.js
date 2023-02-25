const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ["Created", "Updated", "Deleted"],
    required: true,
  },
  model: { type: String, required: true },
  modelId: { type: String },
  changes: [{ type: String }],
});

LogSchema.virtual("modelurl").get(function () {
  if (this.type !== "Deleted") {
    return `/${this.model}/${this.modelId}`;
  }
  return "";
});

module.exports = mongoose.model("Log", LogSchema);
