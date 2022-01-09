const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');


router.get('/', projectController.getAllProjectAritcles);
router.post('/', projectController.createProjectAritcle);
router.put('/:projectId', projectController.modifyProjectAritcle);
router.delete('/prijectId',projectController.deleteProject)
module.exports = router;