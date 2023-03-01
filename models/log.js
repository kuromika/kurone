const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const LogSchema = new Schema({
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ["Created", "Updated", "Deleted"],
    required: true,
  },
  model: {
    type: String,
    enum: ["Franchise", "Character", "Figure"],
    required: true,
  },
  modelId: { type: String },
  changes: [{ type: String }],
});

LogSchema.virtual("shortDate").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
});

LogSchema.virtual("modelurl").get(function () {
  if (this.type !== "Deleted") {
    return `/${this.model}/${this.modelId}`;
  }
  return "";
});

module.exports = mongoose.model("Log", LogSchema);
