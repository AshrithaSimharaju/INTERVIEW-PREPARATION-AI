const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  note: { type: String, default: "" },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
