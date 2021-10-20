const express = require('express');
const router = express.Router();



// // contoller
// const chat = require('../controllers/chat')


router.get('/', (req, res) => {
    res.send(' portfolian chat!')
  })
module.exports = router;