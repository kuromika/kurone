const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: { type: String, required: true },
  franchise: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
});

CharacterSchema.virtual("url").get(function () {
  return `/character/${this._id}`;
});

module.exports = mongoose.model("Character", CharacterSchema);
