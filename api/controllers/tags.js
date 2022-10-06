const { response } = require("express");
const TokenGenerator = require("../models/token_generator");
const Note = require("../models/note")
const Tag = require("../models/tag")

const TagsController = {

  Create: async (req, res) => {
    const tag = new Tag(req.body);
    // tag.save(async (err) => {
    //   if (err) {
    //     throw err; // Not sure how to test this?
    //   }
      Tag.create(tag).then(docTag => {
      console.log("\n>> Created Tag:\n", docTag);
      res.status(201).json({ message: 'OK', tag: docTag });
      ;
    // })
    });
},
  Delete: (req, res) => {
    Note.deleteOne({_id: req.body._id}, (err) => {
      if (err) {
        throw err; // Not sure how to test this?
      } else {
        res.status(201).json({ message: 'OK' });
      }
    })
  },
  AddTagToNote: async (req, res) => {
    Note.findByIdAndUpdate(Note.noteId,
      { _id: req.body._id,
        $push: {tags: { tag_id: req.body.tag_id, } },
        new: true, useFindAndModify: false
      })
  },


};

module.exports = TagsController;
