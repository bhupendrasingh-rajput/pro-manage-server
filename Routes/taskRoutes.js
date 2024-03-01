const express = require("express");
const router = express.Router();
const verifyToken = require('../Middlewares/authMiddleware');
const { createTask, getAllTasks, getTaskById, deleteTaskById, updateTaskById } = require('../Controllers/taskController');

router.post('/add-task', verifyToken, createTask);
router.get('/get-all', verifyToken, getAllTasks);
router.get('/task-details/:taskId', getTaskById);
router.delete('/delete/:taskId', verifyToken, deleteTaskById);
router.put('/update/:taskId', verifyToken, updateTaskById);

module.exports = router;