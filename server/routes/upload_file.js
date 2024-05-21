const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { uploadFile } = require('../middleware/tools');
const { deleteFilesInDirectory } = require('../functions')
const router = express.Router();



router.post("/", [requireAuth(), uploadFile], (req, res) => {
    const fileUrl = req.file
    res.send(fileUrl);
});

router.delete("/", async (req, res) => {
    // console.log(req.body); 
    const directory = './assets/uploads';
    const ret = await deleteFilesInDirectory(directory, req.body.filesToDelete);
    res.send(ret)
});



module.exports = router;