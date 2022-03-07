const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');
const upload = require("../S3/S3.js");


router.get('/', projectController.getAllProjectAritcles);
router.post('/', projectController.createProjectAritcle);
router.post('/image', upload.single('photo'), projectController.createImage);
router.put('/:projectId', projectController.modifyProjectAritcle);
router.delete('/:projectId', projectController.deleteProject);
router.get('/:projectId', projectController.getProjectArticle);

module.exports = router;