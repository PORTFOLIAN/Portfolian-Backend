const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');


router.get('/', projectController.getProjectAritcle);
router.post('/', projectController.createProjectAritcle);
router.put('/:projectId', projectController.modifyProjectAritcle);

module.exports = router;