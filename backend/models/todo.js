const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: String,
  category: String,
  checked: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Todo", todoSchema);
