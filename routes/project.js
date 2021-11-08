const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.post('/', projectController.createProjectAritcle);
router.put('/', projectController.modifyProjectAritcle);

module.exports = router;