const express = require('express');
const router = express.Router();

// // contoller
// const project = require('../controllers/project')


router.get('/', (req, res) => {
    res.send(' portfolian team!')
  })
module.exports = router;