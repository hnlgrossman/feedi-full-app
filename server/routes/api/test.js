const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    data = { "name": "test"}
    res.send(data);
})

module.exports = router;