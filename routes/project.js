const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.post('/', projectController.createProjectAritcle);
router.put('/:projectId', projectController.modifyProjectAritcle);

module.exports = router;