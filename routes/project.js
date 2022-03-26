const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');
const upload = require("../S3/S3.js");
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const { getUserIdByAccessToken } = require('../middlewares/getUserIdByAccessToken');
const { validateQueryParm } = require('../middlewares/validateQueryPram');
const { validateArticleContents } = require('../middlewares/validateArticleContents');

router.get('/', validateQueryParm, getUserIdByAccessToken, projectController.getAllProjectAritcles);
router.get('/:projectId', getUserIdByAccessToken, projectController.getProjectArticle);

router.post('/', validateAccessToken, validateArticleContents, projectController.createProjectAritcle);
router.put('/:projectId', validateAccessToken, validateArticleContents, projectController.modifyProjectAritcle);
router.delete('/:projectId', validateAccessToken, projectController.deleteProject);

router.post('/image', validateAccessToken, upload.single('photo'), projectController.createImage);

module.exports = router;