const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { uploadFile } = require('../middleware/tools');
const { deleteFilesInDirectory } = require('../functions')
const router = express.Router();
const AWS = require('aws-sdk');
const url = require('url');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


router.post("/", [requireAuth(), uploadFile], (req, res) => {
    const fileUrl = req.file
    res.send(fileUrl);
});

router.post("/generate-presigned-url", [requireAuth()], (req, res) => {
    const { fileName, fileType, folder } = req.body;
    if (!fileName || !fileType || !folder) return res.status(500).send({ error: 'missing data' });
    const s3Params = {
        Bucket: process.env.S3_BUCKET, 
        Key: `${folder}/${fileName}`, 
        Expires: 60, // URL expiry time in seconds
        ContentType: fileType,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, (err, url) => {
        if (err) {
          return res.status(500).json({ error: 'Error generating pre-signed URL' });
        }
        res.send({ url });
    });
});

router.delete("/delete_file", async (req, res) => {
    const { fileUrl  } = req.body;
  
    const parsedUrl = url.parse(fileUrl);
    const key = parsedUrl.pathname.substring(1);
  
    const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };
  
    s3.deleteObject(s3Params, (err, data) => {
      if (err) {
        return res.status(500).send({ error: 'Error deleting file' });
      }
      res.send({ message: 'File deleted successfully' });
    });
  
});

router.delete("/", async (req, res) => {
    // console.log(req.body); 
    const directory = './assets/uploads';
    const ret = await deleteFilesInDirectory(directory, req.body.filesToDelete);
    res.send(ret)
});



module.exports = router;