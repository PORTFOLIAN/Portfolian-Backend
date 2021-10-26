const express = require('express');
const router = express.Router();
// const bookmarkcontroller = require('../controllers/bookmark');

//로당
router.get('/', (req, res) => {
    res.send('hell portfolian!')
  })

//북마크
  // router.post('/main/bookmark', bookmarkcontroller.bookmark);


// // contoller
// const main = require('../controllers/main')

module.exports = router;