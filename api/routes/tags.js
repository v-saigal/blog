const express = require("express");
const router = express.Router();

const TagController = require("../controllers/tags");

router.post("/", TagController.Create);
// router.put("/RemoveLike/", NotesController.RemoveLike);
// router.put("/comment/", NotesController.Comment );

module.exports = router;
