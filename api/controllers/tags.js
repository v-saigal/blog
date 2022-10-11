const { response } = require("express");
const TokenGenerator = require("../models/token_generator");
const Note = require("../models/note")
const Tag = require("../models/tag")

const TagsController = {

  Create:  (req, res) => {
    // const tag = new Tag(req.body);
    // tag.save(async (err) => {
    //   if (err) {
    //     throw err; // Not sure how to test this?
    //   }
      const tagNames = req.body;

        Tag.find({name: {$in: tagNames}}).then(existingTags =>{
          if (existingTags){
          for(let i = tagNames.length-1; i > -1; i--){
            if (existingTags.some(tag => tag.name==tagNames[i])){
              console.log(tagNames)
              console.log(i)
              tagNames.splice(i, 1)
              console.log(tagNames)
            }
          }
          console.log(tagNames)
          if (tagNames.length>0){


            const tagObjects = tagNames.map(tagName =>{
            return {name: tagName}
          })

          Tag.create(tagObjects).then(createdTags =>{
            console.log(existingTags.concat(createdTags))
            res.status(201).json({ message: 'OK', tag: existingTags.concat(createdTags) });

        })
      }else{
        res.status(201).json({ message: 'OK', tag: existingTags})
      }


      }
    })


      // console.log("\n Created Tag:\n", docTag);

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
