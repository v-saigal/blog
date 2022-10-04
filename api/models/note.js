const mongoose = require("mongoose");
const User = require("./user");
const Tag = require("./tag");

const NoteSchema = new mongoose.Schema({
  noteContent: String,
  datePosted: {
    type: Date,
    default: () => Date.now(),
  },
  noteAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  tags:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: Tag,
  }]
});
// Update the route? That works with Notema
// Create some tests to check this works for the model file and controller
// Integrate with the frontend? Date.now =>
const Note = mongoose.model("Note", NoteSchema);

Note.insertMany([
  {noteContent: 'Test Note one', datePosted: "2017-05-18T16:00:00Z"},
  {noteContent: 'Test Note two', datePosted: "2018-05-18T16:00:00Z"},
  {noteContent: 'Test Note three', datePosted: "2016-05-18T16:00:00Z"}
]);

module.exports = Note;
