const express = require('express');
const router = express.Router();



// // contoller
// const auth = require('../controllers/auth')


router.get('/', (req, res) => {
    res.send(' portfolian login!')
  })

module.exports = router;