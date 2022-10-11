const mongoose = require("mongoose");
const User = require("./user");
const Tag = require("./tag");

const NoteSchema = new mongoose.Schema({
  title: String,
  noteContent: String,
  datePosted: {
    type: Date,
    default: () => Date.now(),
  },
  noteAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  tags: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: Tag,
  }],
  articleImage: String
});
// Update the route? That works with Notema
// Create some tests to check this works for the model file and controller
// Integrate with the frontend? Date.now =>
const Note = mongoose.model("Note", NoteSchema);



module.exports = Note;
