const express = require("express");
const router = express.Router();
const multer = require("multer")


let storage = multer.diskStorage({
      
  destination: (req, file, callback) => {
      console.log('--------------------')
    callback(null, '../frontend/public/uploads');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
})

let upload = multer({storage: storage});

const NotesController = require("../controllers/notes");
router.post("/update", upload.single('articleName'), NotesController.Update);
router.get("/:id", NotesController.FindById)
router.get("/", NotesController.Index);
router.post("/", upload.single('articleImage'), NotesController.Create);
router.delete("/", NotesController.Delete);
// router.put("/RemoveLike/", NotesController.RemoveLike);
// router.put("/comment/", NotesController.Comment );

module.exports = router;
