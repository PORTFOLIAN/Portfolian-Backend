const express = require('express');
const router = express.Router();


// // contoller
// const mypage = require('../controllers/mypage')

router.get('/', (req, res) => {
    res.send('portfolian mypage!')
  })

module.exports = router;