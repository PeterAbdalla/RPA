const express = require('express');
const project1Controller = require('../../controllers/project1.controller');
const project2Controller = require('../../controllers/project2.controller');

const router = express.Router();

router.get('/1/1', project1Controller.task1);
router.get('/1/2', project1Controller.task2);
router.get('/1/3,4,5', project1Controller.task3);
router.get('/2/1,2', project2Controller.task1);
router.get('/2/3,4', project2Controller.task2);

module.exports = router;
