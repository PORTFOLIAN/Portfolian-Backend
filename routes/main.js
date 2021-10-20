const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('hell portfolian!')
  })


// // contoller
// const main = require('../controllers/main')

module.exports = router;